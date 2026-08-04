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
import { getAuthDictionary } from "@/lib/i18n/auth-dictionary";
import { useLocale } from "@/lib/i18n/locale-provider";

function ResetPasswordForm() {
  const router = useRouter();
  const { locale, localizedHref } = useLocale();
  const t = getAuthDictionary(locale);
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
          {t.resetPassword.invalidToken}
        </p>
        <Link href={localizedHref("/forgot-password")}>
          <Button type="button" className="w-full">
            {t.forgotPassword.submit}
          </Button>
        </Link>
        <Link
          href={localizedHref("/login")}
          className="text-sm text-anima-violet hover:text-anima-lilac transition-colors font-medium"
        >
          {t.forgotPassword.backToLogin}
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
      setError(
        parsed.error.issues[0]?.message ?? t.resetPassword.errors.failed,
      );
      return;
    }

    setIsLoading(true);

    try {
      await resetPasswordApi(parsed.data.token, parsed.data.senha);
      router.push(`${localizedHref("/login")}?reset=success`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError(err.message || t.resetPassword.invalidToken);
      } else if (err instanceof ApiError && err.status >= 500) {
        setError(t.forgotPassword.errors.tryLater);
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t.resetPassword.errors.failed);
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
          <Link
            href={localizedHref("/forgot-password")}
            className="block text-xs font-medium text-anima-violet hover:text-anima-lilac"
          >
            {t.forgotPassword.submit} →
          </Link>
        </div>
      )}

      <Input
        label={t.resetPassword.passwordLabel}
        type="password"
        placeholder={t.resetPassword.passwordPlaceholder}
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        autoComplete="new-password"
        required
      />

      <Input
        label={t.resetPassword.confirmLabel}
        type="password"
        placeholder={t.resetPassword.confirmPlaceholder}
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
        autoComplete="new-password"
        required
      />

      <Button type="submit" isLoading={isLoading} className="mt-2">
        {t.resetPassword.submit}
      </Button>

      <p className="text-center text-xs text-foreground/40 mt-2">
        <Link
          href={localizedHref("/login")}
          className="text-anima-violet hover:text-anima-lilac transition-colors font-medium"
        >
          {t.forgotPassword.backToLogin}
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  const { locale } = useLocale();
  const t = getAuthDictionary(locale);

  return (
    <AuthLayout
      title={t.resetPassword.title}
      subtitle={t.resetPassword.subtitle}
    >
      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-foreground/40">
            {t.common.loading}
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
