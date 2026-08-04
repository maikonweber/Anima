"use client";

import Link from "next/link";
import { DM_Sans } from "next/font/google";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/lib/i18n/locale-provider";
import { getProductDictionary } from "@/lib/i18n/product-dictionary";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-patient",
});

export function AssinaturaShell({ children }: { children: React.ReactNode }) {
  const { locale, localizedHref } = useLocale();
  const t = getProductDictionary(locale);

  return (
    <div
      className={`patient-shell min-h-full flex flex-col ${dmSans.variable} font-[family-name:var(--font-patient)]`}
      style={{ colorScheme: "light" }}
    >
      <header className="border-b border-foreground/[0.06] px-4 sm:px-6 py-5 sm:py-6 min-h-[5rem]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <AnimaLogo
            href={localizedHref("/dashboard")}
            size="header"
            showWordmark
          />
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="pills" />
            <Link
              href={localizedHref("/dashboard/perfil")}
              className="text-sm text-foreground/50 hover:text-anima-violet transition-colors"
            >
              {t.nav.profile}
            </Link>
          </div>
        </div>
      </header>
      <main id="main-content" className="flex-1 patient-main">
        {children}
      </main>
    </div>
  );
}
