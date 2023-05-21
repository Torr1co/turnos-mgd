import { optional, z } from "zod";

export const DogSchema = z.object({
  name: optional(z.string()),
  age: z.date(),
  gender: optional(z.string()),
  color: optional(z.string()),
  height: optional(z.number()),
  weight: optional(z.number()),
  race: optional(z.string()),
});

export type DogSchema = z.infer<typeof DogSchema>;
