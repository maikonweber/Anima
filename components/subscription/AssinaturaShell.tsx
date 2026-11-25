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
      <header className="sticky top-0 z-30 border-b border-foreground/[0.06] bg-background/90 backdrop-blur-md px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex h-16 items-center justify-between gap-3">
          <AnimaLogo
            href={localizedHref("/dashboard")}
            size="nav"
            showWordmark
            className="min-w-0"
            wordmarkClassName="max-[380px]:hidden"
          />
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LanguageSwitcher variant="pills" />
            <Link
              href={localizedHref("/dashboard/perfil")}
              className="text-sm whitespace-nowrap text-foreground/50 hover:text-anima-violet transition-colors"
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
