import { hashSync } from "bcryptjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  SessionUpdatePasswordSchema,
  SessionUpdateSchema,
} from "~/schemas/sessionSchema";
import { compareSync } from "bcryptjs";
export const sessionRouter = createTRPCRouter({
  updatePassword: protectedProcedure
    .input(SessionUpdatePasswordSchema)
    .mutation(async ({ input, ctx }) => {
      //Check if the password is correct
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new Error("Client not found");
      }

      if (
        input.prevPassword &&
        !compareSync(input.prevPassword, user.password)
      ) {
        throw new Error("Incorrect password");
      }

      //Hash the new password
      const hashedPassword = hashSync(input.password, 10);

      //Update the password
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          password: hashedPassword,
          passwordVerified: new Date(),
        },
      });
    }),

  update: protectedProcedure
    .input(SessionUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      //Update the session
      return await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });
    }),
});
