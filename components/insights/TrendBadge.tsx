import type { MonthlyTrendDirection } from "@/types/insights";

const TREND_CONFIG: Record<
  MonthlyTrendDirection,
  { label: string; arrow: string; className: string }
> = {
  SUBINDO: {
    label: "Subindo",
    arrow: "↗",
    className:
      "border-emerald-400/30 bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-300",
  },
  DESCENDO: {
    label: "Descendo",
    arrow: "↘",
    className:
      "border-rose-400/30 bg-rose-500/[0.08] text-rose-700 dark:text-rose-300",
  },
  ESTAVEL: {
    label: "Estável",
    arrow: "→",
    className:
      "border-foreground/[0.12] bg-foreground/[0.04] text-foreground/60",
  },
  SEM_DADOS: {
    label: "Sem dados",
    arrow: "·",
    className:
      "border-foreground/[0.1] bg-foreground/[0.03] text-foreground/40",
  },
};

export function TrendBadge({
  tendencia,
  className = "",
}: {
  tendencia: MonthlyTrendDirection;
  className?: string;
}) {
  const cfg = TREND_CONFIG[tendencia];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className} ${className}`}
    >
      <span aria-hidden>{cfg.arrow}</span>
      {cfg.label}
    </span>
  );
}
