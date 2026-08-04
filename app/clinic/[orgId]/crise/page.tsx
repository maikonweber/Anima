"use client";

import { FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  ClinicPageFrame,
  ClinicPageHeader,
} from "@/components/clinic/ClinicPageFrame";
import {
  useCreateCrisisResource,
  useCrisisResources,
  useDeleteCrisisResource,
  useUpdateCrisisResource,
} from "@/hooks/use-crisis-resources";
import { useMyOrganizations } from "@/hooks/use-organizations";
import { getClinicUiDictionary } from "@/lib/i18n/clinic-ui-dictionary";
import { useLocale } from "@/lib/i18n/locale-provider";
import type { OrganizationRole } from "@anima/shared";

export default function ClinicCrisisResourcesPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const { locale } = useLocale();
  const t = getClinicUiDictionary(locale);
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );
  const canManage = role === "CLINIC_ADMIN";
  const canView =
    role === "CLINIC_ADMIN" ||
    role === "PROFESSIONAL" ||
    role === "SECRETARY" ||
    role === "DPO";

  const list = useCrisisResources(
    orgId,
    { includeDisabled: canManage },
    canView,
  );
  const create = useCreateCrisisResource(orgId);
  const update = useUpdateCrisisResource(orgId);
  const remove = useDeleteCrisisResource(orgId);

  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!title.trim()) {
      setFormError("Informe o título.");
      return;
    }
    if (!phone.trim() && !url.trim()) {
      setFormError("Informe telefone ou URL.");
      return;
    }
    try {
      await create.mutateAsync({
        title: title.trim(),
        phone: phone.trim() || null,
        url: url.trim() || null,
        note: note.trim() || null,
      });
      setTitle("");
      setPhone("");
      setUrl("");
      setNote("");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Falha ao cadastrar recurso.",
      );
    }
  }

  if (!canView) {
    return (
      <ClinicPageFrame width="narrow">
        <p className="text-sm text-foreground/50">
          Sem permissão para ver recursos de crise.
        </p>
      </ClinicPageFrame>
    );
  }

  return (
    <ClinicPageFrame>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ClinicPageHeader
          eyebrow="RF-042"
          title={t.pages.crisis}
          description="Apoio não emergencial configurável. Pacientes veem estes canais no app. A plataforma nunca substitui SAMU/pronto-socorro."
        />

        {list.data?.disclaimer ? (
          <p className="text-xs text-foreground/45 mb-5 leading-relaxed rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-3">
            {list.data.disclaimer}
          </p>
        ) : null}

        {canManage && (
          <form
            onSubmit={handleCreate}
            className="mb-6 space-y-3 rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4"
          >
            <p className="text-sm font-medium text-foreground/75">
              Novo recurso da clínica
            </p>
            {formError && <ErrorMessage message={formError} />}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título (ex.: Plantão psicológico)"
              className="w-full rounded-lg border border-[var(--clinic-border)] bg-transparent px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefone"
                className="w-full rounded-lg border border-[var(--clinic-border)] bg-transparent px-3 py-2 text-sm"
              />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL (https://…)"
                className="w-full rounded-lg border border-[var(--clinic-border)] bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nota curta (opcional)"
              className="w-full rounded-lg border border-[var(--clinic-border)] bg-transparent px-3 py-2 text-sm"
            />
            <Button type="submit" isLoading={create.isPending} className="!rounded-lg !px-3 !py-2 text-xs">
              Cadastrar
            </Button>
          </form>
        )}

        {actionError && (
          <p className="text-xs text-red-400 mb-3">{actionError}</p>
        )}
        {list.isLoading && (
          <div className="h-24 rounded-xl bg-foreground/[0.06] animate-pulse" />
        )}
        {list.error && (
          <ErrorMessage
            message={
              list.error instanceof Error
                ? list.error.message
                : "Falha ao carregar recursos."
            }
            onRetry={() => list.refetch()}
          />
        )}

        <ul className="space-y-2">
          {(list.data?.resources ?? []).map((item, idx) => (
            <li
              key={item.id ?? `platform-${idx}`}
              className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground/85">
                    {item.title}
                    {!item.enabled ? (
                      <span className="ml-2 text-[10px] uppercase text-foreground/35">
                        desativado
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-foreground/40 mt-1">
                    {item.source === "PLATFORM" ? "Padrão da plataforma" : "Clínica"}
                    {item.phone ? ` · ${item.phone}` : ""}
                    {item.url ? ` · ${item.url}` : ""}
                  </p>
                  {item.note ? (
                    <p className="text-xs text-foreground/50 mt-1">{item.note}</p>
                  ) : null}
                </div>
                {canManage && item.id ? (
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      className="!rounded-lg !px-3 !py-2 text-xs"
                      onClick={async () => {
                        setActionError(null);
                        try {
                          await update.mutateAsync({
                            resourceId: item.id!,
                            payload: { enabled: !item.enabled },
                          });
                        } catch (err) {
                          setActionError(
                            err instanceof Error
                              ? err.message
                              : "Falha ao atualizar.",
                          );
                        }
                      }}
                    >
                      {item.enabled ? "Desativar" : "Ativar"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="!rounded-lg !px-3 !py-2 text-xs text-red-400"
                      onClick={async () => {
                        setActionError(null);
                        try {
                          await remove.mutateAsync(item.id!);
                        } catch (err) {
                          setActionError(
                            err instanceof Error
                              ? err.message
                              : "Falha ao remover.",
                          );
                        }
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </ClinicPageFrame>
  );
}
