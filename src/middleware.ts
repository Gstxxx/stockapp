import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/auth/jwt";

const cookieName = process.env.NEXT_PUBLIC_JWT_SECRET;
// Rotas que não precisam de autenticação
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/test",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/check",
  "/api/auth/logout",
];

export async function middleware(request: NextRequest) {
  // Verificar se a rota é pública
  const isPublicRoute = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith("/api/auth/")
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!cookieName) {
    console.error(
      "Variável de ambiente NEXT_PUBLIC_JWT_SECRET não está definida."
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Verificar o token de autenticação
  const token = request.cookies.get(cookieName)?.value;

  if (
    !token &&
    request.nextUrl.pathname !== "/login" &&
    request.nextUrl.pathname !== "/register"
  ) {
    console.log("Token não encontrado. Redirecionando para login.");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token) {
    return NextResponse.next();
  }

  try {
    const payload = await verifyJWT(token);

    if (!payload) {
      console.log("Token inválido. Redirecionando para login.");
      const response = NextResponse.redirect(new URL("/login", request.url));

      response.cookies.delete(cookieName);

      return response;
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
