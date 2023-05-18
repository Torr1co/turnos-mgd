import { getToken } from "next-auth/jwt";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import { type User, UserRoles } from "@prisma/client";
import { LINKS } from "./utils/navConfig";

export async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const token = await getToken({ req: request });

  if (
    token &&
    (token.user as User).role === UserRoles.CLIENT &&
    !token.passwordVerified
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
