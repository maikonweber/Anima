import { formatLimit } from "@/lib/subscription/utils";
import type { PlanLimits, PlanSlug } from "@/types/subscription";

const PLAN_TAGLINES: Record<PlanSlug, string> = {
  essencial: "Para começar sua jornada emocional.",
  pleno: "Para quem deseja acompanhamento contínuo e insights avançados.",
  cuidado:
    "Para profissionais que acompanham pacientes com mais contexto.",
  preview: "Modo demonstração — limites ampliados durante o período experimental",
};

export function getPlanTagline(slug: PlanSlug): string {
  return PLAN_TAGLINES[slug];
}

/** Destaques derivados dos `limits` retornados pela API (plans / me). */
export function buildPlanHighlights(limits: PlanLimits): string[] {
  const items: string[] = [];

  if (limits.diaryEntriesPerMonth === null) {
    items.push("Registros emocionais ilimitados");
  } else {
    items.push(
      `${formatLimit(limits.diaryEntriesPerMonth)} registros por mês`,
    );
  }

  if (limits.aiAnalysesPerMonth === null) {
    items.push("Insights SENTIO AI ilimitados");
  } else {
    items.push(
      `${formatLimit(limits.aiAnalysesPerMonth)} rodadas de insights SENTIO AI por mês`,
    );
  }

  if (limits.assistantMessagesPerMonth === null) {
    items.push("Assistente conversacional ilimitado");
  } else if (limits.assistantMessagesPerMonth != null) {
    items.push(
      `${formatLimit(limits.assistantMessagesPerMonth)} mensagens do assistente por mês`,
    );
  }

  if (limits.historyDays === null) {
    items.push("Linha do tempo completa");
  } else {
    items.push(`${limits.historyDays} dias visíveis na linha do tempo`);
  }

  if (limits.careInvitesActive === 1) {
    items.push("1 compartilhamento ativo com profissional");
  } else if (
    limits.careInvitesActive != null &&
    limits.careInvitesActive > 1
  ) {
    items.push(
      `Até ${limits.careInvitesActive} compartilhamentos ativos com profissionais`,
    );
  }

  if (limits.accessiblePatients != null) {
    items.push(
      `Até ${limits.accessiblePatients} dashboards de pacientes autorizados`,
    );
  }

  if (limits.canShareDashboard && !items.some((i) => i.toLowerCase().includes("compartilh"))) {
    items.push("Convidar profissionais para dashboard em leitura");
  }

  if (limits.canViewSharedDashboard) {
    items.push("Visualizar dashboards compartilhados por pacientes");
  }

  return items;
}

export function hasLimitedHistory(limits: PlanLimits | undefined): boolean {
  return limits?.historyDays != null && limits.historyDays > 0;
}
