import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

// Define Role-Based Paths for redirection
const ROLE_DASHBOARDS = {
  ADMIN: "/dashboard/admin",
  MECHANIC: "/dashboard/mechanic",
  CLIENT: "/dashboard/client",
};

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1. Get the token from cookies
  const token = req.cookies.get("token")?.value;

  // 2. Define protected routes
  const isLoginPage = pathname === "/login";
  const isDashboard = pathname.startsWith("/dashboard");

  // -------------------------------------------------------------
  // SCENARIO A: User is NOT logged in
  // -------------------------------------------------------------
  if (!token) {
    // If trying to access dashboard, kick them to login
    if (isDashboard) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Otherwise, let them proceed (e.g., to /login or public pages)
    return NextResponse.next();
  }
  if(isLoginPage){
          return NextResponse.redirect(new URL("/", req.url));

  }
    return NextResponse.next();
  
}

export const config = {
  // Apply to all dashboard routes and the login page
  matcher: ["/dashboard/:path*", "/login"],
};
