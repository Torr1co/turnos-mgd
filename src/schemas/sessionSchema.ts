import { z } from "zod";

export const SessionUpdateSchema = z.object({
  telephoneNumber: z.string().trim().max(15, "Maximo 15 digitos"),
  name: z.optional(
    z
      .string()
      .trim()
      .min(3, "Mas de 3 caracteres")
      .regex(/^[a-zA-ZñÑ]+$/, "Solo se permiten letras")
  ),
  lastname: z.optional(
    z
      .string()
      .trim()
      .min(3, "Mas de 3 caracteres")
      .regex(/^[a-zA-ZñÑ]+$/, "Solo se permiten letras")
  ),
});

export const SessionUpdatePasswordSchema = z.object({
  prevPassword: z.optional(z.string().min(1, "Requerido")),
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
