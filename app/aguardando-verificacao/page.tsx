"use client";

import { useState } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { resendVerificationApi } from "@/lib/api/auth";
import { useAuth } from "@/providers/auth-provider";
import { maskEmailForDisplay } from "@/lib/email-mask";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Button } from "@/components/ui/Button";

export default function AguardandoVerificacaoPage() {
  const { user, logout } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleResend() {
    if (!user?.email) return;
    setIsSending(true);
    setFeedback(null);

    try {
      await resendVerificationApi(user.email);
      setFeedback({
        type: "success",
        message: "Se o e-mail estiver cadastrado, um novo link foi enviado. Verifique sua caixa de entrada e a pasta de spam.",
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setFeedback({
          type: "error",
          message: "Muitas tentativas. Aguarde cerca de 1 hora antes de solicitar um novo link.",
        });
      } else {
        setFeedback({
          type: "success",
          message: "Se o e-mail estiver cadastrado, um novo link foi enviado. Verifique sua caixa de entrada e a pasta de spam.",
        });
      }
    } finally {
      setIsSending(false);
    }
  }

  return (
    <AuthLayout
      title="Confirme seu e-mail"
      subtitle="Quase lá! Verifique sua caixa de entrada"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-anima-violet/10 border border-anima-violet/20">
            <svg className="w-7 h-7 text-anima-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed">
            Enviamos um link de confirmação para
          </p>
          {user?.email && (
            <span className="text-sm font-medium text-foreground/90 bg-foreground/[0.04] border border-foreground/[0.08] rounded-lg px-3 py-1.5 font-mono tracking-wide">
              {maskEmailForDisplay(user.email)}
            </span>
          )}
          <p className="text-xs text-foreground/40 mt-1">
            Não encontrou? Verifique também a pasta de spam.
          </p>
        </div>

        {feedback && (
          <div
            className={`rounded-lg px-4 py-3 text-sm text-center ${
              feedback.type === "success"
                ? "bg-anima-violet/10 border border-anima-violet/20 text-anima-violet"
                : "bg-red-500/10 border border-red-400/20 text-red-400"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <Button
          type="button"
          variant="secondary"
          isLoading={isSending}
          onClick={handleResend}
          disabled={!user?.email}
        >
          Reenviar link de verificação
        </Button>

        <div className="flex flex-col items-center gap-2">
          <Link
            href="/login"
            onClick={logout}
            className="text-xs text-foreground/40 hover:text-foreground/60 transition-colors"
          >
            Entrar com outra conta
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
