import Link from "next/link";
import type { ReactNode } from "react";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { marketingFontVariables } from "@/components/marketing/marketing-fonts";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE, localizedPath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

interface MarketingChromeProps {
  children: ReactNode;
  locale?: Locale;
}

/** Shell institucional — mesma identidade visual da home (rebrand). */
export function MarketingChrome({
  children,
  locale = DEFAULT_LOCALE,
}: MarketingChromeProps) {
  const footer = getDictionary(locale).footer;
  const nav = getDictionary(locale).nav;
  const homeHref = localizedPath(locale, "/");
  const clinicsHref = localizedPath(locale, "/clinicas");

  return (
    <div
      className={`home-shell marketing-shell ${marketingFontVariables} flex min-h-dvh flex-col`}
    >
      <header className="border-b border-[var(--home-line)] px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <span className="sm:hidden">
            <AnimaLogo href={homeHref} size="sm" showWordmark />
          </span>
          <span className="hidden sm:inline-flex">
            <AnimaLogo href={homeHref} size="header" showWordmark />
          </span>
          <MarketingNav locale={locale} />
        </div>
      </header>

      <main id="main-content" role="main" className="flex-1 px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>

      <footer
        className="border-t border-[var(--home-line)] px-4 py-10 text-center text-xs text-[var(--home-subtle)]"
        role="contentinfo"
      >
        <div className="mx-auto mb-6 flex max-w-2xl flex-wrap justify-center gap-x-5 gap-y-2 font-medium text-[var(--home-muted)]">
          <Link
            href={localizedPath(locale, "/plans")}
            className="hover:text-[var(--home-accent)]"
          >
            {nav.plans}
          </Link>
          <Link
            href={localizedPath(locale, "/psychologists")}
            className="hover:text-[var(--home-care)]"
          >
            {nav.psychologists}
          </Link>
          <Link href={clinicsHref} className="hover:text-[var(--home-clinic)]">
            {nav.clinics}
          </Link>
          <Link href="/clinic" className="hover:text-[var(--home-clinic)]">
            {nav.clinicApp}
          </Link>
          <Link
            href={localizedPath(locale, "/privacy")}
            className="hover:text-[var(--home-accent)]"
          >
            {footer.privacy}
          </Link>
          <Link
            href={localizedPath(locale, "/terms")}
            className="hover:text-[var(--home-accent)]"
          >
            {footer.terms}
          </Link>
          <Link
            href={localizedPath(locale, "/resources")}
            className="hover:text-[var(--home-accent)]"
          >
            {footer.resources}
          </Link>
        </div>
        <p className="max-w-xl mx-auto leading-relaxed">{footer.disclaimer}</p>
      </footer>
    </div>
  );
}
