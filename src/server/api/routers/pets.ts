import { PetCreationSchema } from "~/schemas/pet";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.pet.findMany();
  }),
});
