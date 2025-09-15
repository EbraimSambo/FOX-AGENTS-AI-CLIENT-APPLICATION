import { NextRequest, NextResponse } from "next/server";
import { generateUUID } from "./helpers/generate-uuid";

export async function middleware(request: NextRequest) {
  const uuid = generateUUID();
  const { pathname } = request.nextUrl;

  const systemPaths = [
    "/api",
    "/_next",
    "/favicon.ico",
    "/logo.png",
    "/robots.txt",
  ];
  if (systemPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const isChatRoute = /^\/chats\/[a-zA-Z0-9-]+$/.test(pathname);

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/chats/${uuid}`, request.url));
  }

  if (!isChatRoute) {
    return NextResponse.redirect(new URL(`/chats/${uuid}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
