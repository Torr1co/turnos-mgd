import { UserRoles } from "@prisma/client";
import { hashSync } from "bcryptjs";
// import nodemailer from "nodemailer";

import { ClientCreationSchema } from "~/schemas/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { bookingsRouter } from "./bookings";

export const clientsRouter = createTRPCRouter({
  createClient: publicProcedure
    .input(ClientCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { booking, dog, ...userData } = input;

      // Generate a hashed password
      const randomString = Math.random().toString(36).substring(7);
      const hashedPassword = hashSync(randomString, 10);

      // Create the user with the hashed password
      const client = await ctx.prisma.user.create({
        data: {
          ...userData,
          role: UserRoles.CLIENT,
          password: hashedPassword,
        },
      });

      const dogCreation = await ctx.prisma.pet.create({
        data: {
          ...dog,
          healthBook: {
            create: {},
          },
          owner: {
            connect: {
              id: client.id,
            },
          },
        },
      });

      const bookingsCaller = bookingsRouter.createCaller(ctx);
      await bookingsCaller.create({
        ...booking,
        dog: dogCreation.id,
        user: client.id,
      });

      // Send an email to the user with the password
      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: client.email,
      //     pass: client.password,
      //   },
      // });

      return client;
    }),

  //Returns all Clients and their dogs
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: {
        role: UserRoles.CLIENT,
      },
      include: { dogs: true },
    });
  }),
});
