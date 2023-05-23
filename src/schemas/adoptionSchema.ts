import { type AdoptPublication, type Dog } from "@prisma/client";
import { z } from "zod";
import { DogSchema } from "./dogSchema";

export const AdoptCreationSchema = z.object({
  email: z.string().email("Ingrese un mail valido"),
  reason: z.string().trim().min(10,"Minimo 10 caracteres"),
  info: z.optional(z.string()),
  dog: DogSchema.partial(),
});

export const AdoptUpdateSchema = AdoptCreationSchema.extend({
  id: z.string(),
});

export const AdoptSchema = z.object({
  id: z.string(),
  receipt: z.string(), //Publication id
  sender: z.string(), //Email of the user that wants to adopt
  name: z.string(), //Name of the user that wants to adopt
  lastname: z.string(), //Name of the user that wants to adopt
  telephone: z.optional(z.string()), //Telephone of the user that wants to adopt
  message: z.string(), //Message of the user that wants to adopt
});
export type AdoptUpdateSchema = z.infer<typeof AdoptUpdateSchema>;
export type AdoptSchema = z.infer<typeof AdoptSchema>;
export type AdoptCreationSchema = z.infer<typeof AdoptCreationSchema>;
export type AdoptWithDog = AdoptPublication & {
  dog: Dog;
};
