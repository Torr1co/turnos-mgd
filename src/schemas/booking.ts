import { InquirieType, TimeZone } from "@prisma/client";
import { z } from "zod";

export const BookingSchema = z.object({
  date: z.date(),
  type: z.nativeEnum(InquirieType),
  timeZone: z.nativeEnum(TimeZone, {
    errorMap: () => {
      return { message: "Selecciona un horario valido" };
    },
  }),
});

export const BookingCreationSchema = BookingSchema.extend({
  dog: z.string(),
  user: z.optional(z.string()),
});

export const BookingUpdateSchema = z.object({
  booking: BookingCreationSchema.omit({
    user: true,
    dog: true,
  }).extend({
    id: z.string(),
  }),
  dog: z.string(),
});

export type Booking = z.infer<typeof BookingSchema>;
export type BookingUpdate = z.infer<typeof BookingUpdateSchema>;
export type BookingCreation = z.infer<typeof BookingCreationSchema>;

export const InquirieOptions = [
  {
    value: InquirieType.VACCINE,
    label: "Vacuna",
  },
  {
    value: InquirieType.DEWORMING,
    label: "Desparasitacion",
  },
  {
    value: InquirieType.GENERAL,
    label: "General",
  },
];

export const TimeZoneOptions = [
  {
    value: TimeZone.MORNING,
    label: "Mañana",
  },
  {
    value: TimeZone.AFTERNOON,
    label: "Tarde",
  },
  {
    value: TimeZone.EVENING,
    label: "Anochecer",
  },
];
