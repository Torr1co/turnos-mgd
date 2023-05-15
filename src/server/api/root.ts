import { createTRPCRouter } from "~/server/api/trpc";
// import { exampleRouter } from "~/server/api/routers/example";
import { clientsRouter } from "~/server/api/routers/clients";
import { dogsRouter } from "./routers/dogs";
import { bookingsRouter } from "./routers/bookings";
import { vetsRouter } from "./routers/vets";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  bookings: bookingsRouter,
  clients: clientsRouter,
  dogs: dogsRouter,
  vets: vetsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
