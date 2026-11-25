"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import type { Locale } from "@/lib/i18n/config";
import {
  DEFAULT_LOCALE,
  localizedPath,
  pathWithoutLocale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  clinicAppEntryHref,
  resolvePostAuthDestination,
} from "@/lib/subscription/acquisition";
import { useAuth } from "@/providers/auth-provider";

const LINK_KEYS = [
  { path: "/about", key: "about" },
  { path: "/plans", key: "plans" },
  { path: "/psychologists", key: "psychologists" },
  { path: "/clinicas", key: "clinics" },
  { path: "/faq", key: "faq" },
  { path: "/blog", key: "blog" },
  { path: "/contact", key: "contact" },
] as const;

type MarketingHeaderProps = {
  locale?: Locale;
  /** Home page: Planos scrolls to #planos; also shows Produtos. */
  homeAnchors?: boolean;
  /** Optional CTA label (home uses its own "Começar grátis"). */
  ctaLabel?: string;
};

export function MarketingHeader({
  locale = DEFAULT_LOCALE,
  homeAnchors = false,
  ctaLabel,
}: MarketingHeaderProps) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [openForPath, setOpenForPath] = useState(pathname);
  if (openForPath !== pathname) {
    setOpenForPath(pathname);
    if (open) setOpen(false);
  }
  const barePath = pathWithoutLocale(pathname);
  const nav = getDictionary(locale).nav;
  const { user, isLoading } = useAuth();
  const signedIn = Boolean(user) && !isLoading;

  const homeHref = localizedPath(locale, "/");
  const loginHref = localizedPath(locale, "/login");
  const registerHref = localizedPath(locale, "/register");
  const clinicAppHref = clinicAppEntryHref(locale);
  const appHref = signedIn
    ? resolvePostAuthDestination(
        user!.emailVerified,
        null,
        locale,
        user!.subscription?.plan.slug,
      )
    : localizedPath(locale, "/dashboard");

  const links = LINK_KEYS.map(({ path, key }) => ({
    href:
      homeAnchors && key === "plans"
        ? "#planos"
        : localizedPath(locale, path),
    label: nav[key],
    accent:
      key === "clinics"
        ? "clinic"
        : key === "psychologists"
          ? "care"
          : "default",
  }));

  if (homeAnchors) {
    links.unshift({
      href: "#produtos",
      label:
        locale === "en" ? "Products" : locale === "es" ? "Productos" : "Produtos",
      accent: "default",
    });
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkClass = (accent: string, active = false) => {
    const base = "whitespace-nowrap transition-colors";
    if (accent === "clinic") {
      return `${base} ${active ? "text-[var(--home-clinic)]" : "text-[var(--home-muted)] hover:text-[var(--home-clinic)]"}`;
    }
    if (accent === "care") {
      return `${base} ${active ? "text-[var(--home-care)]" : "text-[var(--home-muted)] hover:text-[var(--home-care)]"}`;
    }
    return `${base} ${active ? "text-[var(--home-ink)]" : "text-[var(--home-muted)] hover:text-[var(--home-accent)]"}`;
  };

  const isActive = (href: string) => {
    if (href.startsWith("#")) return false;
    const bare = pathWithoutLocale(href);
    return barePath === bare || (bare !== "/" && barePath.startsWith(`${bare}/`));
  };

  const themeSwitch = (
    <ThemeToggle
      toDarkLabel={nav.themeToDark}
      toLightLabel={nav.themeToLight}
    />
  );

  const langSwitch = (
    <LanguageSwitcher locale={locale} barePath={barePath} variant="compact" />
  );

  const ctaText = ctaLabel ?? nav.startFree;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--home-line)] bg-[var(--home-panel)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <AnimaLogo
          href={homeHref}
          size="nav"
          showWordmark
          className="min-w-0"
          wordmarkClassName="text-[var(--home-ink)] max-[380px]:hidden"
        />

        <nav
          className="hidden min-w-0 items-center gap-x-4 overflow-hidden text-sm font-medium xl:flex xl:gap-x-5"
          aria-label={nav.ariaLabel}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              className={linkClass(link.accent, isActive(link.href))}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5">
            {themeSwitch}
            {langSwitch}
          </span>

          {signedIn ? (
            <Link
              href={appHref}
              className="inline-flex h-9 items-center whitespace-nowrap rounded-lg bg-[var(--home-accent)] px-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--home-accent-hover)]"
            >
              {nav.goToApp}
            </Link>
          ) : (
            <>
              <Link
                href={loginHref}
                className="hidden h-9 items-center whitespace-nowrap px-2 text-sm font-medium text-[var(--home-muted)] transition-colors hover:text-[var(--home-ink)] sm:inline-flex"
              >
                {nav.login}
              </Link>
              <Link
                href={registerHref}
                className="inline-flex h-9 items-center whitespace-nowrap rounded-lg bg-[var(--home-accent)] px-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--home-accent-hover)]"
              >
                {ctaText}
              </Link>
            </>
          )}

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--home-muted)] transition-colors hover:bg-[var(--home-surface)] hover:text-[var(--home-ink)] xl:hidden"
            aria-expanded={open}
            aria-controls="marketing-mobile-menu"
            aria-label={open ? nav.menuClose : nav.menuOpen}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div className="xl:hidden" id="marketing-mobile-menu">
          <button
            type="button"
            aria-label={nav.menuClose}
            className="fixed inset-0 top-16 z-40 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
          />
          <nav
            className="absolute inset-x-0 top-16 z-50 border-b border-[var(--home-line)] bg-[var(--home-panel)] px-4 py-3 shadow-lg sm:px-8"
            aria-label={nav.ariaLabel}
          >
            <div className="mx-auto flex max-w-6xl flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-medium ${linkClass(link.accent, isActive(link.href))}`}
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
              {!signedIn ? (
                <Link
                  href={loginHref}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-[var(--home-accent)] sm:hidden"
                >
                  {nav.login}
                </Link>
              ) : null}
              <div className="mt-1 flex items-center gap-3 border-t border-[var(--home-line)] px-3 py-3 sm:hidden">
                {themeSwitch}
                {langSwitch}
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
