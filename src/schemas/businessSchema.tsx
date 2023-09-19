import { type Business, type Service, type Booking } from "@prisma/client";

import { z } from "zod";

export const ServiceRegisterSchema = z.object({
  title: z.string().min(5, "Minimo 3 caracteres"),
  price: z
    .number({
      invalid_type_error: "Requerido",
    })
    .refine((price) => price === 0 || price > 10, "Minimo 10 pesos"),
});

export const BusinessRegisterSchema = z.object({
  title: z
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(50, "Maximo 50 caracteres"),
  desc: z.string().min(3, "Minimo 3 caracteres"),
  image: z.string().optional(),
  address: z.string().optional(),
  addressDesc: z.string().max(150, "Maximo 50 caracteres").optional(),
  website: z.string().optional(),
  days: z
    .array(z.boolean())
    .default([true, true, true, true, true, true, false]),
  schedule: z.array(z.string().min(5, "Minimo 5 caracteres")).default([]),
  labels: z.array(z.string()).default([]),
  services: z.array(ServiceRegisterSchema).default([]),
  ownerId: z.string(),
});

export type ServiceRegisterSchema = z.infer<typeof ServiceRegisterSchema>;
export type BusinessRegisterSchema = z.infer<typeof BusinessRegisterSchema>;
export type ServiceRelated = Service & { bookings: Partial<Booking>[] };
export type BusinessRelated = Business & { services: ServiceRelated[] };
/* const BusinessLabelOptions = [
  {
    value: BusinessLabels.,
    label: "Restaurante",
  },
]; */
