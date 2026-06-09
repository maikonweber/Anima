"use client";

import { UsageMeter } from "@/components/subscription/UsageMeter";
import type { SubscriptionSummary } from "@/types/subscription";

interface SubscriptionUsagePanelProps {
  usage: SubscriptionSummary["usage"];
  className?: string;
}

export function SubscriptionUsagePanel({
  usage,
  className = "",
}: SubscriptionUsagePanelProps) {
  return (
    <div className={`glass-panel p-5 space-y-4 ${className}`}>
      <h3 className="text-sm font-semibold text-foreground/70">
        Uso em {formatPeriod(usage.period)}
      </h3>
      <UsageMeter
        label="Registros na linha do tempo"
        used={usage.diaryEntries.used}
        limit={usage.diaryEntries.limit}
      />
      <UsageMeter
        label="Insights SENTIO AI"
        used={usage.aiAnalyses.used}
        limit={usage.aiAnalyses.limit}
      />
      {usage.assistantMessages && (
        <UsageMeter
          label="Mensagens do assistente"
          used={usage.assistantMessages.used}
          limit={usage.assistantMessages.limit}
        />
      )}
      {usage.careInvitesActive.limit !== null && (
        <UsageMeter
          label="Compartilhamentos com profissionais"
          used={usage.careInvitesActive.used}
          limit={usage.careInvitesActive.limit}
        />
      )}
      {usage.accessiblePatients.limit !== null && (
        <UsageMeter
          label="Acompanhamentos com dashboard"
          used={usage.accessiblePatients.used}
          limit={usage.accessiblePatients.limit}
        />
      )}
    </div>
  );
}

function formatPeriod(period: string): string {
  const [year, month] = period.split("-");
  if (!year || !month) return period;
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}
