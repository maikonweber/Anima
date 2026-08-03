"use client";

import { FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import {
  useArchiveClinicalKnowledge,
  useClinicalKnowledge,
  useCreateClinicalKnowledge,
  useDeleteClinicalKnowledge,
  usePublishClinicalKnowledge,
} from "@/hooks/use-clinical-knowledge";
import { useMyOrganizations } from "@/hooks/use-organizations";
import type { OrganizationRole } from "@anima/shared";

const STATUS_LABEL = {
  RASCUNHO: "Rascunho",
  PUBLICADO: "Publicado",
  ARQUIVADO: "Arquivado",
} as const;

export default function ClinicalKnowledgePage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );
  const canManage = role === "CLINIC_ADMIN" || role === "PROFESSIONAL";
  const canDelete = role === "CLINIC_ADMIN";

  const list = useClinicalKnowledge(orgId, {}, canManage);
  const create = useCreateClinicalKnowledge(orgId);
  const publish = usePublishClinicalKnowledge(orgId);
  const archive = useArchiveClinicalKnowledge(orgId);
  const remove = useDeleteClinicalKnowledge(orgId);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setActionError(null);
    if (!title.trim() || !body.trim()) {
      setActionError("Informe título e conteúdo.");
      return;
    }
    try {
      await create.mutateAsync({
        title: title.trim(),
        body: body.trim(),
        category: category.trim() || null,
      });
      setTitle("");
      setBody("");
      setCategory("");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao criar artigo.",
      );
    }
  }

  if (!canManage) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-sm text-foreground/50">
          Sem permissão para gerenciar a base curada.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold text-foreground/90 mb-1">
          Conhecimento clínico
        </h1>
        <p className="text-sm text-foreground/40 mb-6">
          RAG curado (RF-073) · só artigos publicados entram nas sínteses ·
          humano no comando
        </p>

        <div className="glass-panel p-4 mb-4 border border-amber-500/15">
          <p className="text-[11px] text-foreground/50 leading-relaxed">
            Conteúdo educativo/governança — não é protocolo diagnóstico. Catálogo
            da plataforma é somente leitura; a clínica pode publicar artigos
            próprios.
          </p>
        </div>

        <form onSubmit={handleCreate} className="glass-panel p-4 space-y-3 mb-6">
          <p className="text-xs font-medium text-foreground/55">
            Novo artigo da clínica
          </p>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
          />
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Categoria (opcional)"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="Conteúdo curado"
            className="w-full rounded-xl px-4 py-3 text-sm bg-foreground/[0.03] border border-foreground/[0.08] text-foreground/90"
          />
          {actionError && (
            <p className="text-xs text-red-400">{actionError}</p>
          )}
          <Button type="submit" isLoading={create.isPending}>
            Salvar rascunho
          </Button>
        </form>

        {list.isLoading && (
          <div className="h-24 rounded-xl bg-foreground/[0.06] animate-pulse" />
        )}
        {list.error && (
          <ErrorMessage
            message={
              list.error instanceof Error
                ? list.error.message
                : "Falha ao carregar artigos."
            }
            onRetry={() => list.refetch()}
          />
        )}

        <ul className="space-y-3">
          {(list.data ?? []).map((item) => (
            <li key={item.id} className="glass-panel p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground/80">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-foreground/40 mt-0.5">
                    {item.scope === "PLATFORM" ? "Plataforma" : "Clínica"} ·{" "}
                    {STATUS_LABEL[item.status]}
                    {item.category ? ` · ${item.category}` : ""}
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground/65 whitespace-pre-wrap mb-3 line-clamp-4">
                {item.body}
              </p>
              {item.editable && (
                <div className="flex flex-wrap gap-2">
                  {item.status !== "PUBLICADO" &&
                    item.status !== "ARQUIVADO" && (
                      <Button
                        type="button"
                        isLoading={publish.isPending}
                        onClick={() => publish.mutate(item.id)}
                      >
                        Publicar
                      </Button>
                    )}
                  {item.status === "PUBLICADO" && (
                    <Button
                      type="button"
                      variant="ghost"
                      isLoading={archive.isPending}
                      onClick={() => archive.mutate(item.id)}
                    >
                      Arquivar
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      type="button"
                      variant="ghost"
                      isLoading={remove.isPending}
                      onClick={() => remove.mutate(item.id)}
                    >
                      Excluir
                    </Button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
