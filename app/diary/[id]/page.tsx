"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-client";
import {
  useAnalyzeDiaryEntry,
  useDeleteDiaryEntry,
  useDiaryAnalysis,
  useDiaryEntry,
} from "@/hooks/use-diary";
import { AnalysisCard } from "@/components/analysis/AnalysisCard";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { getCategoryFromEnergy, getCategoryStyle } from "@/lib/energy";
import { UsageMeter } from "@/components/subscription/UsageMeter";
import { useSubscription } from "@/providers/subscription-provider";

export default function DiaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { usage } = useSubscription();
  const { data: entry, isLoading: loadingEntry, error: entryError, refetch: refetchEntry } = useDiaryEntry(id);
  const { data: analysis, isLoading: loadingAnalysis, refetch: refetchAnalysis } = useDiaryAnalysis(id);
  const analyze = useAnalyzeDiaryEntry();
  const deleteEntry = useDeleteDiaryEntry();
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const didAutoAnalyze = useRef(false);

  const forbidden = entryError instanceof ApiError && entryError.status === 403;

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
      if (err instanceof ApiError && err.status === 402) return;
      if (err instanceof ApiError) {
        if (err.status === 503) {
          setAnalyzeError("Insights indisponíveis no momento. Tente novamente em instantes.");
        } else {
          setAnalyzeError(err.message);
        }
      } else {
        setAnalyzeError("Não foi possível gerar insights neste momento.");
      }
    }
  }

  async function handleDelete() {
    if (!window.confirm("Excluir este registro? Esta ação não pode ser desfeita.")) {
      return;
    }
    setDeleteError(null);
    try {
      await deleteEntry.mutateAsync(id);
      router.push("/diary");
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível excluir o registro.",
      );
    }
  }

  if (loadingEntry) {
    return <DiaryDetailSkeleton />;
  }

  if (entryError || !entry) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ErrorMessage
          message={
            forbidden
              ? entryError.message
              : "Registro não encontrado."
          }
          onRetry={() => refetchEntry()}
        />
        <Link href="/diary" className="block mt-4 text-sm text-anima-violet">
          ← Voltar à linha do tempo
        </Link>
      </div>
    );
  }

  const informedCategory = getCategoryFromEnergy(entry.energiaInformada);
  const informedStyle = getCategoryStyle(informedCategory);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/diary"
          className="text-xs text-foreground/40 hover:text-anima-violet transition-colors"
        >
          ← Linha do tempo
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/diary/${id}/edit`}
            className="text-xs px-3 py-1.5 rounded-full border border-foreground/[0.1] text-foreground/60 hover:text-anima-violet hover:border-anima-violet/30 transition-colors"
          >
            Editar
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteEntry.isPending}
            className="text-xs px-3 py-1.5 rounded-full border border-red-400/20 text-red-400/80 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            {deleteEntry.isPending ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>

      {deleteError && (
        <div className="mt-4">
          <ErrorMessage message={deleteError} />
        </div>
      )}

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
          humor={entry.humor}
          ansiedadeInformada={entry.ansiedadeInformada}
          intensidadeEmocional={entry.intensidadeEmocional}
          tagsEmocionais={entry.tagsEmocionais}
          tracking={entry.tracking}
        />
      </header>

      {(analyze.isPending || (loadingAnalysis && !analysis)) && (
        <div className="glass-panel p-8 text-center mb-6">
          <DiaryDetailSpinner />
          <p className="text-sm text-foreground/50 mt-4">
            A SENTIO AI está preparando seus insights...
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

      {usage && (
        <div className="glass-panel p-4 mb-4">
          <UsageMeter
            label="Insights SENTIO AI este mês"
            used={usage.aiAnalyses.used}
            limit={usage.aiAnalyses.limit}
          />
        </div>
      )}

      {!analysis && !analyze.isPending && !analyzeError && (
        <Button onClick={runAnalyze} isLoading={analyze.isPending} className="mt-4">
          Explorar insights
        </Button>
      )}
    </div>
  );
}

function DiaryDetailMeta({
  energia,
  style,
  emotions,
  humor,
  ansiedadeInformada,
  intensidadeEmocional,
  tagsEmocionais,
  tracking,
}: {
  energia: number;
  style: ReturnType<typeof getCategoryStyle>;
  emotions?: { nome: string; cor?: string | null }[];
  humor?: string;
  ansiedadeInformada?: number;
  intensidadeEmocional?: number;
  tagsEmocionais?: string[];
  tracking?: {
    sono?: number;
    estresse?: number;
    socializacao?: number;
    motivacao?: number;
    burnout?: number;
  };
}) {
  const trackingItems = [
    { label: "Sono", value: tracking?.sono },
    { label: "Estresse", value: tracking?.estresse },
    { label: "Socialização", value: tracking?.socializacao },
    { label: "Motivação", value: tracking?.motivacao },
    { label: "Burnout", value: tracking?.burnout },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-foreground/50">
          Energia informada:{" "}
          <strong style={{ color: style.color }}>{energia}/100</strong>
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${style.bg}`}>
          {style.label}
        </span>
        {humor && (
          <span className="text-xs px-2 py-0.5 rounded-full border border-foreground/[0.08] text-foreground/75">
            Humor: {humor}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {typeof ansiedadeInformada === "number" && (
          <div className="glass-panel p-3 border border-foreground/[0.08]">
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-1">
              Ansiedade
            </p>
            <p className="text-sm font-semibold text-foreground/80">
              {ansiedadeInformada}%
            </p>
          </div>
        )}
        {typeof intensidadeEmocional === "number" && (
          <div className="glass-panel p-3 border border-foreground/[0.08]">
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-1">
              Intensidade emocional
            </p>
            <p className="text-sm font-semibold text-foreground/80">
              {intensidadeEmocional}%
            </p>
          </div>
        )}
      </div>

      {tagsEmocionais && tagsEmocionais.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tagsEmocionais.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 rounded-full border border-foreground/[0.08] text-foreground/65"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {trackingItems.some((item) => item.value !== undefined) && (
        <div className="grid grid-cols-2 gap-3">
          {trackingItems.map(
            (item) =>
              item.value !== undefined && (
                <div
                  key={item.label}
                  className="glass-panel p-3 border border-foreground/[0.08]"
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">
                    <span>{item.label}</span>
                    <span>{Math.round(item.value)}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-anima-violet to-anima-lilac"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ),
          )}
        </div>
      )}

      {emotions && emotions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
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
