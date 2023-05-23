import {
  clientProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import {
  BookingCreationSchema,
  BookingUpdateSchema,
} from "~/schemas/bookingSchema";
import dayjs from "dayjs";
import { UserRoles } from "~/schemas";
import { string } from "zod";
import sendEmail from "~/server/email";

export const bookingsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(BookingCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { dog, user, ...booking } = input;

      if (ctx.session.user.role === UserRoles.VET && !user)
        throw new Error(
          "No puedes crear una cita para un usuario que no existe!"
        );

      // If the dog has a booking in the same day with the same type of booking, it can't be booked
      const dogBookings = await ctx.prisma.booking.findMany({
        where: {
          dog: {
            id: dog,
          },
          date: {
            gt: dayjs(booking.date).startOf("day").toDate(),
            lt: dayjs(booking.date).endOf("day").toDate(),
          },
          type: {
            equals: booking.type,
          },
        },
      });
      if (dogBookings.length > 0)
        throw new Error("Ya tienes un turno ese día!");

      // Check if the date is in the past or a Sunday
      if (dayjs(booking.date).isBefore(dayjs(), "day"))
        throw new Error("No puedes reservar en el pasado!");
      if (booking.date.getDay() === 0)
        throw new Error("No abrimos los domingos!");

      //TODO: Change this validation to a healtBook validation

      //Check if the dog is in conditions to get the vaccine
      if (booking.type === "VACCINE") {
        const dogData = await ctx.prisma.pet.findUnique({
          where: {
            id: dog,
          },
        });
        const isPuppy = dayjs(dogData?.birth).isAfter(
          dayjs().subtract(4, "month")
        );
        if (booking.vaccine === "B") {
          //Check if the dog has a rabies vaccine in the last year
          const lastVaccineB = await ctx.prisma.booking.findFirst({
            where: {
              dog: {
                id: dog,
              },
              vaccine: {
                equals: "B",
              },
              date: {
                gte: dayjs().subtract(1, "year").toDate(),
              },
            },
          });
          if (lastVaccineB) {
            throw new Error(
              "No se puede aplicar una antirrabica a un perro que ya tiene una en el ultimo año!"
            );
          }
          //Check if the dog is younger than 4 months
          if (isPuppy) {
            throw new Error(
              "No se puede aplicar una antirrabica a un perro menor de 4 meses!"
            );
          }
        }
        if (booking.vaccine === "A") {
          //Check if the dog has a vaccine A in the last 21 days (when the dog is younger than 4 months)
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
        }
      }
      // Check if the bookings are already taken

      const dayBookings = await ctx.prisma.booking.count({
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
      if (dayBookings >= 20) throw new Error("Horario ocupado!");

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

      // If the book is in one day or less, it can't be updated
      const oldBooking = await ctx.prisma.booking.findUnique({
        where: {
          id,
        },
      });
      if (
        dayjs(oldBooking!.date).isBefore(dayjs().add(1, "day"), "day") &&
        dayjs(oldBooking!.date).isAfter(dayjs(), "day")
      )
        throw new Error("No puedes modificar una reserva en menos de 24hs!");

      if (dayjs(booking.date).isBefore(dayjs(), "day"))
        throw new Error("No puedes reservar en el pasado!");
      if (booking.date.getDay() === 0)
        throw new Error("No abrimos los domingos!");

      // If the dog has a booking in the same day with the same type of booking, it can't be booked
      const dogBookings = await ctx.prisma.booking.findMany({
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
      if (dogBookings.length > 0) throw new Error("Ya tienes un turno!");

      // Check if the date is in the past or a Sunday
      if (dayjs(booking.date).isBefore(dayjs(), "day"))
        throw new Error("No puedes reservar en el pasado!");
      if (booking.date.getDay() === 0)
        throw new Error("No abrimos los domingos!");

      //Check if the dog is in conditions to get the vaccine
      if (booking.type === "VACCINE") {
        const dogData = await ctx.prisma.pet.findUnique({
          where: {
            id: dog,
          },
        });
        const isPuppy = dayjs(dogData?.birth).isBefore(
          dayjs().subtract(4, "month")
        );
        if (booking.vaccine === "B") {
          //Check if the dog has a rabies vaccine in the last year
          const lastVaccineB = await ctx.prisma.booking.findFirst({
            where: {
              dog: {
                id: dog,
              },
              vaccine: {
                equals: "B",
              },
              date: {
                gte: dayjs().subtract(1, "year").toDate(),
              },
            },
          });
          if (lastVaccineB) {
            throw new Error(
              "No se puede aplicar una antirrabica a un perro que ya tiene una en el ultimo año!"
            );
          }
          //Check if the dog is younger than 4 months
          if (isPuppy) {
            throw new Error(
              "No se puede aplicar una antirrabica a un perro menor de 4 meses!"
            );
          }
        }
        if (booking.vaccine === "A") {
          //Check if the dog has a vaccine A in the last 21 days (when the dog is younger than 4 months)
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
        }
      }
      //Check the amount of bookings in the same DAY at the same timeZone (max 20)

      const dayBookings = await ctx.prisma.booking.count({
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
      if (dayBookings >= 5) throw new Error("Horario ocupado!");

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

  //Returns today's bookings
  getToday: publicProcedure.query(({ ctx }) => {
    const today = dayjs().startOf("day").toDate();
    return ctx.prisma.booking.findMany({
      where: {
        date: {
          equals: today,
        },
      },
      include: {
        dog: true,
        user: true,
      },
    });
  }),

  // Cancel a booking
  cancel: protectedProcedure
    .input(string()) //Booking ID
    .mutation(async ({ input, ctx }) => {
      const booking = await ctx.prisma.booking.findUnique({
        where: {
          id: input,
        },
      });
      if (!booking) throw new Error("La reserva no existe!");
      // If the book is in one day or less, it can't be updated
      if (
        dayjs(booking.date).isBefore(dayjs().add(1, "day"), "day") &&
        dayjs(booking.date).isAfter(dayjs(), "day")
      )
        throw new Error("No puedes modificar una reserva en menos de 24hs!");

      if (dayjs(booking.date).isBefore(dayjs(), "day"))
        throw new Error("No puedes cancelar una reserva en el pasado!");

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
          booking.timeZone
        }. Ha sido cancelado. Por favor, contacte con el ${who} para reprogramar el turno.`,
      });
      return ctx.prisma.booking.delete({
        where: {
          id: input,
        },
      });
    }),
});
