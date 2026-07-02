"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { EmailInput } from "@/components/ui/EmailInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      const user = await register(name, email, password);
      router.push(user.emailVerified ? "/dashboard" : "/aguardando-verificacao");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar sua conta. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Criar sua conta"
      subtitle="Comece sua jornada no Anima, seu segundo cérebro emocional — simples e acolhedor"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <Input
          label="Nome"
          type="text"
          placeholder="Como podemos te chamar?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />

        <EmailInput
          label="Email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />

        <Input
          label="Senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirmar senha"
          type="password"
          placeholder="Repita sua senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <Button type="submit" isLoading={isLoading} className="mt-2">
          Criar conta
        </Button>

        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-foreground/[0.06]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-foreground/30">ou</span>
          </div>
        </div>

        <GoogleAuthButton text="signup_with" onError={(msg) => setError(msg || null)} />

        <p className="text-center text-xs text-foreground/40 mt-2">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="text-anima-violet hover:text-anima-lilac transition-colors font-medium"
          >
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
