import { formatLimit } from "@/lib/subscription/utils";
import type { PlanLimits, PlanSlug } from "@/types/subscription";

const PLAN_TAGLINES: Record<PlanSlug, string> = {
  essencial:
    "Grátis para começar — registros limitados, IA e um compartilhamento conforme limites da conta",
  pleno: "Postagens e IA ilimitadas, com um vínculo de acompanhamento ativo",
  cuidado:
    "Para psicólogos: acompanhe pacientes com dashboard e diário profissional sem limites típicos",
  preview: "Modo demonstração — limites ampliados durante o período experimental",
};

export function getPlanTagline(slug: PlanSlug): string {
  return PLAN_TAGLINES[slug];
}

/** Destaques derivados dos `limits` retornados pela API (plans / me). */
export function buildPlanHighlights(limits: PlanLimits): string[] {
  const items: string[] = [];

  if (limits.diaryEntriesPerMonth === null) {
    items.push("Registros ilimitados no diário");
  } else {
    items.push(
      `${formatLimit(limits.diaryEntriesPerMonth)} registros por mês`,
    );
  }

  if (limits.aiAnalysesPerMonth === null) {
    items.push("Análises com IA ilimitadas");
  } else {
    items.push(
      `${formatLimit(limits.aiAnalysesPerMonth)} análises com IA por mês`,
    );
  }

  if (limits.historyDays === null) {
    items.push("Histórico completo");
  } else {
    items.push(`Histórico dos últimos ${limits.historyDays} dias`);
  }

  if (limits.careInvitesActive === 1) {
    items.push("1 compartilhamento com acompanhante ativo");
  } else if (
    limits.careInvitesActive != null &&
    limits.careInvitesActive > 1
  ) {
    items.push(
      `Até ${limits.careInvitesActive} compartilhamentos ativos`,
    );
  }

  if (limits.accessiblePatients != null) {
    items.push(
      `Até ${limits.accessiblePatients} pacientes com dashboard`,
    );
  }

  if (limits.canShareDashboard && !items.some((i) => i.includes("compartilh"))) {
    items.push("Compartilhar dashboard com acompanhante");
  }

  if (limits.canViewSharedDashboard) {
    items.push("Visualizar dashboards compartilhados pelos pacientes");
  }

  return items;
}

export function hasLimitedHistory(limits: PlanLimits | undefined): boolean {
  return limits?.historyDays != null && limits.historyDays > 0;
}
