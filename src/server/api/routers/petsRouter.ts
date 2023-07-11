import { UserRoles, BookingStatus } from ".prisma/client";
import { z } from "zod";
import {
  PetCreationSchema,
  PetDisableSchema,
  PetUpdateSchema,
} from "~/schemas/petSchema";
// import { get } from 'react-hook-form';
import {
  createTRPCRouter,
  protectedProcedure,
  vetProcedure,
} from "~/server/api/trpc";
import sendEmail from "~/server/email";
import { prismaError } from "~/utils/errors";

export const petsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(PetCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { owner, ...dogData } = input;

      const dog = await ctx.prisma.pet
        .create({
          data: {
            ...dogData,
            owner: {
              connect: { id: owner },
            },
          },
        })
        .catch((err) => {
          const prismaHandler = prismaError(err, "No se pudo crear el perro");
          prismaHandler("name", "Ya tienes un perro con ese nombre!");
        });
      return dog;
    }),

  disable: vetProcedure
    .input(PetDisableSchema)
    .mutation(async ({ input: { petId }, ctx }) => {
      const pet = await ctx.prisma.pet
        .findFirstOrThrow({
          where: {
            id: petId,
          },
          include: {
            owner: true,
          },
        })
        .catch(() => {
          throw new Error("El perro no esta habilitado");
        });

      await ctx.prisma.$transaction(
        async (prisma) => {
          await prisma.booking.updateMany({
            where: {
              dogId: petId,
              status: {
                in: [BookingStatus.APPROVED, BookingStatus.PENDING],
              },
            },
            data: {
              status: BookingStatus.CANCELLED,
            },
          });
          await prisma.pet.update({
            where: {
              id: petId,
            },
            data: {
              disabled: true,
            },
          });
        },
        {
          maxWait: 10000,
          timeout: 20000,
        }
      );

      await sendEmail({
        to: pet.owner.email,
        from: "v.ohmydog@gmail.com",
        subject: `Se ha deshabilitado su perro ${pet.name} en ohMyDog!`,
        text: `Su perro ha sido deshabilitado de la aplicacion, junto a sus turnos.
        Si cree que esto fuer un error, contacte con su veterinario`,
      });
    }),
  //Update pet
  update: protectedProcedure
    .input(PetUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { petId, dog } = input;
      const pet = await ctx.prisma.pet
        .update({
          where: {
            id: petId,
          },
          data: dog,
        })
        .catch((error) => {
          const prismaHandler = prismaError(error, "No se pudo crear el perro");
          prismaHandler(
            "name",
            "Ya existe un perro con ese nombre asociado a esa cuenta"
          );
        });

      return pet;
    }),

  //Returns all pets of an owner (need the owner id)
  getAll: protectedProcedure
    .input(z.optional(z.string()))
    .query(async ({ input, ctx }) => {
      if (ctx.session.user.role === UserRoles.CLIENT && !input) {
        return ctx.prisma.pet.findMany({
          where: {
            owner: {
              id: ctx.session.user.id,
            },
          },
        });
      }

      return ctx.prisma.pet.findMany({
        where: {
          owner: {
            id: input,
          },
        },
      });
    }),

  get: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const pet = await ctx.prisma.pet.findFirst({
      where: {
        id: input,
      },
      include: {
        owner: true,
        bookings: {
          where: {
            status: BookingStatus.COMPLETED,
          },
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            user: true,
            dog: true,
            castration: true,
            vaccine: true,
            deworming: true,
            inquirie: true,
          },
        },
      },
    });

    if (!pet) throw new Error("Perro no encontrado");
    if (
      ctx.session.user.role === UserRoles.CLIENT &&
      ctx.session.user.id !== pet.owner.id
    )
      throw new Error("No autorizado");

    return pet;
  }),
});
