"use client";

import { useMemo, useState } from "react";
import { useMonthlyReport } from "@/hooks/use-insights";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TrendBadge } from "@/components/insights/TrendBadge";
import type { CountItem } from "@/types/insights";

function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function addMonths(ym: string, delta: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, (m ?? 1) - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, (m ?? 1) - 1, 1);
  const label = d.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatDay(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return iso;
  }
}

export function MonthlyReport() {
  const nowYm = currentYearMonth();
  const [month, setMonth] = useState<string>(nowYm);
  const { data, isLoading, error, refetch, isFetching } =
    useMonthlyReport(month);

  const atCurrent = month >= nowYm;

  const delta = data?.comparacaoMesAnterior.deltaEnergia ?? null;
  const deltaTone = useMemo(() => {
    if (delta == null) return "text-foreground/40";
    if (delta > 0) return "text-emerald-600 dark:text-emerald-400";
    if (delta < 0) return "text-rose-600 dark:text-rose-400";
    return "text-foreground/50";
  }, [delta]);

  return (
    <section className="glass-panel p-5 sm:p-6" aria-label="Relatório mensal">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground/85">
          Relatório mensal
        </h2>
        <div className="flex items-center gap-1">
          <NavButton
            label="Mês anterior"
            onClick={() => setMonth((m) => addMonths(m, -1))}
          >
            ←
          </NavButton>
          <span className="min-w-[7.5rem] text-center text-xs font-medium text-foreground/60 tabular-nums">
            {formatMonthLabel(month)}
          </span>
          <NavButton
            label="Próximo mês"
            disabled={atCurrent}
            onClick={() => setMonth((m) => addMonths(m, 1))}
          >
            →
          </NavButton>
        </div>
      </div>

      {error ? (
        <ErrorMessage
          message="Não foi possível carregar o relatório mensal."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="h-56 rounded-xl bg-foreground/[0.05] animate-pulse" />
      ) : !data || data.quantidadeRegistros === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-foreground/[0.1] text-center">
          <p className="text-sm text-foreground/50">
            Nenhum registro em {formatMonthLabel(month)}.
          </p>
        </div>
      ) : (
        <div
          className={`space-y-5 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Registros" value={String(data.quantidadeRegistros)} />
            <Stat
              label="Dias com registro"
              value={String(data.diasComRegistro)}
            />
            <Stat
              label="Média de energia"
              value={
                data.mediaEnergia == null
                  ? "—"
                  : String(Math.round(data.mediaEnergia))
              }
              suffix={data.mediaEnergia == null ? undefined : "/100"}
            />
            <div className="glass-panel p-4">
              <p className="text-[10px] uppercase tracking-wide text-foreground/35 mb-1">
                vs. mês anterior
              </p>
              <p className={`text-xl font-bold tabular-nums ${deltaTone}`}>
                {delta == null
                  ? "—"
                  : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`}
              </p>
              <TrendBadge
                tendencia={data.comparacaoMesAnterior.tendencia}
                className="mt-1"
              />
            </div>
          </div>

          {(data.melhorDia || data.piorDia) && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.melhorDia && (
                <DayCard
                  label="Melhor dia"
                  tone="border-emerald-400/25 bg-emerald-500/[0.06]"
                  data={data.melhorDia}
                />
              )}
              {data.piorDia && (
                <DayCard
                  label="Dia mais difícil"
                  tone="border-rose-400/25 bg-rose-500/[0.06]"
                  data={data.piorDia}
                />
              )}
            </div>
          )}

          {data.emocoesMaisFrequentes.length > 0 && (
            <ChipGroup title="Emoções mais frequentes" items={data.emocoesMaisFrequentes} />
          )}

          {data.emocaoCompostaMaisFrequente && (
            <div className="rounded-xl border border-anima-violet/20 bg-anima-violet/[0.05] px-4 py-3">
              <p className="text-[10px] uppercase tracking-wide text-foreground/35">
                Emoção composta mais frequente
              </p>
              <p className="mt-0.5 text-sm font-medium text-foreground/80">
                {data.emocaoCompostaMaisFrequente.nome}{" "}
                <span className="text-foreground/40">
                  ×{data.emocaoCompostaMaisFrequente.count}
                </span>
              </p>
            </div>
          )}

          {data.principaisNecessidades.length > 0 && (
            <ChipGroup title="Principais necessidades" items={data.principaisNecessidades} />
          )}

          <p className="text-[10px] text-foreground/30">
            Período: {formatDay(data.periodo.inicio)} —{" "}
            {formatDay(data.periodo.fim)}
          </p>
        </div>
      )}
    </section>
  );
}

function NavButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="rounded-lg px-2 py-1 text-sm text-foreground/50 transition-colors hover:bg-foreground/[0.06] hover:text-foreground/80 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="glass-panel p-4">
      <p className="text-[10px] uppercase tracking-wide text-foreground/35 mb-1">
        {label}
      </p>
      <p className="text-xl font-bold text-foreground/85 tabular-nums">
        {value}
        {suffix && (
          <span className="text-sm font-normal text-foreground/30">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

function DayCard({
  label,
  tone,
  data,
}: {
  label: string;
  tone: string;
  data: { data: string; mediaEnergia: number };
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${tone}`}>
      <p className="text-[10px] uppercase tracking-wide text-foreground/40">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-foreground/80">
        {formatDay(data.data)}
      </p>
      <p className="text-xs text-foreground/50 tabular-nums">
        Energia {Math.round(data.mediaEnergia)}/100
      </p>
    </div>
  );
}

function ChipGroup({ title, items }: { title: string; items: CountItem[] }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-foreground/70">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.nome}
            className="rounded-full border border-foreground/[0.08] bg-foreground/[0.04] px-3 py-1.5 text-xs text-foreground/60"
          >
            {item.nome}{" "}
            <span className="text-foreground/35">({item.count})</span>
          </span>
        ))}
      </div>
    </div>
  );
}
