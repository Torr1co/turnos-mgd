import { string } from "zod";
import {
  AdoptCreationSchema,
  AdoptUpdateSchema,
} from "~/schemas/adoptionSchema";
import { ContactSchema } from "~/schemas/contactSchema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import sendEmail from "~/server/email";

export const adoptPublicationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(AdoptCreationSchema)
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
    .input(AdoptUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...rest } = input;
      const { dog, ...adoption } = rest;

      const adoptPublication = await ctx.prisma.adoptPublication.update({
        where: {
          id,
        },
        data: {
          ...adoption,
          dog: {
            update: {
              ...dog,
            },
          },
        },
      });
      return adoptPublication;
    }),

  //Send a mail to the publication owner
  adopt: publicProcedure.input(ContactSchema).mutation(async ({ input }) => {
    const { receipt, sender, message, name } = input;

    await sendEmail({
      to: receipt,
      from: "v.ohmydog@gmail.com",
      subject: "Publicación de adopción en Oh my dog!",
      text: `Le escribimos para informarle que ${name} está interesado en adoptar a su perro. 
          Puedes contactarlo a través de su correo: ${sender}. 
          Mensaje: ${message}.
          ¡Muchas gracias por usar Oh my dog!`,
    });
    return;
  }),

  //Returns all the adopt publications that are active and not mine
  getAll: publicProcedure.query(async ({ ctx }) => {
    const adoptPublications = await ctx.prisma.adoptPublication.findMany({
      where: {
        active: true,
      },
      include: {
        dog: true,
      },
    });
    return adoptPublications;
  }),

  getAdopted: publicProcedure.query(async ({ ctx }) => {
    const adoptPublications = await ctx.prisma.adoptPublication.findMany({
      where: {
        active: false,
      },
      include: {
        dog: true,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
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

  //Delete an adopt publication and its dog
  delete: protectedProcedure
    .input(string())
    .mutation(async ({ ctx, input }) => {
      const id = input;
      const adoptPublication = await ctx.prisma.adoptPublication.delete({
        where: {
          id,
        },
        include: {
          dog: true,
        },
      });
      return adoptPublication;
    }),

  //Cancel an adopt publication
  cancel: protectedProcedure
    .input(string()) //Adopt publication id
    .mutation(async ({ ctx, input }) => {
      const id = input;
      const adoptPublication = await ctx.prisma.adoptPublication.update({
        where: {
          id,
        },
        data: {
          active: false,
        },
      });
      return adoptPublication;
    }),
});
