"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { formatResetsAt } from "@/lib/subscription/utils";
import type { PlanLimitError } from "@/types/subscription";

interface PaywallModalProps {
  error: PlanLimitError | null;
  onClose: () => void;
  previewMode?: boolean;
}

export function PaywallModal({
  error,
  onClose,
  previewMode = false,
}: PaywallModalProps) {
  const router = useRouter();

  if (!error || previewMode) return null;

  const resetsLabel = formatResetsAt(error.resetsAt);
  const cta = getPaywallCta(error.code);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar"
      />
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4">
        <h2
          id="paywall-title"
          className="text-lg font-bold text-foreground/90 mb-2"
        >
          Limite do plano atingido
        </h2>
        <p className="text-sm text-foreground/50 mb-1">
          {error.code === "PLAN_LIMIT_OWNER_SHARE"
            ? "Quem compartilha o diário precisa do plano Pleno para liberar o dashboard com você."
            : error.code === "PLAN_LIMIT_ACCESSIBLE_PATIENTS"
              ? "Você atingiu o limite de 25 acompanhamentos no plano Cuidado. Entre em contato para ampliar sua capacidade."
              : error.message}
        </p>
        {resetsLabel && (
          <p className="text-xs text-foreground/35 mb-4">
            Renova em {resetsLabel}
          </p>
        )}
        {error.used != null && error.limit != null && (
          <p className="text-xs text-foreground/40 mb-4">
            Uso: {error.used}
            {error.limit != null ? ` / ${error.limit}` : ""}
          </p>
        )}

        <div className="flex flex-col gap-2 mt-6">
          {cta.primary && (
            <Button
              onClick={() => {
                if (cta.primaryHref) {
                  router.push(cta.primaryHref);
                  onClose();
                } else {
                  onClose();
                }
              }}
            >
              {cta.primary}
            </Button>
          )}
          {cta.secondary && (
            <Button variant="secondary" onClick={onClose}>
              {cta.secondary}
            </Button>
          )}
          {cta.showPlansLink && (
            <Link
              href="/assinatura"
              onClick={onClose}
              className="text-center text-sm text-anima-violet hover:text-anima-lilac transition-colors py-2"
            >
              Ver planos
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function getPaywallCta(code: string): {
  primary?: string;
  primaryHref?: string;
  secondary?: string;
  showPlansLink?: boolean;
} {
  switch (code) {
    case "PLAN_LIMIT_DIARY_ENTRIES":
    case "PLAN_LIMIT_AI_ANALYSES":
    case "PLAN_LIMIT_CARE_SHARE":
      return {
        primary: "Assinar Pleno",
        primaryHref: "/assinatura?plan=pleno",
        secondary: "Fechar",
        showPlansLink: true,
      };
    case "PLAN_LIMIT_CARE_VIEW":
      return {
        primary: "Assinar Cuidado",
        primaryHref: "/assinatura?plan=cuidado",
        secondary: "Fechar",
        showPlansLink: true,
      };
    case "PLAN_LIMIT_CARE_INVITES":
      return {
        primary: "Gerenciar convites",
        primaryHref: "/dashboard/care",
        secondary: "Fechar",
        showPlansLink: true,
      };
    case "PLAN_LIMIT_ACCESSIBLE_PATIENTS":
      return {
        primary: "Entendi",
        secondary: undefined,
        showPlansLink: true,
      };
    case "PLAN_LIMIT_OWNER_SHARE":
      return {
        primary: "Entendi",
        secondary: undefined,
        showPlansLink: false,
      };
    default:
      return {
        primary: "Ver planos",
        primaryHref: "/assinatura",
        secondary: "Fechar",
        showPlansLink: true,
      };
  }
}
