import {
  clientProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import {
  BookingCreationSchema,
  BookingUpdateSchema,
  TimeZoneOptions,
} from "~/schemas/bookingSchema";
import dayjs, { type Dayjs } from "dayjs";
import { InquirieType, UserRoles } from "~/schemas";
import { string } from "zod";
import sendEmail from "~/server/email";
import { isPuppy } from "./pets";

export const BookingErrors = {
  NOT_FOUND: "La reserva no fue encontrada.",
  FULL: "Horario ocupado!",
  LAST_DAY: "No puedes modificar una reserva en menos de 24hs!",
  ALREADY_BOOKED: "Ya tienes un turno ese día!",
  PAST_DATE: "El turno se encuentra en el pasado!",
  SUNDAY: "No abrimos los domingos!",
  VACCINE_B_YOUNG:
    "No se puede aplicar una antirrabica a un perro menor de 4 meses!",
  VACCINE_B_LAST_YEAR:
    "No se puede aplicar una antirrabica a un perro que ya tiene una en el ultimo año!",
} as const;

export function canUpdateBooking(date: Date | Dayjs) {
  return dayjs(date).isAfter(dayjs().add(1, "day"), "day");
}

export function bookingDateChecks(date: Dayjs) {
  if (!canUpdateBooking(date)) throw new Error(BookingErrors.LAST_DAY);
  if (date.isBefore(dayjs(), "day")) throw new Error(BookingErrors.PAST_DATE);
  if (date.day() === 0) throw new Error(BookingErrors.SUNDAY);
}

export const bookingsRouter = createTRPCRouter({
  create: clientProcedure
    .input(BookingCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { dog, user, ...booking } = input;

      const bookingDate = dayjs(booking.date);
      bookingDateChecks(bookingDate);

      const alreadyExists = await ctx.prisma.booking.findFirst({
        where: {
          dog: {
            id: dog,
          },
          date: {
            gt: bookingDate.startOf("day").toDate(),
            lt: bookingDate.endOf("day").toDate(),
          },
        },
      });
      if (alreadyExists) throw new Error(BookingErrors.ALREADY_BOOKED);

      const bookingsInSamedate = await ctx.prisma.booking.count({
        where: {
          date: {
            gt: dayjs(booking.date).startOf("day").toDate(),
            lt: dayjs(booking.date).endOf("day").toDate(),
          },
          timeZone: {
            equals: booking.timeZone,
          },
        },
      });
      if (bookingsInSamedate >= 20) throw new Error(BookingErrors.FULL);

      if (booking.type === InquirieType.VACCINE) {
        const dogData = await ctx.prisma.pet
          .findFirstOrThrow({
            where: {
              id: dog,
            },
          })
          .catch(() => {
            throw new Error("El perro no existe!");
          });

        if (booking.vaccine === "B") {
          if (isPuppy(dogData.birth)) {
            throw new Error(BookingErrors.VACCINE_B_YOUNG);
          }
          const alreadyHasVaccineB = await ctx.prisma.booking.findFirst({
            where: {
              dog: {
                id: dog,
              },
              vaccine: {
                equals: "B",
              },
              date: {
                gte: bookingDate.subtract(1, "year").toDate(),
              },
            },
          });
          if (alreadyHasVaccineB) {
            throw new Error(BookingErrors.VACCINE_B_LAST_YEAR);
          }
        }
        /* if (booking.vaccine === "A") {
          if (isPuppy) {
            const lastVaccineA = await ctx.prisma.booking.findFirst({
              where: {
                dog: {
                  id: dog,
                },
                vaccine: {
                  equals: "A",
                },
                date: {
                  gte: dayjs(booking.date).subtract(21, "day").toDate(),
                },
              },
            });
            if (lastVaccineA) {
              throw new Error(
                "No se puede aplicar una vacuna A a un perro que ya tiene una en los ultimos 21 dias!"
              );
            }
          } else {
            const lastVaccineA = await ctx.prisma.booking.findFirst({
              where: {
                dog: {
                  id: dog,
                },
                vaccine: {
                  equals: "A",
                },
                date: {
                  gte: dayjs().subtract(1, "year").toDate(),
                },
              },
            });
            if (lastVaccineA) {
              throw new Error(
                "No se puede aplicar una vacuna A a un perro que ya tiene una en el ultimo año!"
              );
            }
          } */
      }

      return ctx.prisma.booking.create({
        data: {
          ...booking,
          dog: {
            connect: { id: dog },
          },
          user: {
            connect: {
              id:
                ctx.session.user.role === UserRoles.VET
                  ? user
                  : ctx.session.user.id,
            },
          },
        },
      });
    }),

  //Returns all future bookings
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.booking.findMany({
      where: {
        date: {
          gte: dayjs().startOf("day").toDate(),
        },
        completed: {
          equals: false,
        },
        userId:
          ctx.session?.user.role === UserRoles.VET
            ? undefined
            : ctx.session?.user.id,
      },
      include: {
        dog: true,
        user: true,
      },
    });
  }),

  // Update a booking
  update: clientProcedure
    .input(BookingUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        dog,
        booking: { id, ...booking },
      } = input;

      const bookingDate = dayjs(booking.date);
      bookingDateChecks(bookingDate);
      const oldBooking = await ctx.prisma.booking.findUnique({
        where: {
          id,
        },
      });
      if (!oldBooking) throw new Error(BookingErrors.NOT_FOUND);

      // If the dog has a booking in the same day with the same type of booking, it can't be booked
      const alreadyBooked = await ctx.prisma.booking.findFirst({
        where: {
          dog: {
            id: dog,
          },
          date: {
            equals: booking.date,
          },
          type: {
            equals: booking.type,
          },
        },
      });
      if (alreadyBooked) throw new Error(BookingErrors.ALREADY_BOOKED);

      //Check if the dog is in conditions to get the vaccine
      if (booking.type === InquirieType.VACCINE) {
        const dogData = await ctx.prisma.pet
          .findFirstOrThrow({
            where: {
              id: dog,
            },
          })
          .catch(() => {
            throw new Error("El perro no existe!");
          });

        if (booking.vaccine === "B") {
          if (isPuppy(dogData.birth)) {
            throw new Error(BookingErrors.VACCINE_B_YOUNG);
          }
          const alreadyHasVaccineB = await ctx.prisma.booking.findFirst({
            where: {
              dog: {
                id: dog,
              },
              vaccine: {
                equals: "B",
              },
              date: {
                gte: bookingDate.subtract(1, "year").toDate(),
              },
            },
          });
          if (alreadyHasVaccineB) {
            throw new Error(BookingErrors.VACCINE_B_LAST_YEAR);
          }
        }
        /* if (booking.vaccine === "A") {
          if (isPuppy(dogData.birth)) {
            const lastVaccineA = await ctx.prisma.booking.findFirst({
              where: {
                dog: {
                  id: dog,
                },
                vaccine: {
                  equals: "A",
                },
                date: {
                  gte: dayjs().subtract(21, "day").toDate(),
                },
              },
            });
            if (lastVaccineA) {
              throw new Error(
                "No se puede aplicar una vacuna A a un perro que ya tiene una en los ultimos 21 dias!"
              );
            }
          } else {
            const lastVaccineA = await ctx.prisma.booking.findFirst({
              where: {
                dog: {
                  id: dog,
                },
                vaccine: {
                  equals: "A",
                },
                date: {
                  gte: dayjs().subtract(1, "year").toDate(),
                },
              },
            });
            if (lastVaccineA) {
              throw new Error(
                "No se puede aplicar una vacuna A a un perro que ya tiene una en el ultimo año!"
              );
            }
          }
        } */
      }
      //Check the amount of bookings in the same DAY at the same timeZone (max 20)

      const bookingsInSameDate = await ctx.prisma.booking.count({
        where: {
          date: {
            gt: dayjs(booking.date).startOf("day").toDate(),
            lt: dayjs(booking.date).endOf("day").toDate(),
          },
          timeZone: {
            equals: booking.timeZone,
          },
        },
      });
      // Check if the bookings are already taken
      if (bookingsInSameDate >= 20) throw new Error(BookingErrors.FULL);

      return ctx.prisma.booking.update({
        where: {
          id,
        },
        data: {
          ...booking,
          dog: {
            connect: { id: dog },
          },
        },
      });
    }),

  // Cancel a booking
  cancel: protectedProcedure
    .input(string()) //Booking ID
    .mutation(async ({ input, ctx }) => {
      const booking = await ctx.prisma.booking
        .findFirstOrThrow({
          where: {
            id: input,
          },
        })
        .catch(() => {
          throw new Error(BookingErrors.NOT_FOUND);
        });
      // If the book is in one day or less, it can't be updated
      bookingDateChecks(dayjs(booking.date));

      //Look for the user email
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: booking.userId,
        },
      });

      if (!user) throw new Error("El usuario no existe!");

      const to =
        ctx.session.user.role === UserRoles.VET
          ? user.email
          : "v.ohmydog@gmail.com";

      const who =
        ctx.session.user.role === UserRoles.VET ? "veterinario" : "cliente";

      await sendEmail({
        to,
        from: "v.ohmydog@gmail.com",
        subject: `Se ha cancelado el turno reservado por ${user.name}.`,
        text: `El turno del día ${booking.date.getDate()}, horario ${
          TimeZoneOptions.find((option) => option.value === booking.timeZone)
            ?.label as string
        }. Ha sido cancelado. Por favor, contacte con el ${who} para reprogramar el turno.`,
      });
      return ctx.prisma.booking.delete({
        where: {
          id: input,
        },
      });
    }),
});
