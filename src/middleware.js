import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";
  const isPublicPath = path === "/login" || path === "/register";
  const profilePath = path === `/profile`;


  if (profilePath) {
    if (token) {
      return NextResponse.redirect(new URL(`/`, request.nextUrl));
    }
  }

  if (isPublicPath && token) {
    const userUrl = NextResponse.redirect(new URL("/", request.nextUrl));
    return userUrl;
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/login",
    "/register",
    "/profile/:path*",
    "/trashes",
    "/customers",
    "/transactions",
  ],
};
