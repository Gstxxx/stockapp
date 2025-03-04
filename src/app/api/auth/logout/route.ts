import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// POST /api/auth/logout - Fazer logout do usuário
export async function POST() {
  try {
    // Remover o cookie de autenticação
    const response = NextResponse.json({ success: true });
    response.cookies.delete("auth_token");

    return response;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json(
      { error: "Erro ao fazer logout" },
      { status: 500 }
    );
  }
}
