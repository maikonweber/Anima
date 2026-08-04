"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  applyCarePlanSuggestions,
  approveAiSynthesis,
  exportAiSynthesisReport,
  suggestCarePlanItems,
  updateAiSynthesis,
} from "@anima/shared";
import type { AiSynthesis, CarePlanSuggestion } from "@anima/shared";
import { generateSessionIntelligence } from "@/lib/api/teleconsult";
import { ApiError } from "@anima/shared";

type Props = {
  orgId: string;
  sessionId: string;
  patientId: string;
  onDone?: () => void;
};

export function SessionIntelligencePanel({
  orgId,
  sessionId,
  patientId,
  onDone,
}: Props) {
  const [notes, setNotes] = useState("");
  const [includeDiary, setIncludeDiary] = useState(false);
  const [synthesis, setSynthesis] = useState<AiSynthesis | null>(null);
  const [editContent, setEditContent] = useState("");
  const [suggestions, setSuggestions] = useState<CarePlanSuggestion[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [createNote, setCreateNote] = useState(true);
  const [createPlan, setCreatePlan] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (synthesis) setEditContent(synthesis.workingContent);
  }, [synthesis]);

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const result = await generateSessionIntelligence(orgId, sessionId, {
        manualSessionNotes: notes.trim() || undefined,
        includeDiary,
        title: "Briefing pós-consulta",
      });
      setSynthesis(result.synthesis);
      setInfo("Briefing gerado — revise antes de aprovar.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 402) {
        setError(err.message || "Cota de análises esgotada neste mês.");
      } else {
        setError(err instanceof Error ? err.message : "Falha ao gerar briefing");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleLoadSuggestions() {
    if (!synthesis) return;
    setBusy(true);
    setError(null);
    try {
      const res = await suggestCarePlanItems(orgId, patientId, synthesis.id);
      setSuggestions(res.suggestions);
      setSelected(new Set(res.suggestions.map((s) => s.id)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao extrair sugestões",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleApprove() {
    if (!synthesis) return;
    setBusy(true);
    setError(null);
    try {
      if (editContent.trim() !== synthesis.workingContent) {
        await updateAiSynthesis(orgId, patientId, synthesis.id, {
          editedContent: editContent.trim(),
        });
      }
      const approved = await approveAiSynthesis(orgId, patientId, synthesis.id, {
        createClinicalNote: createNote,
        createCarePlanDraft: createPlan && selected.size === 0,
        carePlanStatus: "RASCUNHO",
      });
      setSynthesis(approved);
      if (selected.size > 0) {
        await applyCarePlanSuggestions(orgId, patientId, synthesis.id, {
          suggestionIds: Array.from(selected),
          carePlanStatus: "RASCUNHO",
        });
      }
      setInfo("Síntese aprovada. Itens de plano (se houver) não liberados ao paciente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao aprovar");
    } finally {
      setBusy(false);
    }
  }

  function toggleSuggestion(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleExport(format: "pdf" | "json") {
    if (!synthesis) return;
    setBusy(true);
    setError(null);
    try {
      const { url } = await exportAiSynthesisReport(
        orgId,
        patientId,
        synthesis.id,
        format,
      );
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao exportar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-panel p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground/90">
          Análise da sessão
        </h2>
        <p className="text-xs text-foreground/45 mt-1">
          Briefing assistivo revisável — humano no comando. Consome cota de IA.
        </p>
      </div>

      {!synthesis && (
        <form onSubmit={(e) => void handleGenerate(e)} className="space-y-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder="Notas manuais da sessão (opcional se houver chat/transcrição)…"
            className="w-full rounded-xl px-3 py-2 text-sm bg-foreground/[0.03] border border-foreground/[0.08]"
          />
          <label className="flex items-center gap-2 text-xs text-foreground/60">
            <input
              type="checkbox"
              checked={includeDiary}
              onChange={(e) => setIncludeDiary(e.target.checked)}
            />
            Incluir check-ins compartilhados
          </label>
          <Button type="submit" isLoading={busy}>
            Gerar briefing
          </Button>
        </form>
      )}

      {synthesis && (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={12}
            className="w-full rounded-xl px-3 py-2 text-sm bg-foreground/[0.03] border border-foreground/[0.08] whitespace-pre-wrap"
          />
          <div className="flex flex-wrap gap-3 text-xs text-foreground/60">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={createNote}
                onChange={(e) => setCreateNote(e.target.checked)}
              />
              Criar nota clínica (rascunho)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={createPlan}
                onChange={(e) => setCreatePlan(e.target.checked)}
              />
              Aplicar sugestões de plano (não liberadas)
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              isLoading={busy}
              onClick={() => void handleLoadSuggestions()}
            >
              Revisar itens de plano
            </Button>
            <Button
              type="button"
              isLoading={busy}
              onClick={() => void handleApprove()}
              disabled={synthesis.status === "APROVADA"}
            >
              {synthesis.status === "APROVADA" ? "Aprovada" : "Aprovar"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              isLoading={busy}
              onClick={() => void handleExport("pdf")}
            >
              Exportar PDF
            </Button>
            <Button
              type="button"
              variant="secondary"
              isLoading={busy}
              onClick={() => void handleExport("json")}
            >
              Exportar JSON
            </Button>
            {onDone && (
              <Button type="button" variant="ghost" onClick={onDone}>
                Concluir
              </Button>
            )}
          </div>
          {suggestions.length > 0 && (
            <ul className="space-y-2">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <label className="flex gap-2 text-sm text-foreground/75">
                    <input
                      type="checkbox"
                      checked={selected.has(s.id)}
                      onChange={() => toggleSuggestion(s.id)}
                    />
                    <span>
                      <span className="text-[11px] text-foreground/40">
                        {s.kind}
                      </span>{" "}
                      {s.title}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
      {info && <p className="text-xs text-emerald-500/80">{info}</p>}
    </div>
  );
}
