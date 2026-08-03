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
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground/60">
          Plano de cuidado
        </h2>
        <p className="text-xs text-foreground/35 mt-0.5">
          Itens só aparecem para o paciente quando liberados
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
        <form onSubmit={handleCreatePlan} className="glass-panel p-4 space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do plano"
            required
          />
          <Button type="submit" isLoading={createPlan.isPending} className="w-auto">
            Criar plano ativo
          </Button>
        </form>
      )}

      {!isLoading && data?.plan && (
        <div className="space-y-4">
          <div className="glass-panel p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground/80">
                  {data.plan.title}
                </p>
                <p className="text-[11px] text-foreground/40 mt-1">
                  Status: {data.plan.status}
                </p>
                {data.plan.summary && (
                  <p className="text-xs text-foreground/50 mt-2">
                    {data.plan.summary}
                  </p>
                )}
              </div>
              {data.plan.status !== "ATIVO" && (
                <Button
                  type="button"
                  variant="secondary"
                  className="w-auto"
                  isLoading={updatePlan.isPending}
                  onClick={() => void activatePlan()}
                >
                  Ativar
                </Button>
              )}
            </div>
          </div>

          <form onSubmit={handleAddItem} className="flex gap-2">
            <Input
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder="Nova atividade / orientação"
              required
            />
            <Button
              type="submit"
              className="w-auto shrink-0"
              isLoading={createItem.isPending}
            >
              Adicionar
            </Button>
          </form>

          <ul className="space-y-2">
            {data.items.length === 0 && (
              <li className="text-xs text-foreground/40">Nenhum item ainda.</li>
            )}
            {data.items.map((item) => (
              <li
                key={item.id}
                className="glass-panel p-3 flex flex-wrap items-center justify-between gap-2"
              >
                <div>
                  <p className="text-sm text-foreground/75">{item.title}</p>
                  <p className="text-[11px] text-foreground/40 mt-0.5">
                    {item.kind} · {item.status} ·{" "}
                    {item.releasedToPatient ? "Liberado" : "Privado ao staff"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-auto"
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
                    className="w-auto"
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
