"use client";

import { useEffect, type ReactNode } from "react";
import { DM_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAuth } from "@/providers/auth-provider";
import { useLocale } from "@/lib/i18n/locale-provider";
import { getProductDictionary } from "@/lib/i18n/product-dictionary";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-patient",
});

export function AssistenteRouteLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { locale, localizedHref } = useLocale();
  const t = getProductDictionary(locale);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(localizedHref("/login"));
    }
  }, [user, isLoading, router, localizedHref]);

  if (isLoading) {
    return (
      <div
        className={`patient-shell flex min-h-full items-center justify-center ${dmSans.variable} font-[family-name:var(--font-patient)]`}
        style={{ colorScheme: "light" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-anima-violet/30 border-t-anima-violet" />
          <p className="text-sm text-foreground/40">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className={`patient-shell flex h-[100dvh] min-h-0 w-full max-w-[100vw] overflow-x-hidden ${dmSans.variable} font-[family-name:var(--font-patient)]`}
      style={{ colorScheme: "light" }}
    >
      <Sidebar />
      <main
        id="main-content"
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-hidden pb-[max(4.75rem,calc(env(safe-area-inset-bottom)+5rem))] lg:overflow-y-auto lg:pb-0 patient-main"
      >
        {children}
      </main>
    </div>
  );
}
