import { ServiceTypes } from "@prisma/client";
import { z } from "zod";

/* model Service {
    id           String       @id @default(auto()) @map("_id") @db.ObjectId
    createdAt    DateTime     @default(now())
    updatedAt    DateTime     @updatedAt
    name         String
    email        String
    availability Boolean
    zone         String
    hour         String
    photo        String?
    type         ServiceTypes
    clientsIds   String[]     @db.ObjectId
    clients      User[]       @relation(fields: [clientsIds], references: [id])
} */
export const ServiceCreationSchema = z.object({
  name: z.string().trim().min(1, "Requerido").max(50, "Maximo 50 caracteres"),
  email: z.string().trim().min(1, "Requerido"),
  zone: z
    .string()
    .trim()
    .min(10, "Minimo 10 caracteres")
    .max(50, "Maximo 50 caracteres"),
  hour: z
    .string()
    .trim()
    .min(10, "Minimo 10 caracteres")
    .max(50, "Maximo 50 caracteres"),
  photo: z.string().nullish(),
  types: z.array(z.nativeEnum(ServiceTypes)).min(1, "Requerido"),
});

export const ServiceUpdateSchema = ServiceCreationSchema.omit({
  types: true,
})
  .partial()
  .extend({
    id: z.string(),
    availability: z.optional(z.boolean()),
    type: z.optional(z.nativeEnum(ServiceTypes)),
  });

export const ServiceGetAllSchema = z
  .optional(
    z.object({
      enabled: z.boolean(),
    })
  )
  .default({ enabled: true });

export type ServiceCreationSchema = z.infer<typeof ServiceCreationSchema>;
export type ServiceUpdateSchema = z.infer<typeof ServiceUpdateSchema>;

export const ServiceOptions = [
  {
    value: ServiceTypes.DOGWALKER,
    label: "Paseador",
  },
  {
    value: ServiceTypes.DOGWATCHER,
    label: "Cuidador",
  },
] as const;
