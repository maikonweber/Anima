import { pathWithoutLocale } from "@/lib/i18n/config";

export const ADSENSE_CLIENT = "ca-pub-1638014307034538";
export const ADSENSE_ACCOUNT_META = "ca-pub-1638014307034538";
export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
export const ADSENSE_PATHNAME_HEADER = "x-anima-pathname";

/**
 * In-app, clinical and sensitive flows must never load Auto Ads.
 * Marketing pages such as /, /plans, /blog and /clinicas are allowed.
 */
const ADSENSE_BLOCKED_PREFIXES = [
  "/dashboard",
  "/clinic",
  "/diary",
  "/assistente",
  "/care",
  "/suporte",
  "/assinatura",
  "/admin",
  "/teleconsulta",
  "/aguardando-verificacao",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/care-invite",
  "/patient-invite",
  "/org-invite",
] as const;

export function isAdSensePublicPath(pathname: string): boolean {
  const bare = pathWithoutLocale(pathname).replace(/\/+$/, "") || "/";
  return !ADSENSE_BLOCKED_PREFIXES.some(
    (prefix) => bare === prefix || bare.startsWith(`${prefix}/`),
  );
}
