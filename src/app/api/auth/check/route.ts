import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth/jwt";

// GET /api/auth/check - Verificar se o usuário está autenticado
export async function GET(request: NextRequest) {
  try {
    const cookieName = process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!cookieName) {
      return NextResponse.json(
        { error: "JWT_SECRET não está definido" },
        { status: 500 }
      );
    }
    // Verificar o token de autenticação
    const token = request.cookies.get(cookieName)?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Verificar se o token é válido
    const payload = await verifyJWT(token);

    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    // Retornar os dados do usuário
    return NextResponse.json({
      id: payload.id,
      username: payload.username,
    });
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return NextResponse.json(
      { error: "Erro ao verificar autenticação" },
      { status: 500 }
    );
  }
}
