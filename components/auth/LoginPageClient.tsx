"use client";

import { Suspense, useState, type FormEvent } from "react";
import { consumeSessionReuseWarning } from "@/lib/auth/storage";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import { loginSchema } from "@/lib/validations/auth";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { EmailInput } from "@/components/ui/EmailInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { authEn } from "@/lib/i18n/dictionaries/auth-en";
import { authPt, type AuthPageDictionary } from "@/lib/i18n/dictionaries/auth-pt";

function getAuthDictionary(locale: Locale): AuthPageDictionary {
  return locale === "en" ? authEn : authPt;
}

function LoginForm({
  locale,
  t,
}: {
  locale: Locale;
  t: AuthPageDictionary;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const verifiedSuccess = searchParams.get("verified") === "true";
  const redirectTo = searchParams.get("redirect");
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReuseWarning] = useState(() => consumeSessionReuseWarning());

  function destination(emailVerified: boolean) {
    if (!emailVerified) return "/aguardando-verificacao";
    return redirectTo?.startsWith("/") ? redirectTo : "/dashboard";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, senha: password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t.login.errors.validation);
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
          : t.login.errors.invalidCredentials,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {resetSuccess && (
        <div className="rounded-lg bg-anima-violet/10 border border-anima-violet/20 px-4 py-3 text-sm text-anima-violet">
          {t.login.resetSuccess}
        </div>
      )}

      {verifiedSuccess && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-500">
          {t.login.verifiedSuccess}
        </div>
      )}

      {sessionReuseWarning && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm text-amber-200">
          {t.login.sessionReuseWarning}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <EmailInput
        label={t.common.emailLabel}
        value={email}
        onChange={setEmail}
        autoComplete="email"
        required
      />

      <Input
        label={t.common.passwordLabel}
        type="password"
        placeholder={t.login.passwordPlaceholder}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      <div className="flex justify-end">
        <Link
          href={localizedPath(locale, "/forgot-password")}
          className="text-xs text-anima-violet hover:text-anima-lilac transition-colors"
        >
          {t.login.forgotPassword}
        </Link>
      </div>

      <Button type="submit" isLoading={isLoading} className="mt-2">
        {t.login.submit}
      </Button>

      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-foreground/[0.06]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-foreground/30">
            {t.common.or}
          </span>
        </div>
      </div>

      <GoogleAuthButton
        text="signin_with"
        redirectTo={redirectTo}
        onError={(msg) => setError(msg || null)}
      />

      <p className="text-center text-xs text-foreground/40 mt-2">
        {t.login.noAccount}{" "}
        <Link
          href={localizedPath(locale, "/register")}
          className="text-anima-violet hover:text-anima-lilac transition-colors font-medium"
        >
          {t.login.createAccount}
        </Link>
      </p>
    </form>
  );
}

export function LoginPageClient({ locale }: { locale: Locale }) {
  const t = getAuthDictionary(locale);

  return (
    <AuthLayout title={t.login.title} subtitle={t.login.subtitle}>
      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-foreground/40">
            {t.common.loading}
          </div>
        }
      >
        <LoginForm locale={locale} t={t} />
      </Suspense>
    </AuthLayout>
  );
}
