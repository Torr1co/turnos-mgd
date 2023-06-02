import { z } from "zod";
import { ContactSchema } from "~/schemas/contactSchema";
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
import sendEmail from "~/server/email";

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

  contact: publicProcedure.input(ContactSchema).mutation(async ({ input }) => {
    const { receipt, sender, message, name } = input;

    await sendEmail({
      to: receipt,
      from: "v.ohmydog@gmail.com",
      subject: "Te han contactado en Oh my dog!",
      text: `Le escribimos para informarle que ${name} está interesado en utilizar sus servicios. 
          Puedes contactarlo a través de su correo: ${sender}. 
          Mensaje: ${message}.
          ¡Muchas gracias por usar Oh my dog!`,
    });
    return;
  }),
});
