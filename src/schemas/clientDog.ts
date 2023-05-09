import { z } from "zod";

export const DogSchema = z.object({
  name: z.string(),
  age: z.number(),
  gender: z.string(),
  color: z.string(),
  weight: z.number(),
  img: z.optional(z.string()),
  letsCross: z.optional(z.boolean()),
  race: z.string(),
});

export const DogCreationSchema = DogSchema.extend({
  owner: z.string(),
});

export type DogCreationSchema = z.infer<typeof DogCreationSchema>;
export type DogSchema = z.infer<typeof DogSchema>;
