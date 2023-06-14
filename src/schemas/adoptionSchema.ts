import { type AdoptPublication, type Dog } from "@prisma/client";
import { z } from "zod";
import { DogSchema } from "./dogSchema";

export const AdoptCreationSchema = z.object({
  email: z.string().trim().email("Ingrese un mail valido"),
  reason: z.string().trim().min(10, "Minimo 10 caracteres"),
  info: z.optional(z.string()),
  dog: DogSchema.partial(),
});

export const AdoptUpdateSchema = AdoptCreationSchema.extend({
  id: z.string(),
});

export type AdoptUpdateSchema = z.infer<typeof AdoptUpdateSchema>;
export type AdoptCreationSchema = z.infer<typeof AdoptCreationSchema>;
export type AdoptWithDog = AdoptPublication & {
  dog: Dog;
};
