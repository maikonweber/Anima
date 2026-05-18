"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api-client";
import { resetPasswordApi } from "@/lib/api/auth";
import { resetPasswordFormSchema } from "@/lib/validations/auth";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="flex flex-col gap-4 text-center py-2">
        <p className="text-sm text-foreground/50 leading-relaxed">
          Este link de redefinição é inválido ou está incompleto.
        </p>
        <Link href="/forgot-password">
          <Button type="button" className="w-full">
            Solicitar novo link
          </Button>
        </Link>
        <Link
          href="/login"
          className="text-sm text-anima-violet hover:text-anima-lilac transition-colors font-medium"
        >
          Voltar ao login
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = resetPasswordFormSchema.safeParse({
      token,
      senha,
      confirmarSenha,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Verifique os campos.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPasswordApi(parsed.data.token, parsed.data.senha);
      router.push("/login?reset=success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError(
          err.message ||
            "Link inválido ou expirado. Solicite uma nova redefinição de senha.",
        );
      } else if (err instanceof ApiError && err.status >= 500) {
        setError("Tente novamente mais tarde.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível redefinir a senha. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400 space-y-3">
          <p>{error}</p>
          {error.toLowerCase().includes("expirado") ||
          error.toLowerCase().includes("inválido") ? (
            <Link
              href="/forgot-password"
              className="block text-xs font-medium text-anima-violet hover:text-anima-lilac"
            >
              Solicitar novo link →
            </Link>
          ) : null}
        </div>
      )}

      <Input
        label="Nova senha"
        type="password"
        placeholder="Mínimo 6 caracteres"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        autoComplete="new-password"
        required
      />

      <Input
        label="Confirmar senha"
        type="password"
        placeholder="Repita a nova senha"
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
        autoComplete="new-password"
        required
      />

      <Button type="submit" isLoading={isLoading} className="mt-2">
        Redefinir senha
      </Button>

      <p className="text-center text-xs text-foreground/40 mt-2">
        <Link
          href="/login"
          className="text-anima-violet hover:text-anima-lilac transition-colors font-medium"
        >
          Voltar ao login
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Nova senha"
      subtitle="Escolha uma senha segura para sua conta"
    >
      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-foreground/40">
            Carregando...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
