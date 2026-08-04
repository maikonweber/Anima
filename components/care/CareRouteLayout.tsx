"use client";

import { useEffect } from "react";
import { DM_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useLocale } from "@/lib/i18n/locale-provider";
import { getProductDictionary } from "@/lib/i18n/product-dictionary";
import { useSubscription } from "@/providers/subscription-provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-patient",
});

export function CareRouteLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { isCuidado } = useSubscription();
  const router = useRouter();
  const { locale, localizedHref } = useLocale();
  const t = getProductDictionary(locale);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(localizedHref("/login"));
    }
  }, [user, isLoading, router, localizedHref]);

  // Conta Cuidado não usa acompanhamentos B2C nem convites de vigiar.
  useEffect(() => {
    if (!isLoading && user && isCuidado) {
      router.replace(localizedHref("/clinic"));
    }
  }, [isLoading, user, isCuidado, router, localizedHref]);

  if (isLoading || (user && isCuidado)) {
    return (
      <div
        className={`patient-shell min-h-full flex items-center justify-center ${dmSans.variable} font-[family-name:var(--font-patient)]`}
        style={{ colorScheme: "light" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-anima-violet/30 border-t-anima-violet animate-spin" />
          <p className="text-sm text-foreground/40">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className={`patient-shell flex h-full min-h-screen ${dmSans.variable} font-[family-name:var(--font-patient)]`}
      style={{ colorScheme: "light" }}
    >
      <Sidebar />
      <main
        id="main-content"
        className="flex-1 overflow-y-auto pb-20 lg:pb-0 patient-main"
      >
        {children}
      </main>
    </div>
  );
}
