import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/auth";
import { cookies } from "next/headers";

// POST /api/auth/login - Autenticar usuário
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validação básica
    if (!username || !password) {
      return NextResponse.json(
        { error: "Nome de usuário e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // Verificar se o usuário existe e a senha está correta
    // Em produção, use bcrypt para comparar senhas hash
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Gerar token JWT
    const token = signJwt({
      id: user.id,
      username: user.username,
    });

    // Definir cookie de autenticação
    cookies().set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    return NextResponse.json({
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao autenticar usuário" },
      { status: 500 }
    );
  }
}
