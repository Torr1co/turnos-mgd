// import { z } from "zod";

// import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// const SumaInputSchema = z.object({ numero1: z.number(), numero2: z.number() });
// export const exampleRouter = createTRPCRouter({
//   getAll: publicProcedure.query(({ ctx }) => {
//     return ctx.prisma.example.findMany();
//   }),

//   getSecretMessage: publicProcedure.query(() => {
//     return "you can now see this secret message!";
//   }),

//   suma: publicProcedure.input(SumaInputSchema).mutation(({ input }) => {
//     return input.numero1 + input.numero2;
//   }),
// });
