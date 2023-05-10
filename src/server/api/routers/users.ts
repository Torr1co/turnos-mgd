import { UserRoles } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { z } from "zod";
import { ClientCreationSchema } from "~/schemas/user";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { bookingsRouter } from "./bookings";
// import { bookingsRouter } from "./bookings";

export const usersRouter = createTRPCRouter({
  create: publicProcedure
    .input(ClientCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { password, booking, dog, ...userData } = input;

      // Hash the password with the secret key
      const hashedPassword = hashSync(
        password + (process.env.HASH_PASSWORD ?? ""),
        10
      );

      return await ctx.prisma.$transaction(async () => {
        const user = await ctx.prisma.user.create({
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
                id: user.id,
              },
            },
          },
        });

        const bookingsCaller = bookingsRouter.createCaller(ctx);
        await bookingsCaller.create({
          ...booking,
          dog: dogCreation.id,
          user: user.id,
        });

        return user;
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  delete: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.delete({ where: { email: input } });
  }),
});
