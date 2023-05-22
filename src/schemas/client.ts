import { UserRoles } from "@prisma/client";
import { z } from "zod";
import { PetSchema } from "./pet";
import { BookingSchema } from "./booking";

export const ClientCreationSchema = z.object({
  name: z
    .string()
    .min(3, "Mas de 3 caracteres")
    .regex(/^[a-zA-ZñÑ]+$/, "Solo se permiten letras"),
  dni: z.string().min(8, "Minimo 8 digitos ").max(8, "Maximo 8 digitos"),
  lastname: z
    .string()
    .min(3, "Mas de 3 caracteres")
    .regex(/^[a-zA-ZñÑ]+$/, "Solo se permiten letras"),
  email: z.string().email("Ingrese un mail valido"),
  role: z.optional(z.nativeEnum(UserRoles)),
  telephoneNumber: z.optional(z.string().max(15)),
  birth: z.date({
    required_error: "Requerido",
    invalid_type_error: "Requerido",
  }),
  dog: PetSchema,
  booking: BookingSchema,
});

export const UpdateClientSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  dni: z.string().min(8).max(8),
  lastname: z.string().min(3),
  telephoneNumber: z.optional(z.string()),
  //   email: z.string().email(),
  // password: z.string().min(8),
});

export type UpdateClientSchema = z.infer<typeof UpdateClientSchema>;
export type ClientCreation = z.infer<typeof ClientCreationSchema>;
