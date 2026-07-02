"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDiarySearch } from "@/hooks/use-diary";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { DiarySearchResult } from "@/types/insights";

export function DiarySearchBar() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 400);
    return () => clearTimeout(t);
  }, [q]);

  const { data, isFetching, error, refetch } = useDiarySearch(debouncedQ);
  const hasQuery = debouncedQ.length > 0;
  const results = data?.resultados ?? [];

  return (
    <div className="mb-6" role="search">
      <label htmlFor="diary-search" className="sr-only">
        Buscar no diário
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/35"
          aria-hidden
        >
          <SearchIcon />
        </span>
        <input
          id="diary-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por tema, sentimento, situação…"
          className="w-full rounded-xl border border-foreground/[0.08] bg-foreground/[0.03] py-2.5 pl-10 pr-10 text-sm text-foreground/80 outline-none transition-colors placeholder:text-foreground/35 focus-visible:border-anima-violet/50 focus-visible:ring-2 focus-visible:ring-anima-violet/20"
        />
        {isFetching && hasQuery && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2"
            aria-hidden
          >
            <Spinner />
          </span>
        )}
      </div>

      {hasQuery && (
        <div className="mt-3">
          {error ? (
            <ErrorMessage
              message="Não foi possível buscar agora."
              onRetry={() => refetch()}
            />
          ) : results.length === 0 && !isFetching ? (
            <p className="rounded-xl border border-dashed border-foreground/[0.1] px-4 py-6 text-center text-sm text-foreground/45">
              Nenhum registro encontrado para “{debouncedQ}”.
            </p>
          ) : (
            <>
              {data?.modo === "texto" && results.length > 0 && (
                <p className="mb-2 text-[11px] text-foreground/35">
                  Busca por texto (correspondência aproximada).
                </p>
              )}
              <ul className="space-y-2">
                {results.map((r) => (
                  <SearchResultItem key={r.id} result={r} />
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultItem({ result }: { result: DiarySearchResult }) {
  return (
    <li>
      <Link
        href={`/diary/${result.id}`}
        className="block rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-3.5 transition-colors hover:border-anima-violet/25 hover:bg-anima-violet/[0.04]"
      >
        <div className="mb-1 flex items-center justify-between gap-3">
          <span className="text-xs text-foreground/35">
            {formatShortDate(result.dataRegistro)}
          </span>
          {result.relevancia != null && (
            <span className="rounded-full bg-anima-violet/10 px-2 py-0.5 text-[10px] font-medium text-anima-violet tabular-nums">
              {Math.round(result.relevancia)}% relevante
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm text-foreground/70">{result.texto}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-foreground/45">
          {result.humor && (
            <span className="rounded-full border border-foreground/[0.08] px-2 py-0.5">
              {result.humor}
            </span>
          )}
          <span className="rounded-full border border-foreground/[0.08] px-2 py-0.5 tabular-nums">
            Energia {result.energiaInformada}
          </span>
        </div>
      </Link>
    </li>
  );
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-anima-violet" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
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
