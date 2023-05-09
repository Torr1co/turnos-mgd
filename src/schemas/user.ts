import { UserRoles } from "@prisma/client";
import { z } from "zod";
import { DogSchema } from "./clientDog";
import { BookingSchema } from "./booking";

export const UserCreationSchema = z.object({
  name: z.string().min(3),
  dni: z.string().min(7),
  lastname: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRoles),
  dog: DogSchema,
  booking: BookingSchema,
});

export type UserCreation = z.infer<typeof UserCreationSchema>;
