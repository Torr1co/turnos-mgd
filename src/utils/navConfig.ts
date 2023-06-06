import { UserRoles } from "@prisma/client";

export const LINKS = {
  home: "/",
  me: "/me",
  services: "/services",
  clients: "/admin/clients",
  pets: "/pets",
  signin: "/auth/signin",
  newPassword: "/auth/new-password",
  dogAssistance: "/dog-assistance",
  adoptions: "/dog-assistance/adoptions",
  crossBreeds: "/dog-assistance/cross-breeds",
  donationCampaigns: "/dog-assistance/donation-campaigns",
  lostDogs: "/dog-assistance/lost-dogs",
} as const;

const NAV_CONFIG = {
  home: { label: "Inicio", href: LINKS.home },
  admin: {
    label: "Administracion",
    roles: [UserRoles.VET],
    children: {
      clients: { label: "Clientes", href: LINKS.clients },
      services: { label: "Servicios", href: LINKS.services },
    },
  },
  breedDogs: {
    label: "Cuida tus mascotas",
    roles: [UserRoles.CLIENT, null],
    children: {
      clientPets: {
        label: "Mis perros",
        href: LINKS.pets,
        roles: [UserRoles.CLIENT],
      },
      services: {
        label: "Servicios",
        href: LINKS.services,
      },
    },
  },
  dogAssistance: {
    label: "Asistencia de perros",
    children: {
      adoptions: {
        label: "Adopciones",
        href: LINKS.adoptions,
      },
      /*  vetPets: {
        label: "Perros",
        href: LINKS.pets,
        roles: [UserRoles.VET],
      }, */

      /*       crossBreeds: {
        label: "Cruza",
        href: LINKS.crossBreeds,
        roles: ["Client"],
      },
      donationCampaigns: {
        label: "Campañas de donacion",
        href: LINKS.donationCampaigns,
      },
      lostDogs: {
        label: "Busqueda de perros",
        href: LINKS.lostDogs,
      }, */
    },
  },
  signin: { label: "Iniciar sesion", href: "/auth/signin" },
};

/* export const adminLinks = Object.values(NAV_CONFIG.admin.children).map(
  (child) => child.href
); */

export default NAV_CONFIG;
