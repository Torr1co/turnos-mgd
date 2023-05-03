import { z } from "zod";

export const UserCreationSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["VET", "CLIENT"]),
});

export const UserSchema = UserCreationSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserRoles = z.infer<typeof UserSchema>["role"];
export type UserCreation = z.infer<typeof UserCreationSchema>;
export type User = z.infer<typeof UserSchema>;
