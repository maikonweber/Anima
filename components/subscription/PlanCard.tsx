"use client";

import { Button } from "@/components/ui/Button";
import { formatLimit } from "@/lib/subscription/utils";
import type { Plan, PlanSlug } from "@/types/subscription";

const PLAN_COPY: Record<
  PlanSlug,
  { tagline: string; highlights: string[] }
> = {
  essencial: {
    tagline: "Grátis para começar",
    highlights: [
      "15 registros por mês",
      "5 análises com IA por mês",
      "Histórico dos últimos 30 dias",
    ],
  },
  pleno: {
    tagline: "Para quem registra o diário e quer compartilhar com 1 acompanhante",
    highlights: [
      "Diário ilimitado",
      "30 análises com IA por mês",
      "Histórico completo",
      "1 convite care ativo",
    ],
  },
  cuidado: {
    tagline: "Para psicólogos e profissionais que acompanham pacientes",
    highlights: [
      "Até 25 pacientes com dashboard",
      "30 análises com IA por mês (uso próprio)",
      "Visualização de dashboards compartilhados",
    ],
  },
};

interface PlanCardProps {
  plan: Plan;
  isCurrent?: boolean;
  onSubscribe?: (slug: Exclude<PlanSlug, "essencial">) => void;
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
  const copy = PLAN_COPY[plan.slug];
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
      <p className="text-sm text-foreground/45 mt-2 mb-4 flex-1">
        {plan.descricao ?? copy.tagline}
      </p>
      <ul className="space-y-2 mb-6">
        {copy.highlights.map((item) => (
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
              onSubscribe?.(plan.slug as Exclude<PlanSlug, "essencial">)
            }
            isLoading={isLoading}
            disabled={isCurrent}
            variant={isCurrent ? "secondary" : "primary"}
          >
            {isCurrent ? "Plano ativo" : "Assinar"}
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
    `Análises IA/mês: ${formatLimit(limits.aiAnalysesPerMonth)}`,
    limits.historyDays != null
      ? `Histórico: ${limits.historyDays} dias`
      : "Histórico: completo",
    limits.canShareDashboard ? "Compartilhar com acompanhante" : null,
    limits.canViewSharedDashboard ? "Ver dashboards de pacientes" : null,
  ].filter(Boolean) as string[];

  return (
    <ul className="text-[10px] text-foreground/35 space-y-1 border-t border-foreground/[0.06] pt-4">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
