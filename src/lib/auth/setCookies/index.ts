import { GetServerSidePropsContext } from "next";
import { parseCookies, setCookie } from "nookies";

interface ISetCookies {
  token: string;
  serverSidePropsContext?: GetServerSidePropsContext;
}

// Opção 1: Definir um valor padrão caso a variável de ambiente não exista
const accessTokenKey =
  process.env.NEXT_PUBLIC_JWT_SECRET || "default_token_key";

// Opção 2: Verificar se a variável existe e lançar um erro se não existir
// const accessTokenKey = process.env.NEXT_PUBLIC_JWT_SECRET;
if (!accessTokenKey) {
  throw new Error(
    "NEXT_PUBLIC_JWT_SECRET não está definido nas variáveis de ambiente"
  );
}

export async function setCookies({
  token,
  serverSidePropsContext = undefined,
}: ISetCookies) {
  setCookie(serverSidePropsContext, accessTokenKey, token, {
    maxAge: 60 * 60 * 24 * 10,
    path: "/",
  });
}
export function getTokenFromCookies(ctx?: GetServerSidePropsContext) {
  const cookies = parseCookies(ctx);
  const userToken = cookies[accessTokenKey] ?? null;
  return userToken;
}
