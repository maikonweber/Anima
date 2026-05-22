"use client";

import type { WeekSummary } from "@/lib/types";
import { getCategoryFromEnergy, getCategoryStyle } from "@/lib/energy";

const TREND_LABELS: Record<WeekSummary["tendenciaSemana"], string> = {
  ESTAVEL: "Estável",
  SUBINDO: "Subindo",
  DESCENDO: "Descendo",
};

interface WeekSummaryChartProps {
  summary: WeekSummary;
}

export function WeekSummaryChart({ summary }: WeekSummaryChartProps) {
  const category = getCategoryFromEnergy(summary.mediaEnergia);
  const energyStyle = getCategoryStyle(category);
  const maxEmotionCount = Math.max(
    ...summary.emocoesMaisFrequentes.map((e) => e.count),
    1,
  );

  const trackingItems = [
    { label: "Sono", value: summary.mediaSono },
    { label: "Estresse", value: summary.mediaEstresse },
    { label: "Socialização", value: summary.mediaSocializacao },
    { label: "Motivação", value: summary.mediaMotivacao },
    { label: "Burnout", value: summary.mediaBurnout },
  ] as const;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Média de energia"
          value={`${Math.round(summary.mediaEnergia)}`}
          suffix="/100"
          badge={energyStyle.label}
          badgeClass={energyStyle.bg}
        />
        <StatCard
          label="Registros"
          value={String(summary.quantidadeRegistros)}
        />
        <StatCard
          label="Tendência"
          value={TREND_LABELS[summary.tendenciaSemana]}
        />
        {summary.emocaoCompostaMaisFrequente && (
          <StatCard
            label="Emoção composta"
            value={summary.emocaoCompostaMaisFrequente.nome}
            suffix={`×${summary.emocaoCompostaMaisFrequente.count}`}
          />
        )}
      </div>

      {trackingItems.some((item) => item.value !== undefined) && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {trackingItems.map((item) =>
            item.value !== undefined ? (
              <StatCard
                key={item.label}
                label={`Média ${item.label.toLowerCase()}`}
                value={`${Math.round(item.value)}`}
                suffix="/100"
              />
            ) : null,
          )}
        </div>
      )}

      {summary.emocoesMaisFrequentes.length > 0 && (
        <div className="glass-panel p-5">
          <h3 className="text-sm font-semibold text-foreground/70 mb-4">
            Emoções mais frequentes
          </h3>
          <ul className="space-y-3">
            {summary.emocoesMaisFrequentes.map((item) => (
              <li key={item.nome}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground/60">{item.nome}</span>
                  <span className="text-foreground/40">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
                  <WeekSummaryBar
                    width={(item.count / maxEmotionCount) * 100}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.principaisNecessidades.length > 0 && (
        <div className="glass-panel p-5">
          <h3 className="text-sm font-semibold text-foreground/70 mb-3">
            Principais necessidades
          </h3>
          <div className="flex flex-wrap gap-2">
            {summary.principaisNecessidades.map((n) => (
              <span
                key={n.nome}
                className="px-3 py-1.5 rounded-full text-xs bg-foreground/[0.05] text-foreground/60 border border-foreground/[0.08]"
              >
                {n.nome} ({n.count})
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] text-foreground/30 text-center">
        Período: {formatDate(summary.periodo.inicio)} — {formatDate(summary.periodo.fim)}
      </p>
    </div>
  );
}

function WeekSummaryBar({ width }: { width: number }) {
  return (
    <div
      className="h-full rounded-full bg-gradient-to-r from-anima-violet to-anima-lilac transition-all duration-500"
      style={{ width: `${width}%` }}
    />
  );
}

function StatCard({
  label,
  value,
  suffix,
  badge,
  badgeClass,
}: {
  label: string;
  value: string;
  suffix?: string;
  badge?: string;
  badgeClass?: string;
}) {
  return (
    <div className="glass-panel p-4">
      <p className="text-[10px] uppercase tracking-wide text-foreground/35 mb-1">
        {label}
      </p>
      <p className="text-xl font-bold text-foreground/85">
        {value}
        {suffix && (
          <span className="text-sm font-normal text-foreground/30">{suffix}</span>
        )}
      </p>
      {badge && badgeClass && (
        <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${badgeClass}`}>
          {badge}
        </span>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return iso;
  }
}
