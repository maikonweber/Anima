import { api } from "@/lib/api-client";
import type { AuthResponse, User } from "@/lib/types";

export async function googleLoginApi(idToken: string) {
  return api<AuthResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

export async function verifyEmailApi(token: string) {
  return api<{ message: string }>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function resendVerificationApi(email: string) {
  return api<{ message: string }>("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

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

export async function forgotPasswordApi(email: string) {
  return api<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordApi(token: string, senha: string) {
  return api<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, senha }),
  });
}
