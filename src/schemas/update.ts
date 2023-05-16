import { z } from "zod";

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
