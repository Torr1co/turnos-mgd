// import { z } from "zod";

// import { DogCreationSchema } from "~/schemas/clientDog";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const dogsRouter = createTRPCRouter({
    
    // create: protectedProcedure
    //     .input(DogCreationSchema)
    //     .mutation(async ({ input, ctx }) => {
        
    //     return ctx.prisma.clientDog.create({
    //         data: {
    //             ...input,
    //         },
    //     });
    // }),


  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.clientDog.findMany();
  }),

  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  
});
