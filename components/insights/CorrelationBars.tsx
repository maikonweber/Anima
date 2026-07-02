"use client";

import { useState } from "react";
import { useCorrelations } from "@/hooks/use-insights";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { Correlation } from "@/types/insights";

const PERIODS = [30, 90, 180] as const;

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function CorrelationBars() {
  const [days, setDays] = useState<number>(90);
  const { data, isLoading, error, refetch, isFetching } =
    useCorrelations(days);

  return (
    <section className="glass-panel p-5 sm:p-6" aria-label="Correlações">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground/85">
            Correlações com a energia
          </h2>
          {data && (
            <p className="mt-0.5 text-[11px] text-foreground/40">
              {formatRange(data.periodo.inicio, data.periodo.fim)} ·{" "}
              {data.amostraRegistros} registros analisados
            </p>
          )}
        </div>
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

      {error ? (
        <ErrorMessage
          message="Não foi possível carregar as correlações."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-foreground/[0.05] animate-pulse"
            />
          ))}
        </div>
      ) : !data || data.correlacoes.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-foreground/[0.1] text-center">
          <p className="text-sm text-foreground/50">
            Ainda não há dados suficientes para calcular correlações.
          </p>
          <p className="text-xs text-foreground/35">
            Continue registrando para descobrir o que mais afeta sua energia.
          </p>
        </div>
      ) : (
        <ul
          className={`space-y-3 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
        >
          {data.correlacoes.map((c) => (
            <CorrelationRow key={c.metrica} correlation={c} />
          ))}
        </ul>
      )}
    </section>
  );
}

function CorrelationRow({ correlation }: { correlation: Correlation }) {
  const { metrica, coeficiente, amostra, interpretacao } = correlation;
  const insufficient = coeficiente == null;
  const value = coeficiente ?? 0;
  const pct = Math.min(Math.abs(value), 1) * 50; // half-width max
  const positive = value >= 0;

  return (
    <li className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-3.5 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground/75">
          {capitalize(metrica)}
        </span>
        {insufficient ? (
          <span className="rounded-full border border-foreground/[0.1] bg-foreground/[0.03] px-2 py-0.5 text-[10px] text-foreground/40">
            dados insuficientes
          </span>
        ) : (
          <span
            className={`text-xs font-semibold tabular-nums ${
              positive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {value > 0 ? "+" : ""}
            {value.toFixed(2)}
          </span>
        )}
      </div>

      {!insufficient && (
        <div className="relative mt-2 h-2 w-full rounded-full bg-foreground/[0.05]">
          <div className="absolute left-1/2 top-0 h-full w-px bg-foreground/[0.15]" />
          <div
            className={`absolute top-0 h-full rounded-full ${
              positive
                ? "bg-emerald-500/70"
                : "bg-rose-500/70"
            }`}
            style={
              positive
                ? { left: "50%", width: `${pct}%` }
                : { right: "50%", width: `${pct}%` }
            }
          />
        </div>
      )}

      <p className="mt-2 text-xs leading-snug text-foreground/50">
        {interpretacao}
        {!insufficient && (
          <span className="text-foreground/30"> · amostra {amostra}</span>
        )}
      </p>
    </li>
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
