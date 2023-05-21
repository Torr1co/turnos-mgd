import { z } from "zod";

export const UpdatePetSchema = z.object({
  id: z.string(),
  weight: z.number(),
  height: z.number(),
});

export type UpdatePetSchema = z.infer<typeof UpdatePetSchema>;
