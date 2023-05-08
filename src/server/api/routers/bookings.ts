import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

import { BookingCreationSchema } from "~/schemas/booking";

export const bookingsRouter = createTRPCRouter({

    create: protectedProcedure
        .input(BookingCreationSchema)
        .mutation(async ({ input, ctx }) => {
      
        const { dog, user, ...booking } = input;
        
        return ctx.prisma.booking.create({
            data: {
                ...booking,
                dog:{
                    connect:{
                        id: dog
                    }
                },
                user:{
                    connect:{
                        id: user
                    }
                }
         },
        });
    }),

    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.booking.findMany();    
    }),
 
});
