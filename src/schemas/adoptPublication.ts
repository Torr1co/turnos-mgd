import { z } from "zod";
import { DogSchema } from "./dog";

export const AdoptCreationSchema = z.object({
  // id: z.string(),
  email: z.string().email(),
  reason: z.string(),
  dog: DogSchema,
  user: z.string(),
});

export type AdoptCreationSchema = z.infer<typeof AdoptCreationSchema>;
