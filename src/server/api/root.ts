import { createTRPCRouter } from "~/server/api/trpc";
// import { exampleRouter } from "~/server/api/routers/example";
// import { usersRouter } from "~/server/api/routers/users";
import { bookingsRouter } from "./routers/bookingsRouter";
import { ownersRouter } from "./routers/ownersRouter";
import { clientsRouter } from "./routers/usersRouter";
import { sessionRouter } from "./routers/sessionRouter";
import { contactRouter } from "./routers/contactRouter";
import { businessRouter } from "./routers/businessRouter";
import { paymentsRouter } from "./routers/paymentsRouter";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  payments: paymentsRouter,
  bookings: bookingsRouter,
  businesses: businessRouter,
  clients: clientsRouter,
  owners: ownersRouter,
  session: sessionRouter,
  contact: contactRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
