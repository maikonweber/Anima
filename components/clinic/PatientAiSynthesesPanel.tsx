"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  useAiSyntheses,
  useApproveAiSynthesis,
  useGenerateAiSynthesis,
  useRejectAiSynthesis,
  useUpdateAiSynthesis,
} from "@/hooks/use-ai-syntheses";
import { useAppointments } from "@/hooks/use-agenda";
import { useMyOrganizations } from "@/hooks/use-organizations";
import type {
  AiSynthesis,
  AiSynthesisSourceKind,
  OrganizationRole,
} from "@anima/shared";
import { ApiError } from "@anima/shared";

type Props = {
  orgId: string;
  patientId: string;
};

const STATUS_LABEL: Record<AiSynthesis["status"], string> = {
  RASCUNHO: "Rascunho",
  PENDENTE_REVISAO: "Pendente revisão",
  APROVADA: "Aprovada",
  REJEITADA: "Rejeitada",
};

const SOURCE_LABEL: Record<AiSynthesisSourceKind, string> = {
  DIARIO: "Diário",
  SESSAO: "Sessão",
  MISTO: "Misto",
};

export function PatientAiSynthesesPanel({ orgId, patientId }: Props) {
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );
  const canAccess = role === "CLINIC_ADMIN" || role === "PROFESSIONAL";

  const list = useAiSyntheses(orgId, patientId, {}, canAccess);
  const appointments = useAppointments(orgId, {
    patientId,
    limit: 20,
  });
  const generate = useGenerateAiSynthesis(orgId, patientId);
  const update = useUpdateAiSynthesis(orgId, patientId);
  const approve = useApproveAiSynthesis(orgId, patientId);
  const reject = useRejectAiSynthesis(orgId, patientId);

  const [sourceKind, setSourceKind] = useState<AiSynthesisSourceKind>("DIARIO");
  const [appointmentId, setAppointmentId] = useState("");
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [createNote, setCreateNote] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!canAccess) return null;

  const consentBlocked =
    list.error instanceof ApiError && list.error.status === 403;

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setActionError(null);
    setSuccessMsg(null);
    if (
      (sourceKind === "SESSAO" || sourceKind === "MISTO") &&
      !appointmentId
    ) {
      setActionError("Selecione a sessão para fonte SESSAO/MISTO.");
      return;
    }
    try {
      await generate.mutateAsync({
        sourceKind,
        appointmentId:
          sourceKind === "DIARIO" ? undefined : appointmentId || undefined,
        title: title.trim() || undefined,
      });
      setTitle("");
      setSuccessMsg("Síntese gerada — revise antes de aprovar.");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao gerar síntese.",
      );
    }
  }

  function startEdit(item: AiSynthesis) {
    setEditingId(item.id);
    setEditContent(item.workingContent);
    setActionError(null);
    setSuccessMsg(null);
  }

  async function handleSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setActionError(null);
    setSuccessMsg(null);
    try {
      await update.mutateAsync({
        synthesisId: editingId,
        payload: { editedContent: editContent.trim() },
      });
      setEditingId(null);
      setSuccessMsg("Rascunho atualizado.");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao salvar edição.",
      );
    }
  }

  async function handleApprove(synthesisId: string) {
    setActionError(null);
    setSuccessMsg(null);
    try {
      await approve.mutateAsync({
        synthesisId,
        payload: { createClinicalNote: createNote },
      });
      setEditingId(null);
      setSuccessMsg(
        createNote
          ? "Aprovada · nota clínica criada em rascunho (não assinada)."
          : "Síntese aprovada.",
      );
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao aprovar.",
      );
    }
  }

  async function handleReject(synthesisId: string) {
    setActionError(null);
    setSuccessMsg(null);
    try {
      await reject.mutateAsync({
        synthesisId,
        payload: { reason: "Rejeitada na revisão clínica" },
      });
      setEditingId(null);
      setSuccessMsg("Síntese rejeitada.");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao rejeitar.",
      );
    }
  }

  return (
    <section className="mb-6">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground/60">
          Sínteses de IA (revisáveis)
        </h2>
        <p className="text-xs text-foreground/35 mt-0.5 leading-relaxed">
          Gere um rascunho com diário e/ou sessão, revise com a sua voz e aprove
          o que fizer sentido. A IA sugere — você decide. Requer consentimento
          de IA assistiva.
        </p>
      </div>

      <div className="glass-panel p-4 mb-3 border border-amber-500/15">
        <p className="text-[11px] text-foreground/50 leading-relaxed">
          A IA não diagnostica nem prescreve. Aprovação pode criar nota em
          RASCUNHO; nunca assina automaticamente.
        </p>
      </div>

      {consentBlocked && (
        <p className="text-xs text-foreground/45 mb-3">
          Ative o consentimento{" "}
          <span className="text-foreground/70">IA assistiva</span> para gerar
          e revisar sínteses.
        </p>
      )}

      {!consentBlocked && (
        <form
          onSubmit={handleGenerate}
          className="glass-panel p-4 space-y-3 mb-4"
        >
          <p className="text-xs font-medium text-foreground/55">
            Gerar nova síntese
          </p>
          <Select
            value={sourceKind}
            onChange={(e) =>
              setSourceKind(e.target.value as AiSynthesisSourceKind)
            }
          >
            <option value="DIARIO">Diário compartilhado</option>
            <option value="SESSAO">Sessão / agenda</option>
            <option value="MISTO">Misto (diário + sessão)</option>
          </Select>
          {(sourceKind === "SESSAO" || sourceKind === "MISTO") && (
            <Select
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
            >
              <option value="">Selecione a sessão...</option>
              {(appointments.data?.items ?? []).map((appt) => (
                <option key={appt.id} value={appt.id}>
                  {new Date(appt.startsAt).toLocaleString("pt-BR")} ·{" "}
                  {appt.status}
                </option>
              ))}
            </Select>
          )}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título (opcional)"
          />
          <label className="flex items-center gap-2 text-xs text-foreground/50">
            <input
              type="checkbox"
              checked={createNote}
              onChange={(e) => setCreateNote(e.target.checked)}
              className="rounded border-foreground/20"
            />
            Ao aprovar, criar nota clínica em rascunho
          </label>
          <Button type="submit" isLoading={generate.isPending}>
            Gerar síntese
          </Button>
        </form>
      )}

      {actionError && (
        <p className="text-xs text-red-400 mb-3">{actionError}</p>
      )}
      {successMsg && (
        <p className="text-xs text-emerald-500/80 mb-3">{successMsg}</p>
      )}

      {list.isLoading && (
        <div className="h-24 rounded-xl bg-foreground/[0.06] animate-pulse" />
      )}
      {list.error && !consentBlocked && (
        <ErrorMessage
          message={
            list.error instanceof Error
              ? list.error.message
              : "Falha ao carregar sínteses."
          }
          onRetry={() => list.refetch()}
        />
      )}

      {!list.isLoading && !list.error && (
        <ul className="space-y-3">
          {(list.data ?? []).length === 0 ? (
            <li className="text-xs text-foreground/40">
              Nenhuma síntese ainda.
            </li>
          ) : (
            (list.data ?? []).map((item) => {
              const pending = item.status === "PENDENTE_REVISAO";
              const isEditing = editingId === item.id;
              return (
                <li key={item.id} className="glass-panel p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground/80">
                        {item.title || "Síntese sem título"}
                      </p>
                      <p className="text-[11px] text-foreground/40 mt-0.5">
                        {SOURCE_LABEL[item.sourceKind]} ·{" "}
                        {STATUS_LABEL[item.status]} ·{" "}
                        {new Date(item.criadoEm).toLocaleString("pt-BR")}
                        {item.sources.some(
                          (s) => s.type === "clinical_knowledge",
                        )
                          ? ` · ${item.sources.filter((s) => s.type === "clinical_knowledge").length} fonte(s) curada(s)`
                          : ""}
                      </p>
                    </div>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSaveEdit} className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={8}
                        className="w-full rounded-xl px-3 py-2 text-sm bg-foreground/[0.03] border border-foreground/[0.08] text-foreground/90"
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button type="submit" isLoading={update.isPending}>
                          Salvar edição
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-foreground/70 whitespace-pre-wrap mb-3">
                      {item.workingContent}
                    </p>
                  )}

                  {pending && !isEditing && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => startEdit(item)}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        isLoading={approve.isPending}
                        onClick={() => handleApprove(item.id)}
                      >
                        Aprovar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        isLoading={reject.isPending}
                        onClick={() => handleReject(item.id)}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  )}

                  {item.status === "APROVADA" && item.clinicalNoteId && (
                    <p className="text-[11px] text-foreground/40 mt-2">
                      Nota clínica vinculada (rascunho)
                    </p>
                  )}
                  {item.status === "REJEITADA" && item.rejectionReason && (
                    <p className="text-[11px] text-foreground/40 mt-2">
                      Motivo: {item.rejectionReason}
                    </p>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </section>
  );
}
