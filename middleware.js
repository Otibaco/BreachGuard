// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Paths that are strictly protected
const AUTH_ROUTES = ["/control-center"];

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Redirect authenticated admins away from the login page
  if (token && pathname === "/control-center/login") {
    return NextResponse.redirect(new URL("/control-center", request.url));
  }

  const isAdminRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isLoginRoute = pathname === "/control-center/login";

  if (isAdminRoute && !isLoginRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/control-center/login", request.url));
    }

    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/control-center/:path*"],
};
