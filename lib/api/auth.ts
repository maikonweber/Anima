import { api } from "@/lib/api-client";
import type { AuthResponse, User } from "@/lib/types";

export async function loginApi(email: string, senha: string) {
  return api<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

export async function registerApi(nome: string, email: string, senha: string) {
  return api<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ nome, email, senha }),
  });
}

export async function meApi(token: string) {
  return api<User>("/auth/me", { token });
}
