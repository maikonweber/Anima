"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { getStoredToken } from "@/lib/auth/storage";
import type { Locale } from "@/lib/i18n/config";
import { resolvePostAuthDestination } from "@/lib/subscription/acquisition";
import { useAuth } from "@/providers/auth-provider";

/**
 * If the visitor already has a session, skip the public landing page
 * and send them to the app (dashboard, clinics, or email verification).
 * Uses the existing client session only — does not change auth.
 */
export function LoggedInHomeRedirect({ locale }: { locale: Locale }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [hasToken] = useState(() =>
    typeof window === "undefined" ? false : Boolean(getStoredToken()),
  );

  useEffect(() => {
    if (isLoading || !user) return;
    router.replace(
      resolvePostAuthDestination(
        user.emailVerified,
        null,
        locale,
        user.subscription?.plan.slug,
      ),
    );
  }, [isLoading, user, locale, router]);

  const shouldCover = hasToken && (isLoading || Boolean(user));
  if (!shouldCover) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--home-panel,#f6f4f1)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <AnimaLogo size="md" showWordmark wordmarkClassName="text-[var(--home-ink,#1b1b1b)]" />
        <p className="text-sm text-[var(--home-muted,#5c5c5c)]">
          {locale === "en"
            ? "Opening your app…"
            : locale === "es"
              ? "Abriendo tu app…"
              : "Abrindo o app…"}
        </p>
      </div>
    </div>
  );
}
