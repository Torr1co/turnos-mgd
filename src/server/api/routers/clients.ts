import { Prisma, UserRoles } from "@prisma/client";
import { hashSync } from "bcryptjs";

import { ClientCreationSchema, UpdateClientSchema } from "~/schemas/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { systemEmail } from "~/server/email";
import sendEmail from "~/server/email";
// import { send } from "process";

export const clientsRouter = createTRPCRouter({
  create: publicProcedure
    .input(ClientCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { booking, dog, ...userData } = input;

      // Generate a hashed password
      const randomString = Math.random().toString(36).replace("0.", "");
      const hashedPassword = hashSync(randomString, 10);

      // Create the user with the hashed password

      try {
        const client = await ctx.prisma.$transaction(async (prisma) => {
          const client = await prisma.user.create({
            data: {
              ...userData,
              role: UserRoles.CLIENT,
              password: hashedPassword,
            },
          });

          const dogCreation = await prisma.pet.create({
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

          await prisma.booking.create({
            data: {
              ...booking,
              dog: {
                connect: {
                  id: dogCreation.id,
                },
              },
              user: {
                connect: {
                  id: client.id,
                },
              },
            },
          });

          await sendEmail(
            client.email,
            "v.ohmydog@gmail.com",
            "Bienvenido a Oh My Dog",
            `Hola ${client.name}! Gracias por registrarte en Oh My Dog. Tu contraseña es ${randomString}`
          );

          return client;
        }, {});
        return client;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.meta?.target
        ) {
          const target = error.meta.target as string;
          if (target.includes("email")) {
            throw new Error("El email ya existe");
          }
          if (target.includes("dni")) {
            throw new Error("El DNI ya existe");
          }
        }
        throw new Error("No se pudo crear el cliente");
      }
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
});
