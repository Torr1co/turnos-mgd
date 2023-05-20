import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { BookingCreationSchema } from "~/schemas/booking";
// import { UpdateBookingSchema } from "~/schemas/updateBooking";

export const bookingsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(BookingCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { dog, user, ...booking } = input;

      // Check if the date is in the past or a Sunday
      if (booking.date < new Date())
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
        completed: {
          equals: false,
        },
      },
    });
  }),

  // //Update a booking
  // update: protectedProcedure
  //   .input(UpdateBookingSchema)
  //   .mutation(async ({ input, ctx }) => {
  //     const { id, ...booking } = input;

  //     // Check if the date is in the past or a Sunday
  //     if (booking.booking.date < new Date())
  //       throw new Error("No puedes reservar en el pasado!");
  //     if (booking.booking.date.getDay() === 0)
  //       throw new Error("No abrimos los domingos!");

  //     const dayBookings = await ctx.prisma.booking.findMany({
  //       where: {
  //         date: {
  //           equals: booking.booking.date,
  //         },
  //         timeZone: {
  //           equals: booking.booking.timeZone,
  //         },
  //       },
  //     });

  //     // Check if the bookings are already taken
  //     if (dayBookings.length >= 20) throw new Error("Horario ocupado!");

  //     return ctx.prisma.booking.update({
  //       where: {
  //         id,
  //       },
  //       data: {
  //         ...booking.booking,
  //       },
  //     });
  //   }),

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
