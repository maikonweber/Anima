"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { EmailInput } from "@/components/ui/EmailInput";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import {
  authPathPreservingRedirect,
  resolvePostAuthDestination,
} from "@/lib/subscription/acquisition";
import { type Locale } from "@/lib/i18n/config";
import {
  getAuthDictionary,
  type AuthPageDictionary,
} from "@/lib/i18n/auth-dictionary";

function RegisterForm({
  locale,
  t,
}: {
  locale: Locale;
  t: AuthPageDictionary;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { register, user, isLoading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    router.replace(
      resolvePostAuthDestination(
        user.emailVerified,
        redirectTo,
        locale,
        user.subscription?.plan.slug,
      ),
    );
  }, [authLoading, user, redirectTo, router, locale]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(t.register.errors.required);
      return;
    }

    if (password.length < 6) {
      setError(t.register.errors.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.register.errors.passwordMismatch);
      return;
    }

    setIsLoading(true);

    try {
      const created = await register(name, email, password);
      router.push(
        resolvePostAuthDestination(
          created.emailVerified,
          redirectTo,
          locale,
          created.subscription?.plan.slug,
        ),
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : t.register.errors.createFailed,
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Input
        label={t.register.nameLabel}
        type="text"
        placeholder={t.register.namePlaceholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        required
      />

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
        placeholder={t.register.passwordPlaceholder}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      <Input
        label={t.register.confirmPasswordLabel}
        type="password"
        placeholder={t.register.confirmPasswordPlaceholder}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      <Button type="submit" isLoading={isLoading} className="mt-2">
        {t.register.submit}
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
        text="signup_with"
        redirectTo={redirectTo}
        onError={(msg) => setError(msg || null)}
      />

      <p className="text-center text-xs text-foreground/40 mt-2">
        {t.register.hasAccount}{" "}
        <Link
          href={authPathPreservingRedirect("/login", redirectTo, locale)}
          className="text-anima-violet hover:text-anima-lilac transition-colors font-medium"
        >
          {t.register.signIn}
        </Link>
      </p>
    </form>
  );
}

export function RegisterPageClient({ locale }: { locale: Locale }) {
  const t = getAuthDictionary(locale);

  return (
    <AuthLayout title={t.register.title} subtitle={t.register.subtitle}>
      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-foreground/40">
            {t.common.loading}
          </div>
        }
      >
        <RegisterForm locale={locale} t={t} />
      </Suspense>
    </AuthLayout>
  );
}
