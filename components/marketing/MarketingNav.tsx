"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import {
  DEFAULT_LOCALE,
  alternateLocale,
  alternatePath,
  localizedPath,
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

function pathWithoutLocale(pathname: string): string {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const rest = pathname.slice(3);
    return rest.length ? rest : "/";
  }
  return pathname || "/";
}

/** Navegação institucional: linha única no desktop, menu sanfona no mobile. */
export function MarketingNav({
  locale = DEFAULT_LOCALE,
}: {
  locale?: Locale;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const barePath = pathWithoutLocale(pathname);
  const nav = getDictionary(locale).nav;
  const common = getDictionary(locale).common;
  const other = alternateLocale(locale);
  const otherHref = alternatePath(locale, barePath);

  const links = LINK_KEYS.map(({ path, key }) => ({
    href: localizedPath(locale, path),
    label: nav[key],
  }));

  const langSwitch = (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className="uppercase tracking-[0.14em] text-foreground/40">
        {common.language}
      </span>
      <span className="text-foreground/75" aria-current="page">
        {locale === "en" ? "EN" : "PT"}
      </span>
      <span aria-hidden className="text-foreground/30">
        ·
      </span>
      <Link
        href={otherHref}
        hrefLang={other === "en" ? "en" : "pt-BR"}
        className="text-anima-violet hover:underline"
      >
        {other === "en" ? "EN" : "PT"}
      </Link>
    </span>
  );

  return (
    <>
      {/* Desktop */}
      <nav
        className="hidden md:flex flex-wrap justify-end gap-x-6 gap-y-2 text-sm font-medium text-foreground/55"
        aria-label={nav.ariaLabel}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            className="hover:text-anima-violet transition-colors"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
        <Link
          className="font-semibold text-anima-violet hover:text-anima-lilac transition-colors"
          href={localizedPath(locale, "/login")}
        >
          {nav.login}
        </Link>
        {langSwitch}
      </nav>

      {/* Botão hambúrguer (mobile) */}
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-foreground/60 hover:bg-foreground/[0.06] hover:text-foreground/90 transition-colors"
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

      {/* Painel do menu (mobile) */}
      {open ? (
        <nav
          id="marketing-mobile-menu"
          className="md:hidden w-full mt-1"
          aria-label={nav.ariaLabel}
        >
          <div className="glass-panel flex flex-col divide-y divide-foreground/[0.06] p-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-foreground/70 hover:bg-foreground/[0.04] hover:text-anima-violet transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={localizedPath(locale, "/login")}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold text-anima-violet hover:bg-anima-violet/5 transition-colors"
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
