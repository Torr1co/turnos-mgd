import { type User, UserRoles } from "@prisma/client";
import { hashSync } from "bcryptjs";
import dayjs from "dayjs";

import {
  ClientCreationSchema,
  UpdateClientSchema,
} from "~/schemas/clientSchema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { systemEmail } from "~/server/email";
import sendEmail from "~/server/email";
import { prismaError } from "~/utils/errors";
// import { send } from "process";

export const clientsRouter = createTRPCRouter({
  create: publicProcedure
    .input(ClientCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { booking, dog, ...userData } = input;

      // Generate a hashed password
      const randomString = Math.random().toString(36).replace("0.", "");
      const hashedPassword = hashSync(randomString, 10);

      if (booking.type === "VACCINE") {
        if (booking.vaccine === "B") {
          if (dayjs(dog.birth).isAfter(dayjs().subtract(4, "month"))) {
            throw new Error(
              "No se puede aplicar una antirrabica a un perro menor de 4 meses!"
            );
          }
        }
      }

      /*  try { */
      const client = await ctx.prisma.$transaction(async (prisma) => {
        const client = (await prisma.user
          .create({
            data: {
              ...userData,
              role: UserRoles.CLIENT,
              password: hashedPassword,
            },
          })
          .catch((error) => {
            const prismaHandler = prismaError(
              error,
              "No se pudo crear el cliente"
            );
            prismaHandler("email", "El email ya existe");
            prismaHandler("dni", "El DNI ya existe");
          })) as User;

        //Booking checks
        const dayBookings = await ctx.prisma.booking.count({
          where: {
            date: {
              gt: dayjs(booking.date).startOf("day").toDate(),
              lt: dayjs(booking.date).endOf("day").toDate(),
            },
            timeZone: {
              equals: booking.timeZone,
            },
          },
        });
        // Check if the bookings are already taken
        if (dayBookings >= 5) throw new Error("Horario ocupado!");

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

        await sendEmail({
          to: client.email,
          from: "v.ohmydog@gmail.com",
          subject: "Bienvenido a Oh My Dog",
          text: `Hola ${client.name}! Gracias por registrarte en Oh My Dog. Tu contraseña es ${randomString}`,
        });

        return client;
      }, {});
      return client;
      /* } catch (error) {
        const prismaHandler = prismaError(error, "No se pudo crear el cliente");
        prismaHandler("email", "El email ya existe");
        prismaHandler("dni", "El DNI ya existe");
      } */
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
