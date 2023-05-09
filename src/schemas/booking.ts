import { InquirieType, TimeZone } from "@prisma/client";
import { z } from "zod";

export const BookingSchema = z.object({
  date: z.date(),
  type: z.nativeEnum(InquirieType),
  timeZone: z.nativeEnum(TimeZone),
});

export const BookingCreationSchema = BookingSchema.extend({
  dog: z.string(),
  user: z.string(),
});

export type BookingSchema = z.infer<typeof BookingSchema>;
export type BookingCreationSchema = z.infer<typeof BookingCreationSchema>;
