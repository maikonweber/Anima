"use client";

import { getCategoryStyle } from "@/lib/energy";
import type { DiaryAnalysis, DiaryEntry } from "@/lib/types";

interface AnalysisCardProps {
  analysis: DiaryAnalysis;
  entry?: DiaryEntry | null;
}

export function AnalysisCard({ analysis, entry }: AnalysisCardProps) {
  const style = getCategoryStyle(analysis.categoriaEnergia);
  const confiancaPct = Math.round(analysis.confianca * 100);

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 emotion-glow">
        <p className="text-sm text-foreground/40 mb-2">Resumo emocional · SENTIO AI</p>
        <p className="text-base sm:text-lg text-foreground/85 leading-relaxed italic">
          &ldquo;{analysis.resumoEmocional}&rdquo;
        </p>
      </div>

      <div className="glass-panel p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-foreground/50">Energia estimada</span>
          <span className="text-2xl font-bold tabular-nums" style={{ color: style.color }}>
            {analysis.energiaCalculada}
            <span className="text-sm font-normal text-foreground/30">/100</span>
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.bg}`}>
            {style.label}
          </span>
          {entry != null && (
            <span className="text-xs text-foreground/35 ml-auto">
              Informada: {entry.energiaInformada}/100
            </span>
          )}
        </div>

        {analysis.emocoesBaseDetectadas.length > 0 && (
          <div>
            <p className="text-xs font-medium text-foreground/40 uppercase tracking-wide mb-2">
              Emoções em evidência neste texto
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.emocoesBaseDetectadas.map((nome) => (
                <span
                  key={nome}
                  className="px-2.5 py-1 rounded-full text-xs bg-anima-violet/10 text-anima-violet"
                >
                  {nome}
                </span>
              ))}
            </div>
          </div>
        )}

        {[
          { label: "Emoção oculta", value: analysis.emocaoOculta },
          { label: "Emoção composta", value: analysis.emocaoComposta },
          { label: "Necessidade", value: analysis.necessidadeIdentificada },
          { label: "Desejo", value: analysis.desejoIdentificado },
        ].map(
          (row) =>
            row.value?.trim() && (
              <div key={row.label}>
                <p className="text-xs text-foreground/40 mb-0.5">{row.label}</p>
                <p className="text-sm text-foreground/75">{row.value}</p>
              </div>
            ),
        )}

        <div className="rounded-xl p-4 border border-anima-violet/20 bg-anima-violet/5">
          <p className="text-xs font-medium text-anima-violet uppercase tracking-wide mb-1">
            Sugestão de autocuidado
          </p>
          <p className="text-sm font-medium text-foreground/80 leading-relaxed">
            {analysis.acaoSugerida}
          </p>
        </div>

        <p className="text-xs text-foreground/35 text-right">
          Confiança do insight · SENTIO AI: {confiancaPct}%
        </p>
      </div>
    </div>
  );
}
