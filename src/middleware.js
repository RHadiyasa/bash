import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";
  const customerToken = request.cookies.get("customer-token")?.value || "";
  const isCustomerArea = path === "/customer" || path.startsWith("/customer/");
  const isCustomerLogin = path === "/login-customer";

  // --- Rute nasabah ---
  if (isCustomerLogin) {
    if (customerToken) {
      return NextResponse.redirect(new URL("/customer/dashboard", request.nextUrl));
    }
    return NextResponse.next();
  }

  if (isCustomerArea) {
    if (!customerToken) {
      return NextResponse.redirect(new URL("/login-customer", request.nextUrl));
    }
    return NextResponse.next();
  }

  // --- Rute bank sampah ---
  const isPublicPath = path === "/login" || path === "/register";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/login",
    "/login-customer",
    "/register",
    "/profile/:path*",
    "/trashes/:path*",
    "/customers/:path*",
    "/transactions/:path*",
    "/inventory/:path*",
    "/sales/:path*",
    "/reports/:path*",
    "/developer/:path*",
    "/customer/:path*",
  ],
};
