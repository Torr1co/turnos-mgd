import { string } from "zod";
import { PetCreationSchema } from "~/schemas/pet";
import { UpdatePetSchema } from "~/schemas/updatePet";
// import { get } from 'react-hook-form';
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const petsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(PetCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { owner, ...dogData } = input;

      const healthBook = await ctx.prisma.healthBook.create({
        data: {
          //Acá tenemos que crear el healthBook
        },
      });

      const dog = await ctx.prisma.pet.create({
        data: {
          ...dogData,
          healthBook: {
            connect: { id: healthBook.id },
          },
          owner: {
            connect: { id: owner },
          },
        },
      });

      return dog;
    }),

  //Update pet
  update: protectedProcedure
    .input(UpdatePetSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const pet = await ctx.prisma.pet.update({
        where: {
          id: id,
        },
        data: {
          ...data,
        },
      });

      return pet;
    }),

  //Returns all pets of an owner (need the owner id)
  getAll: protectedProcedure.input(string()).query(async ({ input, ctx }) => {
    return ctx.prisma.pet.findMany({
      where: {
        owner: {
          id: input,
        },
      },
    });
  }),
});
