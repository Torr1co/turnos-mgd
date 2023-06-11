import { z } from "zod";
import {
  ServiceCreationSchema,
  ServiceGetAllSchema,
  ServiceUpdateSchema,
} from "~/schemas/serviceSchema";
import {
  createTRPCRouter,
  publicProcedure,
  vetProcedure,
} from "~/server/api/trpc";

export const servicesRouter = createTRPCRouter({
  create: vetProcedure
    .input(ServiceCreationSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.service
        .create({
          data: input,
        })
        .catch(() => {
          throw new Error("No se pudo registrar el servicio");
        });
    }),

  getAll: publicProcedure.input(ServiceGetAllSchema).query(({ ctx, input }) => {
    return ctx.prisma.service.findMany({
      where: {
        availability: input.enabled,
      },
    });
  }),

  update: vetProcedure
    .input(ServiceUpdateSchema)
    .mutation(async ({ input: { id, ...service }, ctx }) => {
      return await ctx.prisma.service
        .update({
          data: service,
          where: {
            id,
          },
        })
        .catch(() => {
          throw new Error("No se pudo actualizar el servicio");
        });
    }),

  disable: vetProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    return await ctx.prisma.service
      .update({
        data: {
          availability: false,
        },
        where: {
          id: input,
        },
      })
      .catch(() => {
        throw new Error("No se pudo eliminar el servicio");
      });
  }),
});
