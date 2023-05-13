import { createTRPCRouter } from "~/server/api/trpc";
// import { exampleRouter } from "~/server/api/routers/example";
import { usersRouter } from "~/server/api/routers/users";
import { petsRouter } from "./routers/pets";
import { bookingsRouter } from "./routers/bookings";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  pets: petsRouter,
  bookings: bookingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
