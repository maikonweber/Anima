"use client";

import { Button } from "@/components/ui/Button";
import {
  buildPlanHighlights,
  getPlanTagline,
} from "@/lib/subscription/plan-highlights";
import { formatLimit } from "@/lib/subscription/utils";
import type { Plan, PlanSlug } from "@/types/subscription";

interface PlanCardProps {
  plan: Plan;
  isCurrent?: boolean;
  onSubscribe?: (slug: Exclude<PlanSlug, "essencial" | "preview">) => void;
  isLoading?: boolean;
  showUsage?: boolean;
}

export function PlanCard({
  plan,
  isCurrent,
  onSubscribe,
  isLoading,
  showUsage,
}: PlanCardProps) {
  if (plan.slug === "preview") return null;

  const highlights = buildPlanHighlights(plan.limits);
  const tagline = plan.descricao ?? getPlanTagline(plan.slug);
  const canCheckout = plan.slug !== "essencial" && plan.stripePriceId;

  return (
    <article
      className={`glass-panel p-6 flex flex-col h-full ${
        isCurrent ? "ring-2 ring-anima-violet/40" : ""
      }`}
    >
      {isCurrent && (
        <span className="self-start text-[10px] font-medium px-2 py-0.5 rounded-full bg-anima-violet/15 text-anima-violet mb-3">
          Plano atual
        </span>
      )}
      <h3 className="text-xl font-bold text-foreground/90">{plan.nome}</h3>
      <p className="text-sm text-foreground/45 mt-2 mb-4 flex-1">{tagline}</p>
      <ul className="space-y-2 mb-6">
        {highlights.map((item) => (
          <li
            key={item}
            className="text-xs text-foreground/55 flex items-start gap-2"
          >
            <span className="text-anima-violet mt-0.5">✓</span>
            {item}
          </li>
        ))}
      </ul>

      <PlanLimitsList limits={plan.limits} />

      {showUsage && isCurrent && (
        <p className="text-[10px] text-foreground/35 mt-4">
          Uso detalhado na seção abaixo
        </p>
      )}

      <div className="mt-6">
        {plan.slug === "essencial" ? (
          <p className="text-center text-sm font-medium text-foreground/50 py-3">
            {isCurrent ? "Seu plano gratuito" : "Incluído na conta"}
          </p>
        ) : canCheckout ? (
          <Button
            onClick={() =>
              onSubscribe?.(
                plan.slug as Exclude<PlanSlug, "essencial" | "preview">,
              )
            }
            isLoading={isLoading}
            disabled={isCurrent}
            variant={isCurrent ? "secondary" : "primary"}
          >
            {isCurrent ? "Plano ativo" : "Começar agora"}
          </Button>
        ) : (
          <p className="text-center text-xs text-foreground/40 py-3">
            Em breve
          </p>
        )}
      </div>
    </article>
  );
}

function PlanLimitsList({ limits }: { limits: Plan["limits"] }) {
  const items = [
    `Registros/mês: ${formatLimit(limits.diaryEntriesPerMonth)}`,
    `Insights SENTIO AI/mês: ${formatLimit(limits.aiAnalysesPerMonth)}`,
    limits.historyDays != null
      ? `Linha do tempo: últimos ${limits.historyDays} dias`
      : "Linha do tempo: retrospectiva completa",
    limits.careInvitesActive != null
      ? `Compartilhamentos ativos: ${formatLimit(limits.careInvitesActive)}`
      : null,
    limits.accessiblePatients != null
      ? `Acompanhamentos: ${formatLimit(limits.accessiblePatients)}`
      : null,
    limits.canShareDashboard ? "Pode convidar profissional" : null,
    limits.canViewSharedDashboard ? "Pode ver dashboards autorizados" : null,
  ].filter(Boolean) as string[];

  return (
    <ul className="text-[10px] text-foreground/35 space-y-1 border-t border-foreground/[0.06] pt-4">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
