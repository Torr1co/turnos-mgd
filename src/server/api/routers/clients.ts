import { UserRoles } from "@prisma/client";
import { hashSync } from "bcryptjs";
// import { z } from "zod";
import { ClientCreationSchema } from "~/schemas/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { bookingsRouter } from "./bookings";
// import { bookingsRouter } from "./bookings";

export const clientsRouter = createTRPCRouter({
  createClient: publicProcedure
    .input(ClientCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { password, booking, dog, ...userData } = input;

      // Hash the password with the secret key
      const hashedPassword = hashSync(
        password + (process.env.HASH_PASSWORD ?? ""),
        10
      );

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
});
