import { z } from "zod";

export const UserCreationSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(3, "Mínimo 3 caracteres")
    .max(20, "Máximo 20 caracteres")
    .regex(/^[a-zA-ZñÑ ]+$/, "Solo se permiten letras")
    .refine((data) => data.split(" ").length <= 2, {
      message: "Maximo 2 nombres",
    }),
  dni: z.string().trim().min(7, "Mínimo 7 digitos ").max(8, "Máximo 8 digitos"),
  lastname: z
    .string()
    .trim()
    .min(3, "Ingresar mínimo 3 caracteres")
    .regex(/^[a-zA-ZñÑ ]+$/, "Solo se permiten letras")
    .refine((data) => data.split(" ").length <= 2, {
      message: "Maximo 2 apellidos",
    }),
  email: z.string().trim().email("Ingrese un mail valido"),
  phoneNumber: z.optional(z.string().max(15, "Máximo 15 digitos")),
  // role: z.optional(z.nativeEnum(UserRoles)),
});

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
export type UserCreationSchema = z.infer<typeof UserCreationSchema>;
