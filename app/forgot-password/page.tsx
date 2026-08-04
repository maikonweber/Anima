"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ApiError } from "@/lib/api-client";
import { forgotPasswordApi } from "@/lib/api/auth";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getAuthDictionary } from "@/lib/i18n/auth-dictionary";
import { useLocale } from "@/lib/i18n/locale-provider";

export default function ForgotPasswordPage() {
  const { locale, localizedHref } = useLocale();
  const t = getAuthDictionary(locale);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    t.forgotPassword.defaultSuccess,
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? t.forgotPassword.errors.invalidEmail,
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await forgotPasswordApi(parsed.data.email);
      setSuccessMessage(res.message || t.forgotPassword.defaultSuccess);
      setIsSent(true);
    } catch (err) {
      if (err instanceof ApiError && err.status >= 500) {
        setError(t.forgotPassword.errors.tryLater);
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t.forgotPassword.errors.sendFailed);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title={t.forgotPassword.title}
      subtitle={t.forgotPassword.subtitle}
    >
      <AnimatePresence mode="wait">
        {isSent ? (
          <motion.div
            key="sent"
            className="flex flex-col items-center gap-4 py-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="w-16 h-16 rounded-full bg-anima-violet/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-anima-violet"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </motion.div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground/80 mb-2">
                {t.forgotPassword.checkEmailTitle}
              </h3>
              <p className="text-sm text-foreground/45 leading-relaxed max-w-xs">
                {successMessage}
              </p>
              <p className="text-xs text-foreground/35 mt-3">
                {t.forgotPassword.linkExpires}
              </p>
            </div>
            <Link
              href={localizedHref("/login")}
              className="mt-2 text-sm text-anima-violet hover:text-anima-lilac transition-colors font-medium"
            >
              {t.forgotPassword.backToLogin}
            </Link>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Input
              label={t.forgotPassword.emailLabel}
              type="email"
              placeholder={t.forgotPassword.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <Button type="submit" isLoading={isLoading} className="mt-2">
              {t.forgotPassword.submit}
            </Button>

            <p className="text-center text-xs text-foreground/40 mt-2">
              {t.forgotPassword.remembered}{" "}
              <Link
                href={localizedHref("/login")}
                className="text-anima-violet hover:text-anima-lilac transition-colors font-medium"
              >
                {t.forgotPassword.backToLogin}
              </Link>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
