import { UserRoles } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { z } from "zod";
import { VetCreationSchema } from "~/schemas/vet";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { bookingsRouter } from "./bookings";

export const vetsRouter = createTRPCRouter({
  createVet: publicProcedure
    .input(VetCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { password, ...userData } = input;

      // Hash the password with the secret key
      const hashedPassword = hashSync(
        password + (process.env.HASH_PASSWORD ?? ""),
        10
      );

      // Create the user with the hashed password
      const vet = await ctx.prisma.user.create({
          data: {
            ...userData,
            role: UserRoles.VET,
            password: hashedPassword,
        },
      });
      
      return vet;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  delete: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.delete({ where: { email: input } });
  }),
});
