import { UserRoles } from "@prisma/client";
import { z } from "zod";
import { BusinessRegisterSchema } from "~/schemas/businessSchema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import sendEmail from "~/server/email";
import { prismaError } from "~/utils/errors";

export const businessRouter = createTRPCRouter({
  create: publicProcedure
    .input(BusinessRegisterSchema)
    .mutation(async ({ input, ctx }) => {
      const { ownerId, services, ...newBusiness } = input;

      return ctx.prisma.$transaction(
        async (prisma) => {
          const user = await prisma.user.update({
            where: { id: ownerId },
            data: { role: UserRoles.OWNER },
          });

          const business = await prisma.business
            .create({
              data: {
                ...newBusiness,
                owner: { connect: { id: ownerId } },
                services: {
                  create: services,
                },
              },
            })
            .catch((error) => {
              const prismaHandler = prismaError(
                error,
                "No se pudo crear el negocio"
              );
              prismaHandler("title", "Ya existe un negocio con ese nombre");
            });
          if (business) {
            await sendEmail({
              to: user.email,
              subject: "Se ha creado tu negocio en Magdalena Digital",
              text: `Hola ${user.firstname}, tu negocio ${business.title} ha sido creado exitosamente en Magdalena Digital. Ahora puedes gestionar tus servicios y reservas desde la plataforma.`,
            });
          }
        },
        {
          timeout: 15000,
        }
      );
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.business.findMany();
  }),

  getAllBy: publicProcedure
    .input(
      z.object({
        ownerId: z.string().optional(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.business.findMany({
        where: { ownerId: input.ownerId },
      });
    }),

  getById: publicProcedure
    .input(z.nullable(z.string()))
    .query(({ input: id, ctx }) => {
      return id
        ? ctx.prisma.business.findUnique({
            where: { id },
            include: {
              services: {
                include: {
                  bookings: {
                    select: {
                      id: true,
                      date: true,
                      schedule: true,
                    },
                  },
                },
              },
            },
          })
        : null;
    }),
});
