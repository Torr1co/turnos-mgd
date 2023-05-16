import { UserRoles } from "@prisma/client";
import { hashSync } from "bcryptjs";

import { ClientCreationSchema } from "~/schemas/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { bookingsRouter } from "./bookings";
import { systemEmail } from "~/server/email";

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

  sendEmail: publicProcedure.mutation(async ({ ctx }) => {
    await systemEmail(
      {
        name: "asdasd",
        address: "asdasd@gmail.com",
      },
      "subject",
      "text",
      "html"
    );
  }),
});
