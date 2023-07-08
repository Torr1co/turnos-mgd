import {z} from "zod";
export const VaccineCompletionSchema = z.object({
    dosis: z
      .number({
        required_error: "Requerido",
        invalid_type_error: "Requerido",
      }),
    

  });
  
  export type VaccineCompletionSchema = z.infer<typeof VaccineCompletionSchema>;