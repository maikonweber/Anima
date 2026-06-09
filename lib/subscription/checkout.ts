import { ApiError } from "@/lib/api-client";

export const CHECKOUT_NOT_READY_MESSAGE =
  "Pagamento em configuração, tente em instantes.";

export function isCheckoutEnvOverrideEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";
}

/** Resolve checkout a partir da API com override local opcional (dev). */
export function resolveCheckoutEnabled(apiCheckoutEnabled?: boolean): boolean {
  return apiCheckoutEnabled === true || isCheckoutEnvOverrideEnabled();
}

export function planAllowsCheckout(
  planSlug: string,
  planCheckoutEnabled?: boolean,
): boolean {
  if (planSlug === "essencial" || planSlug === "preview") return false;
  if (planCheckoutEnabled === false) return false;
  if (planCheckoutEnabled === true) return true;
  return planSlug === "pleno" || planSlug === "cuidado";
}

export function getCheckoutErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 400) return CHECKOUT_NOT_READY_MESSAGE;
    return err.message;
  }
  return "Não foi possível iniciar o checkout.";
}
