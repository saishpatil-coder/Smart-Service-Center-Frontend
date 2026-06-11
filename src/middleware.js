import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

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

  // 2. Define protected/auth routes
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isAuthPage = isLoginPage || isRegisterPage;
  const isDashboard = pathname.startsWith("/dashboard");

  // -------------------------------------------------------------
  // SCENARIO A: User is NOT logged in
  // -------------------------------------------------------------
  if (!token) {
    // If trying to access dashboard, kick them to login
    if (isDashboard) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Otherwise, let them proceed (e.g., to /login, /register, or public pages)
    return NextResponse.next();
  }

  // -------------------------------------------------------------
  // SCENARIO B: User IS logged in (Verify Token & Role)
  // -------------------------------------------------------------
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const role = payload.role?.toUpperCase(); // ADMIN, MECHANIC, CLIENT

    // If already logged in, redirect away from auth pages to their dashboard
    if (isAuthPage) {
      const dashboardPath = ROLE_DASHBOARDS[role] || "/dashboard/client";
      return NextResponse.redirect(new URL(dashboardPath, req.url));
    }

    if (isDashboard) {
      // 1. Redirect if user accesses the naked '/dashboard' or '/dashboard/' path
      if (pathname === "/dashboard" || pathname === "/dashboard/") {
        const dashboardPath = ROLE_DASHBOARDS[role] || "/dashboard/client";
        return NextResponse.redirect(new URL(dashboardPath, req.url));
      }

      // 2. Role-Based Path Authorization
      if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      if (pathname.startsWith("/dashboard/mechanic") && role !== "MECHANIC") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      if (pathname.startsWith("/dashboard/client") && role !== "CLIENT") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  } catch (err) {
    console.error("JWT verification failed in middleware:", err);
    // Token is invalid/expired - clear token and redirect to login if attempting dashboard access
    if (isDashboard) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply to all dashboard routes, login page, and register page
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
