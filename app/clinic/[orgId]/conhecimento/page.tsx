"use client";

import { FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { ClinicToolHelp } from "@/components/clinic/ClinicToolHelp";
import {
  useArchiveClinicalKnowledge,
  useClinicalKnowledge,
  useCreateClinicalKnowledge,
  useDeleteClinicalKnowledge,
  usePublishClinicalKnowledge,
} from "@/hooks/use-clinical-knowledge";
import { useMyOrganizations } from "@/hooks/use-organizations";
import { getClinicUiDictionary } from "@/lib/i18n/clinic-ui-dictionary";
import { useLocale } from "@/lib/i18n/locale-provider";
import type { OrganizationRole } from "@anima/shared";

export default function ClinicalKnowledgePage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const { locale } = useLocale();
  const t = getClinicUiDictionary(locale);
  const k = t.knowledgePage;
  const statusLabel = {
    RASCUNHO: k.statusDraft,
    PUBLICADO: k.statusPublished,
    ARQUIVADO: k.statusArchived,
  } as const;
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
      setActionError(k.errorRequired);
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
        err instanceof Error ? err.message : k.errorCreate,
      );
    }
  }

  if (!canManage) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-sm text-foreground/50">{k.noPermission}</p>
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
          {t.pages.knowledge}
        </h1>
        <p className="text-sm text-foreground/40 mb-5">{k.description}</p>

        <section className="rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4 sm:p-5 mb-4 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-foreground/85 mb-1.5">
              {k.purposeTitle}
            </h2>
            <p className="text-sm text-[var(--clinic-muted)] leading-relaxed">
              {k.purposeBody}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground/85 mb-2">
              {k.workflowTitle}
            </h2>
            <ol className="list-decimal pl-4 space-y-1.5 text-sm text-[var(--clinic-muted)] leading-relaxed">
              {k.workflowSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground/85 mb-3">
              {k.examplesTitle}
            </h2>
            <ul className="space-y-3">
              {k.examples.map((example) => (
                <li
                  key={example.title}
                  className="rounded-xl border border-[var(--clinic-border)] bg-foreground/[0.02] px-3.5 py-3"
                >
                  <p className="text-xs font-semibold text-[var(--clinic-accent)] mb-1">
                    {example.title}
                  </p>
                  <p className="text-sm text-[var(--clinic-muted)] leading-relaxed">
                    {example.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[11px] text-foreground/45 leading-relaxed border-t border-[var(--clinic-border)] pt-3">
            {k.disclaimer}
          </p>
        </section>

        <ClinicToolHelp page="conhecimento" defaultTopicId="exemplos" />

        <form onSubmit={handleCreate} className="glass-panel p-4 space-y-3 mb-6">
          <p className="text-xs font-medium text-foreground/55">{k.formTitle}</p>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={k.titlePlaceholder}
          />
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={k.categoryPlaceholder}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder={k.bodyPlaceholder}
            className="w-full rounded-xl px-4 py-3 text-sm bg-foreground/[0.03] border border-foreground/[0.08] text-foreground/90"
          />
          {actionError && (
            <p className="text-xs text-red-400">{actionError}</p>
          )}
          <Button type="submit" isLoading={create.isPending}>
            {k.saveDraft}
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
                : k.errorLoad
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
                    {item.scope === "PLATFORM" ? k.scopePlatform : k.scopeClinic}{" "}
                    · {statusLabel[item.status]}
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
                        {k.publish}
                      </Button>
                    )}
                  {item.status === "PUBLICADO" && (
                    <Button
                      type="button"
                      variant="ghost"
                      isLoading={archive.isPending}
                      onClick={() => archive.mutate(item.id)}
                    >
                      {k.archive}
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      type="button"
                      variant="ghost"
                      isLoading={remove.isPending}
                      onClick={() => remove.mutate(item.id)}
                    >
                      {k.delete}
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
