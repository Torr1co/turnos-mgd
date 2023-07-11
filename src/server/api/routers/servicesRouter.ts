import {
  ServiceCreationSchema,
  ServiceGetAllSchema,
  ServiceOptions,
  ServiceUpdateSchema,
} from "~/schemas/serviceSchema";
import {
  createTRPCRouter,
  publicProcedure,
  vetProcedure,
} from "~/server/api/trpc";
import { prismaError } from "~/utils/errors";
import { getOptionLabel } from "~/utils/schemaUtils";

export const servicesRouter = createTRPCRouter({
  create: vetProcedure
    .input(ServiceCreationSchema)
    .mutation(async ({ input: { types, ...service }, ctx }) => {
      for (const type of types) {
        await ctx.prisma.service
          .create({
            data: {
              ...service,
              type,
            },
          })
          .catch((error) => {
            const prismaHandler = prismaError(
              error,
              "No se pudo registrar el servicio"
            );
            prismaHandler(
              "email",
              `El email ya se encuentra registrado para el tipo de servicio ${getOptionLabel(
                ServiceOptions,
                type
              )}`
            );
          });
      }
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
});
