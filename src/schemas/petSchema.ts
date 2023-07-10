import { z } from "zod";
import { type Pet, type User } from "@prisma/client";
import { BookingRelated } from "./bookingSchema";
export const PetSchema = z.object({
  name: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Requerido")
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
  race: z.string().min(1, "Requerido").trim(),
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

export const PetDisableSchema = z.object({
  petId: z.string(),
});

export type PetRelated = Pet & {
  owner: User;
  bookings: BookingRelated[];
};
export type PetSchema = z.infer<typeof PetSchema>;
export type PetUpdateSchema = z.infer<typeof PetUpdateSchema>;
export type PetDisableSchema = z.infer<typeof PetDisableSchema>;
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
