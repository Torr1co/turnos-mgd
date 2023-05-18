// // import { UserRoles } from "@prisma/client";
// import { AdoptCreationSchema } from "~/schemas/adoptPublication";
// // import { z } from "zod";

import { createTRPCRouter } from "~/server/api/trpc";
// import { bookingsRouter } from "./bookings";

export const adoptPublicationRouter = createTRPCRouter({
  // create: publicProcedure
  //   .input(AdoptCreationSchema)
  //   .mutation(async ({ input, ctx }) => {
  //     // const { email, reason, dog } = input;
  //     // const adoptPublication = await ctx.prisma.adoptPublication.create({
  //     //   data: {
  //     //     email,
  //     //     reason,
  //     //     dog: {
  //     //       create: { ...dog },
  //     //     },
  //     //   },
  //     // });
  //     return adoptPublication;
  //   }),
});
