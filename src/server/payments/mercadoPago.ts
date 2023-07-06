import mercadopago from "mercadopago";
import { env } from "process";

mercadopago.configure({
  access_token: env.MERCADOPAGO_ACCESS_TOKEN as string,
});

export const mp = mercadopago;
