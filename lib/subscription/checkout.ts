import { ApiError } from "@/lib/api-client";
import type { PlanSlug } from "@/types/subscription";

export const CHECKOUT_NOT_READY_MESSAGE =
  "Pagamento em configuração, tente em instantes.";

export const PLAN_TRACK_INCOMPATIBLE_MESSAGE =
  "Pleno é o plano do paciente e Cuidado o do profissional — não dá para trocar direto. Gerencie a assinatura atual ou cancele antes de assinar o outro.";

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

/**
 * Plano pago efetivamente cobrado (ignora Pleno patrocinado).
 * Usado para bloquear troca entre trilha paciente (Pleno) e profissional (Cuidado).
 */
export function getBilledPaidPlanSlug(opts: {
  planSlug: PlanSlug;
  sponsoredByPsychologist?: boolean;
  hasPaidSubscription?: boolean;
}): "pleno" | "cuidado" | null {
  if (opts.sponsoredByPsychologist) return null;
  if (!opts.hasPaidSubscription) return null;
  if (opts.planSlug === "pleno" || opts.planSlug === "cuidado") {
    return opts.planSlug;
  }
  return null;
}

/** Pleno e Cuidado são produtos distintos; assinatura paga num bloqueia checkout no outro. */
export function canSubscribeToPlan(
  billedPaidSlug: "pleno" | "cuidado" | null,
  targetSlug: string,
): boolean {
  if (targetSlug !== "pleno" && targetSlug !== "cuidado") return false;
  if (!billedPaidSlug) return true;
  return billedPaidSlug === targetSlug;
}

export function getCheckoutErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const details =
      err.details && typeof err.details === "object"
        ? (err.details as { code?: string; message?: string })
        : undefined;
    if (details?.code === "PLAN_TRACK_INCOMPATIBLE") {
      return details.message ?? PLAN_TRACK_INCOMPATIBLE_MESSAGE;
    }
    if (details?.code === "PLAN_ALREADY_ACTIVE") {
      return details.message ?? "Você já está neste plano.";
    }
    if (err.status === 400) return CHECKOUT_NOT_READY_MESSAGE;
    return err.message;
  }
  return "Não foi possível iniciar o checkout.";
}
