import { z } from "zod";

export const DewormingCompletionSchema = z.object({
    product: z
      .string()
      .trim()
      .min(3, "Mínimo 3 caracteres")
      .max(20, "Máximo 20 caracteres")
      .regex(/^[a-zA-ZñÑ]+$/, "Solo se permiten letras"),
    dosis: z
      .number({
        required_error: "Requerido",
        invalid_type_error: "Requerido",
      })
      .max(150, "No puede pesar mas de 150"),
    

  });
  
  export type DewormingCompletionSchema = z.infer<typeof DewormingCompletionSchema>;