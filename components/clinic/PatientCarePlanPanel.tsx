"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import {
  useActiveCarePlan,
  useCreateCarePlan,
  useCreateCarePlanItem,
  useDeleteCarePlanItem,
  useUpdateCarePlan,
  useUpdateCarePlanItem,
} from "@/hooks/use-care-plans";
import { useMyOrganizations } from "@/hooks/use-organizations";
import type { OrganizationRole } from "@anima/shared";
import { ApiError } from "@anima/shared";

type Props = {
  orgId: string;
  patientId: string;
};

export function PatientCarePlanPanel({ orgId, patientId }: Props) {
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );
  const canManage = role === "CLINIC_ADMIN" || role === "PROFESSIONAL";

  const { data, isLoading, error, refetch } = useActiveCarePlan(
    orgId,
    patientId,
  );
  const createPlan = useCreateCarePlan(orgId, patientId);
  const updatePlan = useUpdateCarePlan(orgId, patientId);
  const createItem = useCreateCarePlanItem(orgId, patientId);
  const updateItem = useUpdateCarePlanItem(orgId, patientId);
  const deleteItem = useDeleteCarePlanItem(orgId, patientId);

  const [title, setTitle] = useState("Plano de cuidado");
  const [itemTitle, setItemTitle] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  if (!canManage) return null;

  async function handleCreatePlan(e: FormEvent) {
    e.preventDefault();
    setActionError(null);
    try {
      await createPlan.mutateAsync({
        title,
        status: "ATIVO",
        startsOn: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao criar plano.",
      );
    }
  }

  async function handleAddItem(e: FormEvent) {
    e.preventDefault();
    if (!data?.plan) return;
    setActionError(null);
    try {
      await createItem.mutateAsync({
        planId: data.plan.id,
        payload: { title: itemTitle, kind: "ATIVIDADE" },
      });
      setItemTitle("");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao adicionar item.",
      );
    }
  }

  async function toggleRelease(itemId: string, released: boolean) {
    setActionError(null);
    try {
      await updateItem.mutateAsync({
        itemId,
        payload: { releasedToPatient: !released },
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao liberar item.",
      );
    }
  }

  async function activatePlan() {
    if (!data?.plan) return;
    setActionError(null);
    try {
      await updatePlan.mutateAsync({
        planId: data.plan.id,
        payload: { status: "ATIVO" },
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao ativar plano.",
      );
    }
  }

  return (
    <section className="mb-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground/70">
          Plano de cuidado
        </h2>
        <p className="text-xs text-[var(--clinic-muted)] mt-0.5 leading-relaxed">
          Convide o paciente a seguir o combinado entre sessões. Você monta o
          plano e libera no app só o que fizer sentido agora.
        </p>
      </div>

      {actionError && (
        <div className="mb-3">
          <ErrorMessage message={actionError} />
        </div>
      )}

      {error && (
        <div className="mb-3">
          <ErrorMessage
            message={
              error instanceof ApiError
                ? error.message
                : "Não foi possível carregar o plano."
            }
            onRetry={() => refetch()}
          />
        </div>
      )}

      {isLoading && (
        <div className="h-24 rounded-xl bg-foreground/[0.06] animate-pulse" />
      )}

      {!isLoading && !error && !data?.plan && (
        <form
          onSubmit={handleCreatePlan}
          className="rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4 sm:p-5 space-y-3"
        >
          <p className="text-xs text-[var(--clinic-muted)] leading-relaxed">
            Ainda não há plano ativo. Crie o primeiro para começar a adicionar
            atividades — e liberar no app quando estiver pronto para o paciente
            acompanhar.
          </p>
          <Input
            label="Título do plano"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Plano de acompanhamento — agosto"
            required
          />
          <p className="text-[11px] text-foreground/40 -mt-1">
            Nome que a equipe e o paciente reconhecem. Depois você libera cada
          item no ritmo do cuidado.
          </p>
          <Button
            type="submit"
            isLoading={createPlan.isPending}
            className="!rounded-lg !w-auto clinic-btn-primary"
          >
            Criar plano ativo
          </Button>
        </form>
      )}

      {!isLoading && data?.plan && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-foreground truncate">
                  {data.plan.title}
                </p>
                <p className="text-xs text-[var(--clinic-muted)] mt-1">
                  Status:{" "}
                  <span className="font-medium text-[var(--clinic-accent)]">
                    {data.plan.status}
                  </span>
                </p>
                {data.plan.summary && (
                  <p className="text-sm text-[var(--clinic-muted)] mt-2 leading-relaxed">
                    {data.plan.summary}
                  </p>
                )}
              </div>
              {data.plan.status !== "ATIVO" && (
                <Button
                  type="button"
                  variant="secondary"
                  className="!rounded-lg !w-auto clinic-btn-secondary shrink-0"
                  isLoading={updatePlan.isPending}
                  onClick={() => void activatePlan()}
                >
                  Ativar
                </Button>
              )}
            </div>
          </div>

          <form
            onSubmit={handleAddItem}
            className="rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4 space-y-3"
          >
            <p className="text-xs text-[var(--clinic-muted)] leading-relaxed">
              Novos itens começam só para a equipe. Quando quiser convidar o
              paciente a acompanhar, use{" "}
              <strong className="text-foreground/70">Liberar</strong>.
            </p>
            <Input
              label="Nova atividade / orientação"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder="Ex.: Caminhada 20 min, 3x na semana"
              required
            />
            <Button
              type="submit"
              className="!rounded-lg !w-auto clinic-btn-primary"
              isLoading={createItem.isPending}
            >
              Adicionar item
            </Button>
          </form>

          <ul className="space-y-2">
            {data.items.length === 0 && (
              <li className="rounded-xl border border-dashed border-[var(--clinic-border)] px-4 py-8 text-center text-sm text-[var(--clinic-muted)]">
                Nenhum item ainda. Adicione atividades ou orientações acima.
              </li>
            )}
            {data.items.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[var(--clinic-muted)] mt-1">
                    {item.kind} · {item.status} ·{" "}
                    {item.releasedToPatient ? (
                      <span className="text-[var(--clinic-accent)] font-medium">
                        Liberado ao paciente
                      </span>
                    ) : (
                      "Privado ao staff"
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="secondary"
                    className="!rounded-lg !w-auto clinic-btn-secondary !px-3 !py-2 text-xs"
                    disabled={updateItem.isPending}
                    onClick={() =>
                      void toggleRelease(item.id, item.releasedToPatient)
                    }
                  >
                    {item.releasedToPatient ? "Ocultar" : "Liberar"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="!rounded-lg !w-auto !px-3 !py-2 text-xs"
                    disabled={deleteItem.isPending}
                    onClick={() => void deleteItem.mutateAsync(item.id)}
                  >
                    Remover
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
