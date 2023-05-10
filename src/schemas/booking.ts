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
  user: z.string(),
});

export type BookingSchema = z.infer<typeof BookingSchema>;
export type BookingCreationSchema = z.infer<typeof BookingCreationSchema>;

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
