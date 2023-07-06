import { createTRPCRouter } from "~/server/api/trpc";
// import { exampleRouter } from "~/server/api/routers/example";
// import { usersRouter } from "~/server/api/routers/users";
import { petsRouter } from "./routers/petsRouter";
import { bookingsRouter } from "./routers/bookingsRouter";
import { vetsRouter } from "./routers/vetsRouter";
import { clientsRouter } from "./routers/clientsRouter";
import { adoptPublicationRouter } from "./routers/adoptionRouter";
import { sessionRouter } from "./routers/sessionRouter";
import { servicesRouter } from "./routers/servicesRouter";
import { contactRouter } from "./routers/contactRouter";
import { donationCampaignsRouter } from "./routers/donationsRouter";
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
  services: servicesRouter,
  contact: contactRouter,
  donationCampaigns: donationCampaignsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
