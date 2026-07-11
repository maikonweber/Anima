import Link from "next/link";
import type { ReactNode } from "react";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE, localizedPath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

interface MarketingChromeProps {
  children: ReactNode;
  locale?: Locale;
}

/** Shell semântico reutilizado em páginas públicas institucionais. */
export function MarketingChrome({
  children,
  locale = DEFAULT_LOCALE,
}: MarketingChromeProps) {
  const footer = getDictionary(locale).footer;
  const homeHref = localizedPath(locale, "/");

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-foreground/[0.06] px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-4 gap-y-3">
          {/* Logo compacto no mobile, completo a partir de sm */}
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
        className="border-t border-foreground/[0.06] px-4 py-10 text-center text-xs text-foreground/40"
        role="contentinfo"
      >
        <div className="mx-auto mb-6 flex max-w-xl flex-wrap justify-center gap-4 font-medium">
          <Link
            href={localizedPath(locale, "/privacy")}
            className="hover:text-anima-violet"
          >
            {footer.privacy}
          </Link>
          <Link
            href={localizedPath(locale, "/terms")}
            className="hover:text-anima-violet"
          >
            {footer.terms}
          </Link>
          <Link
            href={localizedPath(locale, "/resources")}
            className="hover:text-anima-violet"
          >
            {footer.resources}
          </Link>
        </div>
        <p>{footer.disclaimer}</p>
      </footer>
    </div>
  );
}
