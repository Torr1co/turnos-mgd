import { z } from "zod";
import { DogSchema } from "./dog";

export const AdoptPublicationSchema = z.object({
  // id: z.string(),
  email: z.string().email(),
  reason: z.string(),
  dog: DogSchema,
  user: z.string(),
});

export type AdoptPublicationSchema = z.infer<typeof AdoptPublicationSchema>;
