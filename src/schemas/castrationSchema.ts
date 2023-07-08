import { z } from "zod";

export const CastrationCompletionSchema = z.object({
    succesful : z.boolean(),
    
  });