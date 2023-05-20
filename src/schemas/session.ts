import { z } from "zod";

export const SessionUpdateSchema = z.object({
  telephoneNumber: z.optional(z.string().max(15)),
  name: z.optional(z.string().min(3)),
});

export const SessionUpdatePasswordSchema = z.object({
  prevPassword: z.optional(z.string()),
  password: z.string().min(8, "Minimo 8 caracteres"),
});

export const PasswordUpdateSchema = SessionUpdatePasswordSchema.extend({
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: "Contraseñas no coinciden",
  path: ["confirm"],
});

export type SessionUpdate = z.infer<typeof SessionUpdateSchema>;
export type PasswordUpdate = z.infer<typeof PasswordUpdateSchema>;
