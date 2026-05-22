"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import { loginSchema } from "@/lib/validations/auth";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { EmailInput } from "@/components/ui/EmailInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const verifiedSuccess = searchParams.get("verified") === "true";
  const redirectTo = searchParams.get("redirect");
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function destination(emailVerified: boolean) {
    if (!emailVerified) return "/aguardando-verificacao";
    return redirectTo?.startsWith("/") ? redirectTo : "/dashboard";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, senha: password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Verifique os campos.");
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(parsed.data.email, parsed.data.senha);
      router.push(destination(user.emailVerified));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Email ou senha incorretos. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSuccess(idToken: string) {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const user = await googleLogin(idToken);
      router.push(destination(user.emailVerified));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível entrar com Google. Tente novamente.",
      );
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {resetSuccess && (
        <div className="rounded-lg bg-anima-violet/10 border border-anima-violet/20 px-4 py-3 text-sm text-anima-violet">
          Senha alterada. Faça login com sua nova senha.
        </div>
      )}

      {verifiedSuccess && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-500">
          E-mail confirmado! Faça login para continuar.
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

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
        placeholder="Sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs text-anima-violet hover:text-anima-lilac transition-colors"
        >
          Esqueceu a senha?
        </Link>
      </div>

      <Button type="submit" isLoading={isLoading} className="mt-2">
        Entrar
      </Button>

      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-foreground/[0.06]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-foreground/30">ou</span>
        </div>
      </div>

      <div
        className={`flex justify-center transition-opacity ${isGoogleLoading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const idToken = credentialResponse.credential;
            if (!idToken) return;
            handleGoogleSuccess(idToken);
          }}
          onError={() =>
            setError("Não foi possível entrar com Google. Tente novamente.")
          }
          text="signin_with"
          useOneTap={false}
        />
      </div>

      <p className="text-center text-xs text-foreground/40 mt-2">
        Ainda não tem conta?{" "}
        <Link
          href="/register"
          className="text-anima-violet hover:text-anima-lilac transition-colors font-medium"
        >
          Criar conta
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre para continuar sua jornada emocional"
    >
      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-foreground/40">
            Carregando...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
