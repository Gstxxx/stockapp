import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/auth";

// POST /api/auth/register - Registrar novo usuário
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

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Nome de usuário já está em uso" },
        { status: 409 }
      );
    }

    // Em produção, use bcrypt para hash da senha
    const user = await prisma.user.create({
      data: {
        username,
        password, // Em produção: password: await bcrypt.hash(password, 10)
      },
    });

    // Gerar token JWT
    const token = signJwt({
      id: user.id,
      username: user.username,
    });

    // Definir cookie de autenticação
    const response = NextResponse.json(
      {
        id: user.id,
        username: user.username,
      },
      { status: 201 }
    );

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao registrar usuário" },
      { status: 500 }
    );
  }
}
