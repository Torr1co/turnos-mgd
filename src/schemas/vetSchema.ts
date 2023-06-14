import { UserRoles } from "@prisma/client";
import { z } from "zod";

export const VetCreationSchema = z.object({
  name: z.string().min(3),
  dni: z.string().min(7),
  lastname: z.string().min(3),
  email: z.string().trim().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRoles),
});

export type VetCreation = z.infer<typeof VetCreationSchema>;
