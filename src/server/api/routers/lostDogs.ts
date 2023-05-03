import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const LostDogSchema = z.object({
  lastTimeView: z.date(),
  message: z.string(),
  photo: z.optional(z.string()),
});

export const exampleRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  //   create: publicProcedure.input(LostDogSchema).mutation(({ctx, input}) => {
  //     return ctx.prisma.lostDogs.create({data:input})
  //   })
});
