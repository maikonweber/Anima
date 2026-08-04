"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { verifyEmailApi } from "@/lib/api/auth";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Button } from "@/components/ui/Button";
import { getAuthDictionary } from "@/lib/i18n/auth-dictionary";
import { useLocale } from "@/lib/i18n/locale-provider";

type Status = "loading" | "success" | "error";

function VerifyEmailContent() {
  const router = useRouter();
  const { locale, localizedHref } = useLocale();
  const t = getAuthDictionary(locale);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "" : t.verifyEmail.failed,
  );

  useEffect(() => {
    if (!token) return;

    verifyEmailApi(token)
      .then(() => {
        setStatus("success");
        setMessage(t.verifyEmail.success);
        setTimeout(
          () => router.push(`${localizedHref("/login")}?verified=true`),
          2500,
        );
      })
      .catch((err: unknown) => {
        setStatus("error");
        setMessage(
          err instanceof ApiError ? err.message : t.verifyEmail.failed,
        );
      });
  }, [token, router, localizedHref, t.verifyEmail.failed, t.verifyEmail.success]);

  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      {status === "loading" && (
        <p className="text-sm text-foreground/50">{t.verifyEmail.verifying}</p>
      )}
      {status !== "loading" && (
        <p className="text-sm text-foreground/60 leading-relaxed">{message}</p>
      )}
      {status === "error" && (
        <Link href={localizedHref("/login")}>
          <Button type="button">{t.verifyEmail.goLogin}</Button>
        </Link>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  const { locale } = useLocale();
  const t = getAuthDictionary(locale);

  return (
    <AuthLayout title={t.verifyEmail.title}>
      <Suspense
        fallback={
          <div className="py-8 text-center text-sm text-foreground/40">
            {t.common.loading}
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </AuthLayout>
  );
}
