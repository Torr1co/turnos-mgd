import { InquirieType, TimeZone } from "@prisma/client";
import { z } from "zod";
// import { UserCreationSchema } from "./user";
// import { DogCreationSchema } from "./clientDog";



export const BookingCreationSchema = z.object({
    date: z.date(),
    type: z.nativeEnum(InquirieType),
    timeZone: z.nativeEnum(TimeZone),
    dog: z.string(),
    user: z.string(),
});

export type BookingCreation = z.infer<typeof BookingCreationSchema>;