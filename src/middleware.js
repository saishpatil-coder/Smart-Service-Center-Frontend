import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode("secret");
const LOGIN_URL = "/login";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // 1. If user is going to Login and already has a token
  if (pathname === LOGIN_URL && token) {
    try {
      // Verify and decode the JWT
      const { payload } = await jwtVerify(token, SECRET);
      const role = payload.role?.toLowerCase() || "client";
      // Redirect to /dashboard/admin, /dashboard/mechanic, etc.
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
    } catch (err) {
      // If token is invalid, let them proceed to login page
      return NextResponse.next();
    }
  }

  // 2. Protect Dashboard Routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = LOGIN_URL;
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET);

      // Optional: Prevent a 'mechanic' from accessing '/dashboard/admin'
      if (pathname.startsWith("/dashboard/admin") && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/mechanic", req.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL(LOGIN_URL, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
