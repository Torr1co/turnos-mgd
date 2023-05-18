import { z } from "zod";

export const SessionUpdateSchema = z.object({
  telephoneNumber: z.optional(
    z
      .number()
      .positive()
      .transform((x) => x.toString())
  ),
  name: z.optional(z.string().min(3)),
});

export const SessionUpdatePasswordSchema = z.object({
  prevPassword: z.optional(z.string().min(8, "Minimo 8 caracteres")),
  password: z.string().min(8, "Minimo 8 caracteres"),
});

export const PasswordUpdateSchema = SessionUpdatePasswordSchema.extend({
  confirm: z.string().min(8, "Minimo 8 caracteres"),
}).refine((data) => data.password === data.confirm, {
  message: "Contraseñas no coinciden",
  path: ["confirm"],
});

export type SessionUpdate = z.infer<typeof SessionUpdateSchema>;
export type PasswordUpdate = z.infer<typeof PasswordUpdateSchema>;
