export const LOCALES = ["pt-BR", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pt-BR";

export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_HEADER = "x-locale";

/** URL prefix for each locale (Portuguese stays unprefixed). */
export const LOCALE_PREFIX: Record<Locale, string> = {
  "pt-BR": "",
  en: "/en",
  es: "/es",
};

export const LOCALE_LABEL: Record<Locale, string> = {
  "pt-BR": "PT",
  en: "EN",
  es: "ES",
};

/** Marketing/auth paths without locale prefix */
export const PUBLIC_PATHS = [
  "/",
  "/about",
  "/plans",
  "/faq",
  "/psychologists",
  "/resources",
  "/contact",
  "/privacy",
  "/terms",
  "/blog",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
] as const;

/** Strip `/en` or `/es` prefix from a pathname. */
export function pathWithoutLocale(pathname: string): string {
  if (pathname === "/en" || pathname === "/es") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  if (pathname.startsWith("/es/")) return pathname.slice(3) || "/";
  return pathname || "/";
}

/** Detect locale from a URL pathname. */
export function localeFromPathname(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/es" || pathname.startsWith("/es/")) return "es";
  return DEFAULT_LOCALE;
}

/** Prefix paths with `/en` or `/es`; Portuguese stays unprefixed. */
export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const prefix = LOCALE_PREFIX[locale];
  if (!prefix) return normalized;
  if (normalized === "/") return prefix;
  return `${prefix}${normalized}`;
}

/** Next locale in the PT → EN → ES cycle (for simple two-way toggles). */
export function alternateLocale(locale: Locale): Locale {
  if (locale === "pt-BR") return "en";
  if (locale === "en") return "es";
  return "pt-BR";
}

export function alternatePath(locale: Locale, path: string): string {
  return localizedPath(alternateLocale(locale), path);
}

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

export function htmlLang(locale: Locale): string {
  if (locale === "en") return "en";
  if (locale === "es") return "es";
  return "pt-BR";
}

export function ogLocale(locale: Locale): string {
  if (locale === "en") return "en_US";
  if (locale === "es") return "es_ES";
  return "pt_BR";
}

export function dateLocale(locale: Locale): string {
  if (locale === "en") return "en-US";
  if (locale === "es") return "es";
  return "pt-BR";
}
