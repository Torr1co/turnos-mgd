import { string, z } from "zod";
import { AdoptPublicationSchema } from "~/schemas/adoptPublication";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const adoptPublicationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(AdoptPublicationSchema)
    .mutation(async ({ input, ctx }) => {
      const { dog } = input;
      const adoptPublication = await ctx.prisma.adoptPublication.create({
        data: {
          ...input,
          dog: {
            create: {
              ...dog,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return adoptPublication;
    }),

  //Update reason and telephone number
  update: protectedProcedure
    .input(
      z.object({
        id: string(),
        telephoneNumber: string(),
        reason: string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, reason, telephoneNumber } = input;
      const adoptPublication = await ctx.prisma.adoptPublication.update({
        where: {
          id,
        },
        data: {
          reason,
          user: {
            update: {
              telephoneNumber,
            },
          },
        },
      });
      return adoptPublication;
    }),

  //Returns all the adopt publications that are active and not mine
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const adoptPublications = await ctx.prisma.adoptPublication.findMany({
      where: {
        active: true,
      },
    });
    return adoptPublications;
  }),

  //Confirm the adoption
  confirm: protectedProcedure
    .input(string())
    .mutation(async ({ ctx, input }) => {
      const id = input;
      const adoptPublication = await ctx.prisma.adoptPublication.update({
        where: {
          id: id,
        },
        data: {
          active: false,
        },
      });
      return adoptPublication;
    }),

  //Returns all the adopt publications that are finished
  getCompleted: protectedProcedure.query(async ({ ctx }) => {
    const adoptPublications = await ctx.prisma.adoptPublication.findMany({
      where: {
        active: false,
      },
    });
    return adoptPublications;
  }),

  //Returns my adopt publications
  getMine: protectedProcedure.input(string()).query(async ({ ctx, input }) => {
    const id = input;
    const adoptPublications = await ctx.prisma.adoptPublication.findMany({
      where: {
        user: {
          id,
        },
      },
    });
    return adoptPublications;
  }),
});
