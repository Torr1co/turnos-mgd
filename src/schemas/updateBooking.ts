import { z } from "zod";
import { BookingSchema } from "./booking";

export const UpdateBookingSchema = z.object({
  id: z.string(),
  dog: z.string(),
  booking: BookingSchema,
});

export type UpdateBookingSchema = z.infer<typeof UpdateBookingSchema>;
