import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { BookingCreationSchema } from "~/schemas/booking";

export const bookingsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(BookingCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { dog, user, ...booking } = input;

      // Muevo todo el checkeo de los bookings a otro lado????
      // Check if the date is in the past or a Sunday
      if (booking.date < new Date())
        throw new Error("No puedes reservar en el pasado!");
      if (booking.date.getDay() === 0)
        throw new Error("No abrimos los domingos!");

      const allBookings = await ctx.prisma.booking.findMany({
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
      if (allBookings.length >= 20) throw new Error("Horario ocupado!");

      // I check if the dog is available to the book
      // const dogData = await ctx.prisma.pet.findUnique({
      //   where: {
      //     id: dog,
      //   },
      // });

      return ctx.prisma.booking.create({
        data: {
          ...booking,
          dog: {
            connect: { id: dog },
          },
          user: {
            connect: { id: user },
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
      },
    });
  }),

  // Update booking

  //Returns today's bookings
  getToday: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.booking.findMany({
      where: {
        date: {
          equals: new Date(),
        },
      },
    });
  }),
});
