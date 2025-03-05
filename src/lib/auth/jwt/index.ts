import { jwtVerify } from "jose";

export async function verifyJWT(token: string) {
  try {
    if (!process.env.NEXT_PUBLIC_JWT_SECRET) {
      throw new Error("JWT secret is not defined");
    }

    // Converter a string JWT_SECRET em um Uint8Array
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

    // Verificar o token
    const { payload } = await jwtVerify(token, secret);
    const userId = Number(payload.sub);

    return {
      ...payload,
    };
  } catch (error) {
    console.error("Erro ao verificar JWT ou buscar usuário:", error);
    return null;
  }
}
