import { z } from "zod";

export const DogSchema = z
  .object({
    name: z.string().trim().max(20, "Maximo 20 caracteres"),
    birth: z.date({
      required_error: "Requerido",
      invalid_type_error: "Requerido",
    }),
    gender: z.optional(z.string()).default("Mestizo"),
    color: z.string(),
    weight: z.optional(
      z
        .number({
          invalid_type_error: "Requerido",
        })
        .max(150, "No puede pesar mas de 150")
    ),
    height: z.optional(
      z
        .number({
          invalid_type_error: "Requerido",
        })
        .max(200, "No puede medir mas de 200")
    ),
    img: z.optional(z.string()),
    race: z.string(),
    castrated: z.optional(z.boolean()).default(false),
  })
  .partial();

export type Dog = z.infer<typeof DogSchema>;
