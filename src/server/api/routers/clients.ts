import { UserRoles } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { z } from "zod";
import { ClientCreationSchema } from "~/schemas/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { bookingsRouter } from "./bookings";

export const clientsRouter = createTRPCRouter({
  createClient: publicProcedure
    .input(ClientCreationSchema)
    .mutation(async ({ input, ctx }) => {
      const { password, booking, dog,  ...userData } = input;

      // Hash the password with the secret key
      const hashedPassword = hashSync(
        password + (process.env.HASH_PASSWORD ?? ""),
        10
      );

      // Create the user with the hashed password
      const client = await ctx.prisma.user.create({
          data: {
            ...userData,
            role: UserRoles.CLIENT,
            password: hashedPassword,
        },
      });

      // Create the dog with the user id
      const dogCreation = await ctx.prisma.clientDog.create({
        data: {
          ...dog,
          healthBook:{
            create: {},
          },
          owner: {
            connect: { 
              id: client.id,
            }
          }
       }
      });

      await ctx.prisma.booking.create({
        data: {
          ...booking,
        user: {
          connect: { 
            id: client.id 
          }
        },
        dog: {
          connect: {
            id: dogCreation.id
          }
        }
        }
      })
  
      // const bookingsCreation = bookingsRouter.create({ ...booking, dog: dogCreation.id, user: user.id, });
      
      return client;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  delete: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.delete({ where: { email: input } });
  }),
});
