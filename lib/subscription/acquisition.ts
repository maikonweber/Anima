import {
  localizedPath,
  pathWithoutLocale,
  type Locale,
} from "@/lib/i18n/config";

export const CHECKOUT_PLAN_SLUGS = ["pleno", "cuidado"] as const;
export type CheckoutPlanSlug = (typeof CHECKOUT_PLAN_SLUGS)[number];

export function isCheckoutPlanSlug(
  value: string | null | undefined,
): value is CheckoutPlanSlug {
  return value === "pleno" || value === "cuidado";
}

/** Destino pós-auth que dispara o Stripe Checkout. */
export function assinaturaCheckoutPath(plan: CheckoutPlanSlug): string {
  return `/assinatura?plan=${plan}&checkout=1`;
}

export function localizedAuthCheckoutHref(
  locale: Locale,
  authPath: "/login" | "/register",
  plan: CheckoutPlanSlug = "cuidado",
): string {
  const base = localizedPath(locale, authPath);
  return `${base}?redirect=${encodeURIComponent(assinaturaCheckoutPath(plan))}`;
}

export function isSafeInternalRedirect(
  value: string | null | undefined,
): value is string {
  return !!value && value.startsWith("/") && !value.startsWith("//");
}

/** Aquisição de plano: a API de subscription permite checkout sem e-mail verificado. */
export function isAssinaturaCheckoutRedirect(path: string): boolean {
  if (!path.startsWith("/assinatura")) return false;
  try {
    const url = new URL(path, "http://local");
    return (
      url.searchParams.get("checkout") === "1" &&
      isCheckoutPlanSlug(url.searchParams.get("plan"))
    );
  } catch {
    return false;
  }
}

function isClinicAppRedirect(path: string): boolean {
  const bare = pathWithoutLocale(path.split("?")[0] ?? path);
  return bare === "/clinic" || bare.startsWith("/clinic/");
}

/**
 * CRM Clínicas: só Cuidado (e preview). Free (essencial) e Pleno ficam no app pessoal.
 */
export function canAccessClinicApp(planSlug?: string | null): boolean {
  return planSlug === "cuidado" || planSlug === "preview";
}

/** Entrada pública para o CRM: login com retorno a /clinic após auth. */
export function clinicAppEntryHref(locale: Locale = "pt-BR"): string {
  const login = localizedPath(locale, "/login");
  return `${login}?redirect=${encodeURIComponent("/clinic")}`;
}

export function resolvePostAuthDestination(
  emailVerified: boolean,
  redirectTo: string | null | undefined,
  locale: Locale = "pt-BR",
  planSlug?: string | null,
): string {
  if (
    isSafeInternalRedirect(redirectTo) &&
    isAssinaturaCheckoutRedirect(pathWithoutLocale(redirectTo.split("?")[0]))
  ) {
    const [path, query] = redirectTo.split("?");
    const localized = localizedPath(locale, pathWithoutLocale(path));
    return query ? `${localized}?${query}` : localized;
  }
  if (!emailVerified) {
    return localizedPath(locale, "/aguardando-verificacao");
  }
  if (isSafeInternalRedirect(redirectTo)) {
    // Free/Pleno não entram no CRM — manda para upgrade Cuidado (RF-090).
    if (isClinicAppRedirect(redirectTo) && !canAccessClinicApp(planSlug)) {
      const upgrade = assinaturaCheckoutPath("cuidado");
      const [path, query] = upgrade.split("?");
      const localized = localizedPath(locale, path);
      return query ? `${localized}?${query}` : localized;
    }
    const [path, query] = redirectTo.split("?");
    const localized = localizedPath(locale, pathWithoutLocale(path));
    return query ? `${localized}?${query}` : localized;
  }
  // Conta Cuidado = app do profissional → Clínicas (não diário pessoal).
  if (canAccessClinicApp(planSlug)) {
    return localizedPath(locale, "/clinic");
  }
  return localizedPath(locale, "/dashboard");
}

/** Preserva `?redirect=` ao alternar entre login e register. */
export function authPathPreservingRedirect(
  authPath: "/login" | "/register",
  redirectTo: string | null | undefined,
  locale: Locale,
): string {
  const base = localizedPath(locale, authPath);
  if (!isSafeInternalRedirect(redirectTo)) return base;
  return `${base}?redirect=${encodeURIComponent(redirectTo)}`;
}
