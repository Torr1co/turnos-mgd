import { z } from "zod";

export const PetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Minimo 1 caracter")
    .max(20, "Maximo 20 caracteres"),
  birth: z.date({
    required_error: "Requerido",
    invalid_type_error: "Requerido",
  }),
  gender: z.optional(z.string().trim()).default("Mestizo"),
  color: z.string().trim(),
  weight: z
    .number({
      required_error: "Requerido",
      invalid_type_error: "Requerido",
    })
    .max(150, "No puede pesar mas de 150"),
  height: z
    .number({
      required_error: "Requerido",
      invalid_type_error: "Requerido",
    })
    .max(200, "No puede medir mas de 200"),
  img: z.optional(z.string()),
  race: z.string().min(1, "Minimo 1 caracter").trim(),
  castrated: z.optional(z.boolean()).default(false),
  letsCross: z.optional(z.boolean()).default(false),
  observations: z.optional(z.string()).default(""),
});

export const PetCreationSchema = PetSchema.extend({
  owner: z.string(),
});

export const PetUpdateSchema = z.object({
  petId: z.string(),
  dog: PetSchema.partial(),
});

export type PetSchema = z.infer<typeof PetSchema>;
export type PetUpdateSchema = z.infer<typeof PetUpdateSchema>;
export type PetCreationSchema = z.infer<typeof PetCreationSchema>;

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
