import { NextRequest, NextResponse } from "next/server";
import { generateUUID } from "./helpers/generate-uuid";

export async function middleware(request: NextRequest) {
  const uuid = generateUUID();
  const { pathname } = request.nextUrl;

  // Rotas e arquivos que não devem ser interceptados pelo middleware
  const ignoredPaths = [
    "/api",         // APIs
    "/_next",       // assets do Next.js
    "/favicon.ico", // favicon
    "/robots.txt",  // robots
    "/logo.png",    // logo
    "/images",      // todas as imagens locais
  ];

  // Se começar com qualquer uma das rotas ignoradas, deixa passar
  if (ignoredPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verifica se a rota corresponde a /chats/:id
  const isChatRoute = /^\/chats\/[a-zA-Z0-9-]+$/.test(pathname);

  // Redireciona home para um chat novo
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/chats/${uuid}?new=true`, request.url));
  }

  // Se não for rota de chat válida, cria uma nova
  if (!isChatRoute) {
    return NextResponse.redirect(new URL(`/chats/${uuid}?new=true`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"], // ignora assets estáticos (como .png, .jpg, .css, etc)
};
