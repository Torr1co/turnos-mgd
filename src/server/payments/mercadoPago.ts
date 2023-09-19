import mercadopago from "mercadopago";
import { z } from "zod";

export const MercadoPagoCredentials = z.object({
  key: z
    .string()
    .trim()
    .min(35, "Mínimo 35 caracteres")
    .max(55, "Máximo 55 caracteres"),
  token: z
    .string()
    .trim()
    .min(65, "Mínimo 65 caracteres")
    .max(85, "Máximo 85 caracteres"),
});

export const mp = (token = process.env.MERCADOPAGO_ACCESS_TOKEN as string) => {
  mercadopago.configure({
    access_token: token,
  });
  return mercadopago;
};
