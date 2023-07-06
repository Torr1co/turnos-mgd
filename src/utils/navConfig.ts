import { UserRoles } from "@prisma/client";

export const LINKS = {
  home: "/",
  me: "/me",
  services: "/services",
  bookings: "/bookings",
  clients: "/admin/clients",
  pets: "/pets",
  signin: "/auth/signin",
  newPassword: "/auth/new-password",
  dogAssistance: "/dog-assistance",
  adoptions: "/dog-assistance/adoptions",
  crossBreeds: "/dog-assistance/cross-breeds",
  donationCampaigns: "/dog-assistance/donation-campaigns",
  lostDogs: "/dog-assistance/lost-dogs",
  donationCampaign(donationCampaignId: string) {
    return this.donationCampaigns + "/" + donationCampaignId;
  },
  booking(bookingId: string) {
    return this.bookings + "/" + bookingId;
  },
} as const;

const NAV_CONFIG = {
  home: { label: "Inicio", href: LINKS.home },
  admin: {
    label: "Administracion",
    roles: [UserRoles.VET],
    children: {
      clients: { label: "Clientes", href: LINKS.clients },
      services: { label: "Servicios", href: LINKS.services },
      donation: {
        label: "Campañas de donacion",
        href: LINKS.donationCampaigns,
      },
    },
  },
  dogAssistance: {
    label: "Asistencia de perros",
    children: {
      clientPets: {
        label: "Mis perros",
        href: LINKS.pets,
        roles: [UserRoles.CLIENT],
      },
      adoptions: {
        label: "Adopciones",
        href: LINKS.adoptions,
      },

      /*crossBreeds: {
        label: "Cruza",
        href: LINKS.crossBreeds,
        roles: ["Client"],
      },
      
      lostDogs: {
        label: "Busqueda de perros",
        href: LINKS.lostDogs,
      }, */
    },
  },
  resources: {
    label: "Recursos",
    roles: [UserRoles.CLIENT, null],
    children: {
      services: {
        label: "Servicios",
        href: LINKS.services,
      },
      donationCampaigns: {
        label: "Campañas de donacion",
        href: LINKS.donationCampaigns,
      },
    },
  },
};

/* export const adminLinks = Object.values(NAV_CONFIG.admin.children).map(
  (child) => child.href
); */

export default NAV_CONFIG;
