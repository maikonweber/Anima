"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useReducedMotion } from "motion/react";
import { useTrends } from "@/hooks/use-insights";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TrendBadge } from "@/components/insights/TrendBadge";
import type { TrendPoint } from "@/types/insights";

type MetricKey = keyof Pick<
  TrendPoint,
  | "mediaEnergia"
  | "mediaAnsiedade"
  | "sono"
  | "estresse"
  | "socializacao"
  | "motivacao"
  | "burnout"
>;

const METRICS: { key: MetricKey; label: string; color: string }[] = [
  { key: "mediaEnergia", label: "Energia", color: "#7c5cbf" },
  { key: "mediaAnsiedade", label: "Ansiedade", color: "#f43f5e" },
  { key: "sono", label: "Sono", color: "#38bdf8" },
  { key: "estresse", label: "Estresse", color: "#fb923c" },
  { key: "socializacao", label: "Socialização", color: "#34d399" },
  { key: "motivacao", label: "Motivação", color: "#a78bfa" },
  { key: "burnout", label: "Burnout", color: "#ef4444" },
];

const PERIODS = [7, 30, 90] as const;

function formatDayTick(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function TrendsChart() {
  const reduce = useReducedMotion() ?? false;
  const [days, setDays] = useState<number>(30);
  const [active, setActive] = useState<Set<MetricKey>>(
    () => new Set<MetricKey>(["mediaEnergia", "mediaAnsiedade"]),
  );
  const { data, isLoading, error, refetch, isFetching } = useTrends(days);

  function toggleMetric(key: MetricKey) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const shownMetrics = METRICS.filter((m) => active.has(m.key));

  return (
    <section className="glass-panel p-5 sm:p-6" aria-label="Tendências">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground/85">
            Tendências
          </h2>
          {data && (
            <p className="mt-0.5 text-[11px] text-foreground/40">
              {formatRange(data.periodo.inicio, data.periodo.fim)} ·{" "}
              {data.totais.diasComRegistro} de {data.periodo.dias} dias com
              registro
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {data && <TrendBadge tendencia={data.totais.tendencia} />}
          <div
            className="flex rounded-lg border border-foreground/[0.08] p-0.5"
            role="group"
            aria-label="Período"
          >
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setDays(p)}
                aria-pressed={days === p}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  days === p
                    ? "bg-anima-violet/15 text-anima-violet"
                    : "text-foreground/45 hover:text-foreground/70"
                }`}
              >
                {p}d
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {METRICS.map((m) => {
          const on = active.has(m.key);
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => toggleMetric(m.key)}
              aria-pressed={on}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                on
                  ? "border-transparent text-white"
                  : "border-foreground/[0.1] text-foreground/45 hover:text-foreground/70"
              }`}
              style={on ? { backgroundColor: m.color } : undefined}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: on ? "rgba(255,255,255,0.85)" : m.color }}
                aria-hidden
              />
              {m.label}
            </button>
          );
        })}
      </div>

      {error ? (
        <ErrorMessage
          message="Não foi possível carregar as tendências."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="h-72 rounded-xl bg-foreground/[0.05] animate-pulse" />
      ) : !data || data.totais.registros === 0 ? (
        <EmptyState />
      ) : (
        <div
          className={`transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
        >
          <ResponsiveContainer width="100%" height={288}>
            <LineChart
              data={data.serie}
              margin={{ top: 8, right: 8, bottom: 4, left: -16 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-foreground/[0.08]"
                vertical={false}
              />
              <XAxis
                dataKey="data"
                tickFormatter={formatDayTick}
                tick={{ fontSize: 11 }}
                stroke="currentColor"
                className="text-foreground/40"
                minTickGap={24}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                stroke="currentColor"
                className="text-foreground/40"
                width={40}
              />
              <Tooltip
                content={<TrendsTooltip />}
                cursor={{ stroke: "var(--anima-violet)", strokeOpacity: 0.25 }}
              />
              {shownMetrics.map((m) => (
                <Line
                  key={m.key}
                  type="monotone"
                  dataKey={m.key}
                  name={m.label}
                  stroke={m.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  connectNulls={false}
                  isAnimationActive={!reduce}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

type TooltipEntry = {
  color?: string;
  name?: string;
  value?: number | null;
};

function TrendsTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-foreground/[0.1] bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <p className="mb-1 font-medium text-foreground/70">
        {label ? formatDayTick(label) : ""}
      </p>
      <ul className="space-y-0.5">
        {payload.map((entry, i) => (
          <li key={i} className="flex items-center gap-2 text-foreground/60">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden
            />
            <span className="flex-1">{entry.name}</span>
            <span className="font-semibold tabular-nums text-foreground/80">
              {entry.value == null ? "—" : Math.round(entry.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed border-foreground/[0.1] text-center">
      <p className="text-3xl" aria-hidden>
        📈
      </p>
      <p className="mt-2 text-sm text-foreground/50">
        Ainda não há registros neste período.
      </p>
      <p className="text-xs text-foreground/35">
        Registre alguns momentos para ver suas tendências.
      </p>
    </div>
  );
}

function formatRange(inicio: string, fim: string): string {
  const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };
  try {
    return `${new Date(inicio).toLocaleDateString("pt-BR", opts)} — ${new Date(
      fim,
    ).toLocaleDateString("pt-BR", opts)}`;
  } catch {
    return `${inicio} — ${fim}`;
  }
}
