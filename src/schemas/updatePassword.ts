import { z } from "zod";

export const UpdatePasswordSchema = z.object({
  id: z.string(),
  password: z.string().min(8),
  // name: z.string().min(3),
  // dni: z.string().min(8).max(8),
  // lastname: z.string().min(3),
  // telephoneNumber: z.optional(z.string()),
  //   email: z.string().email(),
});

export type UpdatePasswordSchema = z.infer<typeof UpdatePasswordSchema>;
