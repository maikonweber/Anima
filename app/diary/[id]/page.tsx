"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import {
  useAnalyzeDiaryEntry,
  useDiaryAnalysis,
  useDiaryEntry,
} from "@/hooks/use-diary";
import { AnalysisCard } from "@/components/analysis/AnalysisCard";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { getCategoryFromEnergy, getCategoryStyle } from "@/lib/energy";

export default function DiaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: entry, isLoading: loadingEntry, error: entryError, refetch: refetchEntry } = useDiaryEntry(id);
  const { data: analysis, isLoading: loadingAnalysis, refetch: refetchAnalysis } = useDiaryAnalysis(id);
  const analyze = useAnalyzeDiaryEntry();
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const didAutoAnalyze = useRef(false);

  useEffect(() => {
    if (didAutoAnalyze.current || loadingEntry || !entry || analysis) return;
    didAutoAnalyze.current = true;
    void runAnalyze();
  }, [loadingEntry, entry, analysis]);

  async function runAnalyze() {
    setAnalyzeError(null);
    try {
      await analyze.mutateAsync(id);
      await refetchAnalysis();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 503) {
          setAnalyzeError("Serviço de IA indisponível. Tente novamente em instantes.");
        } else {
          setAnalyzeError(err.message);
        }
      } else {
        setAnalyzeError("Não foi possível analisar este registro.");
      }
    }
  }

  if (loadingEntry) {
    return <DiaryDetailSkeleton />;
  }

  if (entryError || !entry) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ErrorMessage
          message="Registro não encontrado."
          onRetry={() => refetchEntry()}
        />
        <Link href="/diary" className="block mt-4 text-sm text-anima-violet">
          ← Voltar ao histórico
        </Link>
      </div>
    );
  }

  const informedCategory = getCategoryFromEnergy(entry.energiaInformada);
  const informedStyle = getCategoryStyle(informedCategory);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href="/diary"
        className="text-xs text-foreground/40 hover:text-anima-violet transition-colors"
      >
        ← Histórico
      </Link>

      <header className="mt-4 mb-8">
        <p className="text-xs text-foreground/35 mb-2">
          {formatDate(entry.dataRegistro ?? entry.criadoEm)}
        </p>
        <div className="glass-panel p-5 mb-4">
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {entry.texto}
          </p>
          {entry.observacoes && (
            <p className="text-xs text-foreground/40 mt-3 pt-3 border-t border-foreground/[0.06]">
              {entry.observacoes}
            </p>
          )}
        </div>

        <DiaryDetailMeta
          energia={entry.energiaInformada}
          style={informedStyle}
          emotions={entry.emotions}
        />
      </header>

      {(analyze.isPending || (loadingAnalysis && !analysis)) && (
        <div className="glass-panel p-8 text-center mb-6">
          <DiaryDetailSpinner />
          <p className="text-sm text-foreground/50 mt-4">
            Analisando suas emoções...
          </p>
        </div>
      )}

      {analyzeError && (
        <DiaryDetailAnalyzeError
          message={analyzeError}
          onRetry={runAnalyze}
          isLoading={analyze.isPending}
        />
      )}

      {analysis && !analyze.isPending && (
        <AnalysisCard analysis={analysis} entry={entry} />
      )}

      {!analysis && !analyze.isPending && !analyzeError && (
        <Button onClick={runAnalyze} isLoading={analyze.isPending} className="mt-4">
          Analisar com IA
        </Button>
      )}
    </div>
  );
}

function DiaryDetailMeta({
  energia,
  style,
  emotions,
}: {
  energia: number;
  style: ReturnType<typeof getCategoryStyle>;
  emotions?: { nome: string; cor?: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-foreground/50">
        Energia informada:{" "}
        <strong style={{ color: style.color }}>{energia}/100</strong>
      </span>
      <span className={`text-xs px-2 py-0.5 rounded-full border ${style.bg}`}>
        {style.label}
      </span>
      {emotions && emotions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 w-full mt-1">
          {emotions.map((e) => (
            <span
              key={e.nome}
              className="text-xs px-2 py-0.5 rounded-full border border-foreground/[0.08]"
              style={e.cor ? { borderColor: `${e.cor}40`, color: e.cor } : undefined}
            >
              {e.nome}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function DiaryDetailAnalyzeError({
  message,
  onRetry,
  isLoading,
}: {
  message: string;
  onRetry: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="mb-6">
      <ErrorMessage message={message} onRetry={onRetry} />
      <Button onClick={onRetry} isLoading={isLoading} variant="secondary" className="mt-3">
        Tentar novamente
      </Button>
    </div>
  );
}

function DiaryDetailSpinner() {
  return (
    <div className="w-12 h-12 rounded-full border-2 border-anima-violet/30 border-t-anima-violet animate-spin mx-auto" />
  );
}

function DiaryDetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-4 animate-pulse">
      <div className="h-4 w-24 bg-foreground/[0.06] rounded" />
      <div className="h-40 bg-foreground/[0.06] rounded-2xl" />
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
