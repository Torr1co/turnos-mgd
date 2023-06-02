import { getToken } from "next-auth/jwt";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import { UserRoles } from "@prisma/client";
import { LINKS } from "./utils/navConfig";
import { type Session } from "next-auth";
/* import NAV_CONFIG from "~/utils/navConfig";
import { type NavItem } from "./components/Layout/Header/Navbar"; */

export async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const token = (await getToken({ req: request })) as Session | null;

  // If the user is not confirm, redirect to the new password page
  if (
    token &&
    token.user.role === UserRoles.CLIENT &&
    !token.user.passwordVerified
  ) {
    const url = new URL(LINKS.newPassword, request.url);
    return NextResponse.redirect(url);
  }

  // checks if the user has access to that page
  /* const url = new URL(request.url);
  const path = url.pathname;
  const navItem = Object.values(NAV_CONFIG).find((item: NavItem) => {
    if (item.href === path) return true;
    if (item.children) {
      return Object.values(item.children).find((child) => {
        return child.href === path;
      });
    }
    return false;
  }) as NavItem | undefined;
  if (navItem) {
    const canAccess =
      !navItem.roles || navItem.roles.includes(token?.user.role ?? null);
    if (!canAccess) {
      return NextResponse.redirect(LINKS.home);
    }
  } */

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/me",
    "/pets",
    "/pets/:path*",
    "/services",
    "/admin/clients",
    "/auth/signin",
    // "/auth/new-password",
    "/dog-assistance",
    "/dog-assistance/adoptions",
    "/dog-assistance/cross-breeds",
    "/dog-assistance/donation-campaigns",
    "/dog-assistance/lost-dogs",
  ],
};
