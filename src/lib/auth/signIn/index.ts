import { z } from "zod";
import { setCookies } from "../setCookies";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Por favor, insira um nome de usuário válido.",
  }),
  password: z.string().min(4, {
    message: "A senha deve ter pelo menos 4 caracteres.",
  }),
});

export async function signIn(values: z.infer<typeof formSchema>) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("Error signing in");
  }

  const data = await response.json();

  await setCookies({ token: data.token });

  toast.success("Login realizado com sucesso.");

  return data;
}
