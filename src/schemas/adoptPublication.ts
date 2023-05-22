import { AdoptPublication, Dog } from "@prisma/client";
import { z } from "zod";
import { DogSchema } from "./dog";

export const AdoptCreationSchema = z.object({
  email: z.string().email(),
  reason: z.string(),
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
