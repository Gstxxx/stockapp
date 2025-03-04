import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./lib/auth";

// Rotas que não precisam de autenticação
const publicRoutes = ["/", "/login", "/api/auth/login", "/api/auth/register"];

export function middleware(request: NextRequest) {
  // Verificar se a rota é pública
  const isPublicRoute = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith("/api/auth/")
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar o token de autenticação
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    // Redirecionar para a página de login se não houver token
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Verificar se o token é válido
  const payload = verifyJwt(token);

  if (!payload) {
    // Redirecionar para a página de login se o token for inválido
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
