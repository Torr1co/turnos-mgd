import { z } from "zod";

export const PetSchema = z.object({
  name: z.string().min(1),
  birth: z.date().max(new Date()),
  gender: z.string(),
  color: z.string(),
  weight: z.number(),
  height: z.number(),
  img: z.optional(z.string()),
  race: z.string().min(1),
  castrated: z.optional(z.boolean()).default(false),
  letsCross: z.optional(z.boolean()).default(false),
  observations: z.optional(z.string()).default(""),
});

export const PetCreationSchema = PetSchema.extend({
  owner: z.string(),
});

export type PetCreation = z.infer<typeof PetCreationSchema>;
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
