"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { verifyEmailApi } from "@/lib/api/auth";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Button } from "@/components/ui/Button";

type Status = "loading" | "success" | "error";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "" : "Link de verificação inválido. Solicite um novo e-mail.",
  );

  useEffect(() => {
    if (!token) return;

    verifyEmailApi(token)
      .then(() => {
        setStatus("success");
        setMessage("E-mail confirmado com sucesso!");
        setTimeout(() => router.push("/login?verified=true"), 2500);
      })
      .catch((err: unknown) => {
        setStatus("error");
        setMessage(
          err instanceof ApiError
            ? err.message
            : "Link inválido ou expirado. Solicite um novo e-mail.",
        );
      });
  }, [token, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="flex items-center gap-3 text-foreground/60 text-sm">
          <svg className="animate-spin h-5 w-5 text-anima-violet" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Verificando seu e-mail...
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-green-500/10 border border-green-500/20">
          <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm text-foreground/70">{message}</p>
        <p className="text-xs text-foreground/40">Redirecionando para o login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400 text-center">
        {message}
      </div>
      <Link href="/aguardando-verificacao">
        <Button variant="secondary" type="button">
          Reenviar e-mail de verificação
        </Button>
      </Link>
      <p className="text-center text-xs text-foreground/40">
        <Link href="/login" className="text-anima-violet hover:text-anima-lilac transition-colors">
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Verificação de e-mail"
      subtitle="Confirmando seu endereço de e-mail"
    >
      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-foreground/40">
            Carregando...
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </AuthLayout>
  );
}
