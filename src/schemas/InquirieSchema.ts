import { z } from "zod";


export const InquirieCompletionSchema = z.object({
  height: z
    .number({
      required_error: "Requerido",
      invalid_type_error: "Requerido",
    })
    .max(200, "No puede medir mas de 200"),
  observations: z.optional(z.string()).default(""),
});

export type InquirieCompletionSchema = z.infer<typeof InquirieCompletionSchema>;

