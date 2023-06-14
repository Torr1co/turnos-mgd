import { type User, UserRoles, BookingStatus } from "@prisma/client";
import { hashSync } from "bcryptjs";
import {
  ClientCreationSchema,
  UpdateClientSchema,
} from "~/schemas/clientSchema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import sendEmail from "~/server/email";
import { prismaError } from "~/utils/errors";
import { BookingHandlers } from "~/utils/schemas/bookingUtils";

export const clientsRouter = createTRPCRouter({
  create: publicProcedure
    .input(ClientCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { booking, dog, ...userData } = input;

      // Generate a hashed password
      const randomString = Math.random().toString(36).replace("0.", "");
      const hashedPassword = hashSync(randomString, 10);

      BookingHandlers.alreadyCastrated(booking.type, dog.castrated);
      await BookingHandlers.maxBookings(ctx.prisma, booking);
      if (booking.type === "VACCINE" && booking.vaccine === "B") {
        BookingHandlers.puppy(dog.birth);
      }

      /*  try { */
      const client = await ctx.prisma.$transaction(
        async (prisma) => {
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
              prismaHandler("email", "El email ya se encuentra registrado");
              prismaHandler("dni", "El DNI ya se encuentra registrado");
            })) as User;

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
              status: BookingStatus.APPROVED,
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
        },
        {
          maxWait: 6000,
          timeout: 15000,
        }
      );
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
