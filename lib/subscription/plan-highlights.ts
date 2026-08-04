import { formatLimit } from "@/lib/subscription/utils";
import type { PlanLimits, PlanSlug } from "@/types/subscription";

const PLAN_TAGLINES: Record<PlanSlug, string> = {
  essencial: "Para começar a se entender — diário e SENTIO AI no seu ritmo.",
  pleno: "Segundo cérebro completo: memória, tracking, 500 interações do assistente/mês e 1 profissional — R$ 9,99.",
  /** Cuidado: base do profissional + R$ 5/mês por paciente Pleno patrocinado. */
  cuidado:
    "Para profissionais: dashboards por convite, Pleno patrocinado (+ R$ 5/mês por paciente) e 500 mensagens do assistente/mês.",
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

  if (limits.accessiblePatients != null && limits.accessiblePatients > 0) {
    items.push(
      `Até ${limits.accessiblePatients} dashboards Cuidado (leitura, por convite)`,
    );
  } else if (limits.canViewSharedDashboard && limits.accessiblePatients === null) {
    items.push(
      "Dashboards Cuidado ilimitados · Pleno patrocinado (+ R$ 5/mês por paciente)",
    );
  }

  if (limits.canShareDashboard && !items.some((i) => i.toLowerCase().includes("compartilh"))) {
    items.push("Convidar 1 profissional para dashboard em leitura (Pleno)");
  }

  if (limits.canViewSharedDashboard) {
    items.push("Visualizar dashboards de pacientes no plano Cuidado");
  }

  return items;
}

export function hasLimitedHistory(limits: PlanLimits | undefined): boolean {
  return limits?.historyDays != null && limits.historyDays > 0;
}
