import { z } from "zod";

export const PetSchema = z.object({
  name: z.string(),
  birth: z.date(),
  gender: z.string(),
  color: z.string(),
  weight: z.number(),
  height: z.number(),
  img: z.optional(z.string()),
  letsCross: z.optional(z.boolean()),
  race: z.string(),
});

export const PetCreationSchema = PetSchema.extend({
  owner: z.string(),
});

export type PetCreationSchema = z.infer<typeof PetCreationSchema>;
export type PetSchema = z.infer<typeof PetSchema>;

export const GenderOptions = [
  {
    value: "MALE",
    label: "Macho",
  },
  {
    value: "FEMALE",
    label: "Hembra",
  },
];
