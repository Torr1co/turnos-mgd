import {
  clientProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { BookingCreationSchema, BookingUpdateSchema } from "~/schemas/booking";
import dayjs from "dayjs";
import { UserRoles } from "~/schemas";

export const bookingsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(BookingCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { dog, user, ...booking } = input;

      //TODO: Move this to another file
      // Check if the date is in the past or a Sunday
      if (dayjs(booking.date).isBefore(dayjs(), "day"))
        throw new Error("No puedes reservar en el pasado!");
      if (booking.date.getDay() === 0)
        throw new Error("No abrimos los domingos!");

      const dayBookings = await ctx.prisma.booking.findMany({
        where: {
          date: {
            equals: booking.date,
          },
          timeZone: {
            equals: booking.timeZone,
          },
        },
      });

      // Check if the bookings are already taken
      if (dayBookings.length >= 20) throw new Error("Horario ocupado!");

      if (ctx.session.user.role === UserRoles.VET && !user)
        throw new Error(
          "No puedes crear una cita para un usuario que no existe!"
        );

      //TODO: Move this to another file
      //Check if the dog is in conditions to get the vaccine
      if (booking.type === "VACCINE") {
        const dogData = await ctx.prisma.pet.findUnique({
          where: {
            id: dog,
          },
        });
        if (booking.vaccine === "B") {
          //TODO: Change this validation to a healtBook validation

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
          //Check if the dog is older than 4 months
          if (dayjs(dogData?.birth).isBefore(dayjs().subtract(4, "month"))) {
            throw new Error(
              "No se puede aplicar una antirrabica a un perro menor de 4 meses!"
            );
          }
          //TODO: Add a new booking in a year
        }
        if (booking.vaccine === "A") {
          //Check if the dog is older than 4 months
          if (dayjs(dogData?.birth).isBefore(dayjs().subtract(4, "month"))) {
            //TODO: Add a new booking in 21 days
          } else {
            //TODO: Add a new booking in a year
          }
        }
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
          gte: new Date(),
        },
        completed: {
          equals: false,
        },
      },
      include: {
        dog: true,
        user: true,
      },
    });
  }),

  // //Update a booking
  update: clientProcedure
    .input(BookingUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        dog,
        booking: { id, ...booking },
      } = input;
      if (dayjs(booking.date).isBefore(dayjs(), "day"))
        throw new Error("No puedes reservar en el pasado!");

      if (booking.date.getDay() === 0)
        throw new Error("No abrimos los domingos!");

      // TODO: here should check if the dog has specific inquiry type and another checks

      const dayBookings = await ctx.prisma.booking.findMany({
        where: {
          date: {
            equals: booking.date,
          },
          timeZone: {
            equals: booking.timeZone,
          },
        },
      });

      // Check if the bookings are already taken
      if (dayBookings.length >= 20) throw new Error("Horario ocupado!");

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
    return ctx.prisma.booking.findMany({
      where: {
        date: {
          equals: new Date(),
        },
      },
      include: {
        dog: true,
        user: true,
      },
    });
  }),
});
