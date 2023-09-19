import { UserRoles } from "@prisma/client";
import { hashSync } from "bcryptjs";
import dayjs from "dayjs";
import { z } from "zod";
import { UserCreationSchema, UpdateClientSchema } from "~/schemas/userSchema";
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import sendEmail from "~/server/email";
import { prismaError } from "~/utils/errors";

export const clientsRouter = createTRPCRouter({
  create: publicProcedure
    .input(UserCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const randomString = Math.random().toString(36).replace("0.", "");
      const hashedPassword = hashSync(randomString, 10);

      return ctx.prisma.$transaction(
        async (prisma) => {
          const user = await prisma.user
            .create({
              data: {
                ...input,
                password: hashedPassword,
                role: UserRoles.CLIENT,
                subscriptionPayments: {
                  create: {
                    amount: 0,
                    expirationDate: dayjs().add(1, "month").toDate(),
                  },
                },
              },
            })
            .catch((error) => {
              const prismaHandler = prismaError(
                error,
                "No se pudo crear el usuario"
              );
              prismaHandler("email", "El email ya se encuentra registrado");
              prismaHandler("dni", "El DNI ya se encuentra registrado");
            });
          if (user) {
            await sendEmail({
              to: user.email,
              subject: "Bienvenido a Magdalena Digital",
              text: `Hola ${user.firstname}! Gracias por registrarte en Magdalena Digital. Tu contraseña es ${randomString}`,
            });
          }
          return user;
        },
        {
          timeout: 10000,
        }
      );
    }),

  //Returns all Clients and their dogs
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: {
        role: UserRoles.OWNER,
      },
    });
  }),

  //Updates a client
  update: publicProcedure
    .input(UpdateClientSchema)
    .mutation(async ({ input, ctx }) => {
      const updatedClient = await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          ...input,
        },
      });

      return updatedClient;
    }),

  getById: adminProcedure
    .input(z.object({ id: z.nullable(z.string()) }))
    .query(({ input, ctx }) => {
      return input.id
        ? ctx.prisma.user.findUnique({
            where: { id: input.id },
          })
        : null;
    }),
});
