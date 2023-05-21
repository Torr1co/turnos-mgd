import { createTRPCRouter } from "~/server/api/trpc";
// import { exampleRouter } from "~/server/api/routers/example";
// import { usersRouter } from "~/server/api/routers/users";
import { petsRouter } from "./routers/pets";
import { bookingsRouter } from "./routers/bookings";
import { vetsRouter } from "./routers/vets";
import { clientsRouter } from "./routers/clients";
import { adoptPublicationRouter } from "./routers/adoptPublication";
import { sessionRouter } from "./routers/session";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  adoptPublications: adoptPublicationRouter,
  pets: petsRouter,
  bookings: bookingsRouter,
  clients: clientsRouter,
  vets: vetsRouter,
  session: sessionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
