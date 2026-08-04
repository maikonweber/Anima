"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { ClinicalNoteStatusBadge } from "@/components/clinic/ClinicalNoteStatusBadge";
import {
  useAddClinicalNoteAddendum,
  useClinicalNotes,
  useCreateClinicalNote,
  useSignClinicalNote,
  useUpdateClinicalNote,
} from "@/hooks/use-clinical-notes";
import { useMyOrganizations } from "@/hooks/use-organizations";
import type { ClinicalNote, OrganizationRole } from "@anima/shared";

type Props = {
  orgId: string;
  patientId: string;
};

export function PatientClinicalNotesPanel({ orgId, patientId }: Props) {
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );

  const canAccess = role === "CLINIC_ADMIN" || role === "PROFESSIONAL";

  const { data, isLoading, error, refetch } = useClinicalNotes(
    orgId,
    patientId,
  );
  const createNote = useCreateClinicalNote(orgId, patientId);
  const updateNote = useUpdateClinicalNote(orgId, patientId);
  const signNote = useSignClinicalNote(orgId, patientId);
  const addAddendum = useAddClinicalNoteAddendum(orgId, patientId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [addendumFor, setAddendumFor] = useState<string | null>(null);
  const [addendumText, setAddendumText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [signingId, setSigningId] = useState<string | null>(null);

  if (!canAccess) {
    return null;
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);
    if (!content.trim()) {
      setFormError("Informe o conteúdo da nota.");
      return;
    }
    try {
      await createNote.mutateAsync({
        title: title.trim() || null,
        content: content.trim(),
      });
      setTitle("");
      setContent("");
      setSuccessMsg("Rascunho criado.");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Falha ao criar nota clínica.",
      );
    }
  }

  function startEdit(note: ClinicalNote) {
    setEditingId(note.id);
    setEditTitle(note.title ?? "");
    setEditContent(note.content);
    setFormError(null);
    setSuccessMsg(null);
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setFormError(null);
    setSuccessMsg(null);
    try {
      await updateNote.mutateAsync({
        noteId: editingId,
        payload: {
          title: editTitle.trim() || null,
          content: editContent.trim(),
        },
      });
      setEditingId(null);
      setSuccessMsg("Rascunho atualizado.");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Falha ao atualizar rascunho.",
      );
    }
  }

  async function handleSign(noteId: string) {
    setFormError(null);
    setSuccessMsg(null);
    setSigningId(noteId);
    try {
      await signNote.mutateAsync(noteId);
      setSuccessMsg("Nota assinada.");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Falha ao assinar nota.",
      );
    } finally {
      setSigningId(null);
    }
  }

  async function handleAddendum(e: FormEvent) {
    e.preventDefault();
    if (!addendumFor) return;
    setFormError(null);
    setSuccessMsg(null);
    if (!addendumText.trim()) {
      setFormError("Informe o conteúdo do adendo.");
      return;
    }
    try {
      await addAddendum.mutateAsync({
        noteId: addendumFor,
        payload: { content: addendumText.trim() },
      });
      setAddendumFor(null);
      setAddendumText("");
      setSuccessMsg("Adendo registrado.");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Falha ao adicionar adendo.",
      );
    }
  }

  return (
    <section className="mb-6">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground/60">
          Prontuário clínico
        </h2>
        <p className="text-xs text-foreground/35 mt-0.5 leading-relaxed">
          Registre a evolução com clareza: rascunho, assinatura e adendo.
          Integridade clínica primeiro — separado do CRM e do diário do paciente.
        </p>
      </div>

      {error && (
        <ErrorMessage
          message={
            error instanceof Error
              ? error.message
              : "Não foi possível carregar o prontuário."
          }
          onRetry={() => refetch()}
        />
      )}

      {isLoading && (
        <div className="h-28 rounded-xl bg-foreground/[0.06] animate-pulse mb-4" />
      )}

      <form onSubmit={handleCreate} className="glass-panel p-5 space-y-3 mb-4">
        <h3 className="text-sm font-semibold text-foreground/75">
          Nova nota (rascunho)
        </h3>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título (opcional)"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Conteúdo clínico"
          className="w-full rounded-xl px-4 py-3 text-sm bg-foreground/[0.03] border border-foreground/[0.08] text-foreground/90"
        />
        <Button type="submit" isLoading={createNote.isPending}>
          Criar rascunho
        </Button>
      </form>

      {data && data.length > 0 && (
        <ul className="space-y-3 mb-4">
          {data.map((note) => (
            <li key={note.id} className="glass-panel p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground/80">
                      {note.title || "Sem título"}
                    </p>
                    <ClinicalNoteStatusBadge status={note.status} />
                  </div>
                  <p className="text-[11px] text-foreground/35 mt-1">
                    {new Date(note.criadoEm).toLocaleString("pt-BR")}
                    {note.signedAt
                      ? ` · assinada ${new Date(note.signedAt).toLocaleString("pt-BR")}`
                      : ""}
                  </p>
                </div>
              </div>

              {editingId === note.id ? (
                <form onSubmit={handleUpdate} className="space-y-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Título"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl px-4 py-3 text-sm bg-foreground/[0.03] border border-foreground/[0.08] text-foreground/90"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" isLoading={updateNote.isPending}>
                      Salvar
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
                <p className="text-sm text-foreground/70 whitespace-pre-wrap">
                  {note.content}
                </p>
              )}

              {note.status === "RASCUNHO" && editingId !== note.id && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => startEdit(note)}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    isLoading={
                      signNote.isPending && signingId === note.id
                    }
                    onClick={() => void handleSign(note.id)}
                  >
                    Assinar
                  </Button>
                </div>
              )}

              {note.addenda.length > 0 && (
                <div className="border-t border-foreground/[0.06] pt-3 space-y-2">
                  <p className="text-[11px] uppercase tracking-wide text-foreground/35">
                    Adendos
                  </p>
                  {note.addenda.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-foreground/[0.06] px-3 py-2"
                    >
                      <p className="text-sm text-foreground/70 whitespace-pre-wrap">
                        {item.content}
                      </p>
                      <p className="text-[11px] text-foreground/35 mt-1">
                        {new Date(item.criadoEm).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {note.status === "ASSINADA" && (
                <div>
                  {addendumFor === note.id ? (
                    <form onSubmit={handleAddendum} className="space-y-2">
                      <textarea
                        value={addendumText}
                        onChange={(e) => setAddendumText(e.target.value)}
                        rows={3}
                        placeholder="Conteúdo do adendo"
                        className="w-full rounded-xl px-4 py-3 text-sm bg-foreground/[0.03] border border-foreground/[0.08] text-foreground/90"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          isLoading={addAddendum.isPending}
                        >
                          Salvar adendo
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setAddendumFor(null);
                            setAddendumText("");
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setAddendumFor(note.id);
                        setAddendumText("");
                        setFormError(null);
                      }}
                    >
                      Adicionar adendo
                    </Button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {data && data.length === 0 && !isLoading && !error && (
        <p className="text-sm text-foreground/40 mb-4">
          Nenhuma nota clínica ainda.
        </p>
      )}

      {formError && <p className="text-xs text-red-400 mb-2">{formError}</p>}
      {successMsg && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-2">
          {successMsg}
        </p>
      )}
    </section>
  );
}
