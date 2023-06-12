import { UserRoles } from ".prisma/client";
import { z } from "zod";
import { PetCreationSchema, PetUpdateSchema } from "~/schemas/petSchema";
// import { get } from 'react-hook-form';
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prismaError } from "~/utils/errors";

export const petsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(PetCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { owner, ...dogData } = input;

      const healthBook = await ctx.prisma.healthBook.create({
        data: {
          // ...dogData.healthBook,
        },
      });

      const dog = await ctx.prisma.pet
        .create({
          data: {
            ...dogData,
            healthBook: {
              connect: { id: healthBook.id },
            },
            owner: {
              connect: { id: owner },
            },
          },
        })
        .catch((err) => {
          const prismaHandler = prismaError(err, "No se pudo crear el perro");
          prismaHandler("name", "Ya existe un perro con ese nombre");
        });
      return dog;
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
        healthBook: true,
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
