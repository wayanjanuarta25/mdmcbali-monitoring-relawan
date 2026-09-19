import { NextResponse, type NextRequest } from "next/server";

import { getMiddlewareAuth } from "@/lib/supabase/middleware";
import { ROLE_HOME, type UserRole } from "@/types/auth";

const ROUTE_ROLES: Array<{ prefix: string; roles: readonly UserRole[] }> = [
  {
    prefix: "/admin/wilayah",
    roles: ["ADMIN_WILAYAH_BALI"],
  },
  {
    prefix: "/admin/daerah",
    roles: ["ADMIN_WILAYAH_BALI", "ADMIN_DAERAH"],
  },
];

function matchesRoute(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function redirectWithCookies(
  request: NextRequest,
  destination: string,
  sourceResponse: NextResponse,
) {
  const response = NextResponse.redirect(new URL(destination, request.url));
  sourceResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}

export async function middleware(request: NextRequest) {
  const { response, user, profile } = await getMiddlewareAuth(request);
  const route = ROUTE_ROLES.find(({ prefix }) =>
    matchesRoute(request.nextUrl.pathname, prefix),
  );

  if (request.nextUrl.pathname === "/login" && user && profile) {
    return redirectWithCookies(request, ROLE_HOME[profile.role], response);
  }

  if (!route) return response;
  if (!user) return redirectWithCookies(request, "/login", response);
  if (!profile) {
    return redirectWithCookies(request, "/login?error=profile", response);
  }
  if (!route.roles.includes(profile.role)) {
    return redirectWithCookies(request, ROLE_HOME[profile.role], response);
  }

  return response;
}

export const config = {
  matcher: ["/login", "/dashboard", "/admin/:path*"],
};
