export const LOCALES = ["pt-BR", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pt-BR";

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

/** Prefix paths with `/en` for English; Portuguese stays unprefixed. */
export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "pt-BR") return normalized;
  if (normalized === "/") return "/en";
  return `/en${normalized}`;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "en" ? "pt-BR" : "en";
}

export function alternatePath(locale: Locale, path: string): string {
  return localizedPath(alternateLocale(locale), path);
}

export function isLocale(v: string): v is Locale {
  return (LOCALES as readonly string[]).includes(v);
}

export function htmlLang(locale: Locale): string {
  return locale === "en" ? "en" : "pt-BR";
}

export function ogLocale(locale: Locale): string {
  return locale === "en" ? "en_US" : "pt_BR";
}
