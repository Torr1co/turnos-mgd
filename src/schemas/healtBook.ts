import { z } from "zod";


export const HealtBookCreationSchema = z.object({
    
});

export type HealtBookCreation = z.infer<typeof HealtBookCreationSchema>;