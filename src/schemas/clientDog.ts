import { z } from "zod";
import { UserCreationSchema } from "./user";
import { HealtBookCreationSchema } from "./healtBook";

export const DogCreationSchema = z.object({
    name: z.string(),
    age: z.number(),
    gender: z.string(),
    color: z.string(),
    weight: z.number(),
    race: z.string(),
    healthBook: HealtBookCreationSchema,
    owner: UserCreationSchema
});

export type DogCreation = z.infer<typeof DogCreationSchema>;