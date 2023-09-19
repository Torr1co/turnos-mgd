import { z } from "zod";

export const PaymentCreationSchema = z.object({
  amount: z.number({
    required_error: "Requerido",
    invalid_type_error: "Requerido",
  }),
});

export type PaymentCreationSchema = z.infer<typeof PaymentCreationSchema>;
