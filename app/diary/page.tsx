"use client";

import { useState } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { useDiaryEntries } from "@/hooks/use-diary";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { getCategoryFromEnergy, getCategoryStyle } from "@/lib/energy";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 20;

export default function DiaryListPage() {
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data, isLoading, error, refetch } = useDiaryEntries({
    page,
    limit: PAGE_SIZE,
    from: from || undefined,
    to: to || undefined,
  });

  const entries = data?.data ?? [];
  const meta = data?.meta;
  const forbidden = error instanceof ApiError && error.status === 403;

  function clearDateFilter() {
    setFrom("");
    setTo("");
    setPage(1);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
            Histórico
          </h1>
          <p className="text-sm text-foreground/40">
            Seus registros emocionais
          </p>
        </div>
        <Link
          href="/diary/new"
          className="shrink-0 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
          }}
        >
          + Novo
        </Link>
      </div>

      <div className="glass-panel p-4 mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="from" className="text-xs text-foreground/40">
            De
          </label>
          <input
            id="from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="text-sm bg-foreground/[0.04] border border-foreground/[0.08] rounded-lg px-3 py-1.5 text-foreground/80"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="to" className="text-xs text-foreground/40">
            Até
          </label>
          <input
            id="to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="text-sm bg-foreground/[0.04] border border-foreground/[0.08] rounded-lg px-3 py-1.5 text-foreground/80"
          />
        </div>
        {(from || to) && (
          <button
            type="button"
            onClick={clearDateFilter}
            className="text-xs text-foreground/40 hover:text-anima-violet transition-colors pb-2"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {error && (
        <ErrorMessage
          message={
            forbidden
              ? error.message
              : "Não foi possível carregar o histórico."
          }
          onRetry={() => refetch()}
        />
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-foreground/[0.06] animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && !error && entries.length === 0 && (
        <div className="glass-panel p-10 text-center">
          <p className="text-4xl mb-3" aria-hidden>
            📝
          </p>
          <h3 className="text-base font-semibold text-foreground/70 mb-2">
            Nenhum registro ainda
          </h3>
          <p className="text-sm text-foreground/40 mb-6 max-w-xs mx-auto">
            Comece seu diário emocional registrando como você se sente hoje.
          </p>
          <Link href="/diary/new">
            <Button>Fazer primeiro registro</Button>
          </Link>
        </div>
      )}

      <ul className="space-y-3">
        {entries.map((entry) => {
          const style = getCategoryStyle(
            getCategoryFromEnergy(entry.energiaInformada),
          );
          return (
            <li key={entry.id}>
              <Link
                href={`/diary/${entry.id}`}
                className="block glass-panel p-4 hover:scale-[1.01] transition-transform duration-200"
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <span className="text-xs text-foreground/35">
                    {formatShortDate(entry.dataRegistro ?? entry.criadoEm)}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${style.bg}`}
                  >
                    {entry.energiaInformada} — {style.label}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 line-clamp-2">
                  {entry.texto}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-foreground/[0.06]">
          <Button
            type="button"
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Anterior
          </Button>
          <span className="text-xs text-foreground/40">
            Página {meta.page} de {meta.totalPages} ({meta.total} registros)
          </span>
          <Button
            type="button"
            variant="secondary"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima →
          </Button>
        </div>
      )}
    </div>
  );
}

function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
