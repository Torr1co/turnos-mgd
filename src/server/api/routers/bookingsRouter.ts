import {
  clientProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  vetProcedure,
} from "~/server/api/trpc";
import {
  BookingCreationSchema,
  BookingUpdateSchema,
  TimeZoneOptions,
  BookingGetAllSchema,
} from "~/schemas/bookingSchema";
import { BookingType, UserRoles, BookingStatus } from "@prisma/client";
import dayjs from "dayjs";
import { string } from "zod";
import sendEmail from "~/server/email";
import {
  BookingHandlers,
  BookingStatusQueries,
  getBooking,
} from "~/utils/schemas/bookingUtils";
import { isVet } from "~/utils/schemas/usersUtils";

export const bookingsRouter = createTRPCRouter({
  create: clientProcedure
    .input(BookingCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { dog, user, ...booking } = input;

      const bookingDate = dayjs(booking.date);
      BookingHandlers.date(bookingDate);

      await BookingHandlers.alreadyBooked(ctx.prisma, booking, dog);
      await BookingHandlers.maxBookings(ctx.prisma, booking);

      if (booking.type === BookingType.VACCINE) {
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
          await BookingHandlers.vaccineB(ctx.prisma, booking, dogData);
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
  getAll: publicProcedure
    .input(BookingGetAllSchema)
    .query(({ ctx, input: { status } }) => {
      return ctx.prisma.booking.findMany({
        where: {
          ...BookingStatusQueries[status],
          userId: isVet(ctx.session?.user) ? undefined : ctx.session?.user.id,
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
        booking: { id, ...newData },
      } = input;
      const booking = await getBooking(ctx.prisma, id);
      BookingHandlers.update(dayjs(booking.date));
      await BookingHandlers.alreadyBooked(ctx.prisma, newData, dog);
      await BookingHandlers.maxBookings(ctx.prisma, newData);

      if (newData.type === BookingType.VACCINE) {
        const dogData = await ctx.prisma.pet
          .findFirstOrThrow({
            where: {
              id: dog,
            },
          })
          .catch(() => {
            throw new Error("El perro no existe!");
          });

        if (newData.vaccine === "B") {
          await BookingHandlers.vaccineB(ctx.prisma, newData, dogData);
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

      return ctx.prisma.booking.update({
        where: {
          id,
        },
        data: {
          ...newData,
          status: BookingStatus.PENDING,
          dog: {
            connect: { id: dog },
          },
        },
      });
    }),

  // Cancel a booking
  cancel: protectedProcedure
    .input(string()) //BookingSchema ID
    .mutation(async ({ input, ctx }) => {
      const booking = await getBooking(ctx.prisma, input);

      BookingHandlers.date(dayjs(booking.date));
      BookingHandlers.update(dayjs(booking.date));

      //Look for the user email
      const user = await ctx.prisma.user
        .findFirstOrThrow({
          where: {
            id: booking.userId,
          },
        })
        .catch(() => {
          throw new Error("El usuario no existe!");
        });

      const to =
        ctx.session.user.role === UserRoles.VET
          ? user.email
          : "v.ohmydog@gmail.com";

      const sender =
        ctx.session.user.role === UserRoles.VET ? "veterinario" : "cliente";

      await sendEmail({
        to,
        from: "v.ohmydog@gmail.com",
        subject: `Se ha cancelado el turno reservado por ${user.name}.`,
        text: `El turno del día ${booking.date.getDate()}, horario ${
          TimeZoneOptions.find((option) => option.value === booking.timeZone)
            ?.label as string
        }. Ha sido cancelado. Por favor, contacte con el ${sender} para reprogramar el turno.`,
      });
      return ctx.prisma.booking.delete({
        where: {
          id: input,
        },
      });
    }),

  approve: vetProcedure
    .input(string()) //BookingSchema ID
    .mutation(async ({ input, ctx }) => {
      const booking = await getBooking(ctx.prisma, input);
      BookingHandlers.date(dayjs(booking.date));

      //Look for the user email
      const user = await ctx.prisma.user
        .findFirstOrThrow({
          where: {
            id: booking.userId,
          },
        })
        .catch(() => {
          throw new Error("El usuario no existe!");
        });

      const to =
        ctx.session.user.role === UserRoles.VET
          ? user.email
          : "v.ohmydog@gmail.com";

      await sendEmail({
        to,
        from: "v.ohmydog@gmail.com",
        subject: `Se ha aprobado el turno reservado por ${user.name}.`,
        text: `El turno del día ${booking.date.getDate()}, horario ${
          TimeZoneOptions.find((option) => option.value === booking.timeZone)
            ?.label as string
        }. Ha sido aprobado. Muchas gracias por confiar en nosotros!`,
      });
      return ctx.prisma.booking.update({
        where: {
          id: input,
        },
        data: {
          status: BookingStatus.APPROVED,
        },
      });
    }),

  get: vetProcedure.input(string()).query(async ({ input, ctx }) => {
    const booking = await getBooking(ctx.prisma, input);
    return booking;
  }),
});