import {
  type Booking,
  type Service,
  type Business,
  type BookingPayment,
  type User,
} from "@prisma/client";
import { z } from "zod";
import { BookingStatus } from "@prisma/client";
import { PaymentCreationSchema } from "./paymentSchema";

export type BookingRelated = Booking & {
  service: Service & {
    business: Business;
  };
  payment: BookingPayment | null;
  user: Omit<User, "password"> | null;
};

// BookingPreferenceSchema
export const StartBookingSchema = z
  .object({
    date: z.date({
      required_error: "Requerido",
      invalid_type_error: "Requerido",
    }),
    schedule: z.string().min(1, "Requerido"),
    serviceId: z.string().min(1, "Requerido"),
    username: z.optional(
      z
        .string()
        .trim()
        .min(3, "Minimo 3 caracteres")
        .max(15, "Maximo 15 caracteres")
    ),
  })
  .extend({
    payment: PaymentCreationSchema,
  });

export const BookingCreationSchema = StartBookingSchema.extend({
  userId: z.optional(z.string().min(1, "Requerido")),
  payment: z.optional(
    PaymentCreationSchema.extend({
      id: z.string().min(1, "Requerido"),
    })
  ),
});

export const BookingPaymentCreationSchema = StartBookingSchema.extend({
  userId: z.optional(z.string().min(1, "Requerido")),
  ["data.id"]: z.string().min(1, "Requerido"),
  amount: PaymentCreationSchema.shape.amount,
  date: z.string().min(1, "Requerido"),
}).omit({ payment: true });

export type StartBookingSchema = z.infer<typeof StartBookingSchema>;
export type BookingCreationSchema = z.infer<typeof BookingCreationSchema>;

export type BookingPaymentCreationSchema = z.infer<
  typeof BookingPaymentCreationSchema
>;

export const BookingStatusOptions = [
  {
    value: BookingStatus.COMPLETED,
    label: "Completado",
  },
  {
    value: BookingStatus.APPROVED,
    label: "Aprobado",
  },
  {
    value: BookingStatus.PENDING,
    label: "Pediente",
  },
] as const;

export const TimeZoneOptions = [
  /*  */
] as const;
