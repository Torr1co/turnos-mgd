import { z } from "zod";

import { HealtBookCreationSchema } from "./healtBook";

export const DogSchema = z.object({
    name: z.string(),
    age: z.number(),
    gender: z.string(),
    color: z.string(),
    weight: z.number(),
    race: z.string(),
    healthBook: HealtBookCreationSchema
});

export const DogCreationSchema = DogSchema.extend({
    owner: z.string()
});

export type DogCreationSchema = z.infer<typeof DogCreationSchema>;
export type DogSchema = z.infer<typeof DogSchema>;