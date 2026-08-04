"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import {
  DEFAULT_LOCALE,
  localizedPath,
  pathWithoutLocale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const LINK_KEYS = [
  { path: "/about", key: "about" },
  { path: "/plans", key: "plans" },
  { path: "/psychologists", key: "psychologists" },
  { path: "/clinicas", key: "clinics" },
  { path: "/faq", key: "faq" },
  { path: "/blog", key: "blog" },
  { path: "/contact", key: "contact" },
] as const;

/** Navegação institucional alinhada ao rebrand. */
export function MarketingNav({
  locale = DEFAULT_LOCALE,
}: {
  locale?: Locale;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const barePath = pathWithoutLocale(pathname);
  const nav = getDictionary(locale).nav;

  const links = LINK_KEYS.map(({ path, key }) => ({
    href: localizedPath(locale, path),
    label: nav[key],
    accent:
      key === "clinics"
        ? "clinic"
        : key === "psychologists"
          ? "care"
          : "default",
  }));

  const langSwitch = (
    <LanguageSwitcher locale={locale} barePath={barePath} variant="compact" />
  );

  const linkClass = (accent: string) => {
    if (accent === "clinic") {
      return "hover:text-[var(--home-clinic)] transition-colors";
    }
    if (accent === "care") {
      return "hover:text-[var(--home-care)] transition-colors";
    }
    return "hover:text-[var(--home-accent)] transition-colors";
  };

  const clinicAppHref = localizedPath(locale, "/clinic");

  return (
    <>
      <nav
        className="hidden md:flex flex-wrap justify-end gap-x-5 gap-y-2 text-sm font-medium text-[var(--home-muted)]"
        aria-label={nav.ariaLabel}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            className={linkClass(link.accent)}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
        <Link
          className="text-[var(--home-clinic)] hover:underline"
          href={clinicAppHref}
        >
          {nav.clinicApp}
        </Link>
        <Link
          className="font-semibold text-[var(--home-accent)] hover:underline"
          href={localizedPath(locale, "/login")}
        >
          {nav.login}
        </Link>
        {langSwitch}
      </nav>

      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-[var(--home-muted)] hover:bg-[var(--home-surface)] hover:text-[var(--home-ink)] transition-colors"
        aria-expanded={open}
        aria-controls="marketing-mobile-menu"
        aria-label={open ? nav.menuClose : nav.menuOpen}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        )}
      </button>

      {open ? (
        <nav
          id="marketing-mobile-menu"
          className="md:hidden w-full mt-1"
          aria-label={nav.ariaLabel}
        >
          <div className="rounded-2xl border border-[var(--home-line)] bg-[var(--home-panel)] flex flex-col divide-y divide-[var(--home-line)] p-2 shadow-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-3 text-sm font-medium text-[var(--home-muted)] hover:bg-[var(--home-surface)] ${linkClass(link.accent)}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={clinicAppHref}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-[var(--home-clinic)] hover:bg-[var(--home-clinic-soft)]"
            >
              {nav.clinicApp}
            </Link>
            <Link
              href={localizedPath(locale, "/login")}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold text-[var(--home-accent)] hover:bg-[var(--home-surface)]"
            >
              {nav.login}
            </Link>
            <div className="px-3 py-3">{langSwitch}</div>
          </div>
        </nav>
      ) : null}
    </>
  );
}
