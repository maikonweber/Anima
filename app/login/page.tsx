"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Email ou senha incorretos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre para continuar sua jornada emocional"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <Input
          label="Senha"
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <div className="flex justify-end">
          <Link
            href="/reset-password"
            className="text-xs text-anima-violet hover:text-anima-lilac transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-2">
          Entrar
        </Button>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-foreground/[0.06]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-foreground/30">ou</span>
          </div>
        </div>

        <Button type="button" variant="secondary" disabled>
          Continuar com Google
        </Button>

        <p className="text-center text-xs text-foreground/40 mt-4">
          Ainda não tem conta?{" "}
          <Link
            href="/login"
            className="text-anima-violet hover:text-anima-lilac transition-colors font-medium"
          >
            Criar conta
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
