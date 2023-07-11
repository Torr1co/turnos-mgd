import { TimeZone, VaccineType } from "@prisma/client";
import { z } from "zod";
import { BookingCompletionSchema } from "./bookingSchema";

export const UrgencySchema = BookingCompletionSchema.omit({
  bookingId: true,
}).extend({
  vaccineType: z.optional(z.nativeEnum(VaccineType)),
  weight: z.optional(
    z
      .number({
        required_error: "Requerido",
        invalid_type_error: "Requerido",
      })
      .max(150, "No puede pesar mas de 150")
  ),
  timeZone: z.nativeEnum(TimeZone, {
    errorMap: () => {
      return { message: "Selecciona un horario valido" };
    },
  }),
  urgency: z
    .object({
      enableCastration: z.optional(z.boolean()),
      enableVaccine: z.optional(z.boolean()),
      enableDeworming: z.optional(z.boolean()),
      clientId: z.nullable(z.string()),
      petId: z.optional(z.string()),
    })
    .refine((data) => (data.clientId ? data.petId : true), {
      message: "El perro es requerido",
      path: ["petId"],
    }),
});

export type UrgencySchema = z.infer<typeof UrgencySchema>;
