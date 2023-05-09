import { UserRoles } from "@prisma/client";
import { z } from "zod";
import { DogSchema } from "./clientDog";
import { BookingSchema } from "./booking";

export const ClientCreationSchema = z.object({
  name: z.string().min(3),
  dni: z.string().min(8).max(8),
  lastname: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.optional(z.nativeEnum(UserRoles)),
  telephoneNumber: z.optional(z.string()),
  dog: DogSchema,
  booking: BookingSchema,
});

export type ClientCreation = z.infer<typeof ClientCreationSchema>;
