import { getToken } from "next-auth/jwt";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import { UserRoles } from "@prisma/client";
import { LINKS } from "./utils/navConfig";
import { type Session } from "next-auth";

export async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const token = (await getToken({ req: request })) as Session | null;
  if (
    token &&
    token.user.role === UserRoles.CLIENT &&
    !token.user.passwordVerified
  ) {
    const url = new URL(LINKS.newPassword, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
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
