"use client";

import Link from "next/link";
import {
  LOCALES,
  LOCALE_LABEL,
  localizedPath,
  type Locale,
} from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/locale-provider";

type Props = {
  /** Override current locale (e.g. marketing pages with explicit prop). */
  locale?: Locale;
  barePath?: string;
  className?: string;
  /** compact = PT · EN · ES links; pills = button row */
  variant?: "compact" | "pills";
};

export function LanguageSwitcher({
  locale: localeProp,
  barePath: barePathProp,
  className = "",
  variant = "compact",
}: Props) {
  const ctx = useLocale();
  const locale = localeProp ?? ctx.locale;
  const barePath = barePathProp ?? ctx.barePath;

  if (variant === "pills") {
    return (
      <div
        className={`inline-flex items-center gap-1 rounded-lg border border-foreground/10 bg-foreground/[0.03] p-0.5 ${className}`}
        role="group"
        aria-label="Language"
      >
        {LOCALES.map((code) => {
          const active = code === locale;
          return (
            <Link
              key={code}
              href={localizedPath(code, barePath)}
              hrefLang={code === "pt-BR" ? "pt-BR" : code}
              className={
                active
                  ? "rounded-md bg-anima-violet px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
                  : "rounded-md px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-foreground/50 hover:text-foreground/80"
              }
              aria-current={active ? "page" : undefined}
            >
              {LOCALE_LABEL[code]}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${className}`}
      aria-label="Language"
    >
      {LOCALES.map((code, i) => {
        const active = code === locale;
        return (
          <span key={code} className="inline-flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden className="text-foreground/20">
                ·
              </span>
            )}
            {active ? (
              <span className="uppercase tracking-[0.14em] text-foreground/80" aria-current="page">
                {LOCALE_LABEL[code]}
              </span>
            ) : (
              <Link
                href={localizedPath(code, barePath)}
                hrefLang={code === "pt-BR" ? "pt-BR" : code}
                className="uppercase tracking-[0.14em] text-anima-violet hover:underline"
              >
                {LOCALE_LABEL[code]}
              </Link>
            )}
          </span>
        );
      })}
    </span>
  );
}
