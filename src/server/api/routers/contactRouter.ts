import {} from "~/schemas/adoptionSchema";
import { ContactSchema } from "~/schemas/contactSchema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import sendEmail from "~/server/email";

export const contactRouter = createTRPCRouter({
  sendEmail: publicProcedure
    .input(ContactSchema)
    .mutation(async ({ input }) => {
      await sendEmail({
        to: input.to,
        from: "v.ohmydog@gmail.com",
        subject: input.subject /* "Publicación de adopción en Oh my dog!" */,
        text: `Le escribimos porque ${input.reason} y ${input.name} ${
          input.lastname
        } se encuentra interesado.
      Puedes contactarlo a través de su correo: ${input.from}.
      ${input.telephone ? `Y su numero de teléfono: ${input.telephone}.` : ""}
      Mensaje: ${input.message}.
      ¡Muchas gracias por usar Oh my dog!`,
      });
      return;
    }),
});
