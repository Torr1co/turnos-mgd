import { UserRoles } from "@prisma/client";

export const LINKS = {
  home: "/",
  me: "/me",
  businesses: "/businesses",
  bookings: "/bookings",
  myBookings: "/bookings/my-bookings",
  businessBookings: "/bookings/business-bookings",
  clients: "/admin/clients",
  signin: "/auth/signin",
  newPassword: "/auth/new-password",
} as const;

const NAV_CONFIG = {
  home: { label: "Inicio", href: LINKS.home },
  admin: {
    label: "Administracion",
    roles: [UserRoles.ADMIN],
    children: {
      clients: { label: "Clientes", href: LINKS.clients },
      business: { label: "Negocios", href: LINKS.businesses },
      bookings: { label: "Turnos", href: LINKS.bookings },
    },
  },
  business: {
    label: "Negocios locales",
    href: LINKS.businesses,
    roles: [UserRoles.CLIENT, UserRoles.OWNER, null],
  },
  bookings: {
    label: "Turnos online",
    roles: [UserRoles.CLIENT, UserRoles.OWNER, null],
    children: {
      myBookings: {
        label: "Mis reservas",
        href: LINKS.myBookings,
      },
      myBusinessBookings: {
        roles: [UserRoles.OWNER],
        label: "Reservas a mi negocio",
        href: LINKS.businessBookings,
      },
    },
  },
  me: {
    label: "Mi cuenta",
    href: LINKS.me,
    roles: [UserRoles.CLIENT, UserRoles.OWNER, UserRoles.ADMIN],
  },
};

export const copyToClipboard = async () => {
  await navigator.clipboard.writeText(window.location.toString());
};
/* export const adminLinks = Object.values(NAV_CONFIG.admin.children).map(
  (child) => child.href
); */

export default NAV_CONFIG;
