import { UserRoles } from "@prisma/client";
import { z } from "zod";

export const UserCreationSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRoles),
});

export type UserCreation = z.infer<typeof UserCreationSchema>;
