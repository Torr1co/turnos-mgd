import { UserRoles } from "@prisma/client";
import { z } from "zod";
import { PetSchema } from "./pet";
import { BookingSchema } from "./booking";

export const ClientCreationSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-zA-Z]+$/),
  dni: z.string().min(8).max(8),
  lastname: z
    .string()
    .min(3)
    .regex(/^[a-zA-Z]+$/),
  email: z.string().email(),
  // password: z.string().min(8),
  role: z.optional(z.nativeEnum(UserRoles)),
  telephoneNumber: z.optional(z.string().regex(/^\+{0,1}[0-9]+$/)),
  dog: PetSchema,
  booking: BookingSchema,
});

export type ClientCreation = z.infer<typeof ClientCreationSchema>;
