"use client";

import { useState } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { resendVerificationApi } from "@/lib/api/auth";
import { useAuth } from "@/providers/auth-provider";
import { maskEmailForDisplay } from "@/lib/email-mask";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Button } from "@/components/ui/Button";
import { getAuthDictionary } from "@/lib/i18n/auth-dictionary";
import { useLocale } from "@/lib/i18n/locale-provider";

export default function AguardandoVerificacaoPage() {
  const { user, logout } = useAuth();
  const { locale, localizedHref } = useLocale();
  const t = getAuthDictionary(locale);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleResend() {
    if (!user?.email) return;
    setIsSending(true);
    setFeedback(null);

    try {
      await resendVerificationApi(user.email);
      setFeedback({
        type: "success",
        message: t.awaitingVerification.resent,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setFeedback({
          type: "error",
          message: t.forgotPassword.errors.tryLater,
        });
      } else {
        setFeedback({
          type: "success",
          message: t.awaitingVerification.resent,
        });
      }
    } finally {
      setIsSending(false);
    }
  }

  return (
    <AuthLayout
      title={t.awaitingVerification.title}
      subtitle={t.awaitingVerification.body}
    >
      <div className="flex flex-col gap-4">
        {user?.email && (
          <p className="text-center text-sm text-foreground/50">
            {maskEmailForDisplay(user.email)}
          </p>
        )}

        {feedback && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
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
          isLoading={isSending}
          onClick={handleResend}
          disabled={!user?.email}
        >
          {t.awaitingVerification.resend}
        </Button>

        <div className="flex flex-col items-center gap-2 text-sm">
          <Link
            href={localizedHref("/login")}
            className="text-anima-violet hover:underline font-medium"
          >
            {t.awaitingVerification.goLogin}
          </Link>
          <button
            type="button"
            onClick={logout}
            className="text-foreground/40 hover:text-foreground/60 text-xs"
          >
            {t.awaitingVerification.logout}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
