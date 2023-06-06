import { z } from "zod";

export const ContactSchema = z.object({
  to: z.string(), //Publication id
  from: z.string().trim().email("Ingrese un mail valido"), //Email of the user that wants to adopt
  name: z.string().trim().min(1, "Requerido"), //Name of the user that wants to adopt
  lastname: z.string().trim().min(1, "Requerido"), //Name of the user that wants to adopt
  telephone: z.optional(z.string().max(15, "Maximo 15 digitos")), //Telephone of the user that wants to adopt
  message: z.string().trim().min(10, "Minimo 10 caracteres"), //Message of the user that wants to adopt
  subject: z.string().trim().min(1, "Requerido"), //Subject of the email
  reason: z.string().trim().min(1, "Requerido"), //Text of the email
});

export type ContactSchema = z.infer<typeof ContactSchema>;
