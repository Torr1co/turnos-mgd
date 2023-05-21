import { z } from "zod";
import { DogSchema } from "./dog";

export const AdoptPublicationSchema = z.object({
  email: z.string().email(),
  reason: z.string(),
  info: z.optional(z.string()),
  dog: DogSchema.partial(),
});

export type AdoptPublication = z.infer<typeof AdoptPublicationSchema>;
