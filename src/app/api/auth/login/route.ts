import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      process.env.NEXT_PUBLIC_JWT_SECRET ?? "your-secret-key",
      { expiresIn: "1d" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao autenticar usuário" },
      { status: 500 }
    );
  }
}
