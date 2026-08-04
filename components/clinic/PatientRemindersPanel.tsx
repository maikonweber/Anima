"use client";

import { useMemo } from "react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  usePatientMedications,
  usePatientReminderHistory,
} from "@/hooks/use-reminders";
import { useMyOrganizations } from "@/hooks/use-organizations";
import type { OrganizationRole } from "@anima/shared";
import { ApiError } from "@anima/shared";

type Props = {
  orgId: string;
  patientId: string;
};

export function PatientRemindersPanel({ orgId, patientId }: Props) {
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );

  const canAccess = role === "CLINIC_ADMIN" || role === "PROFESSIONAL";
  const meds = usePatientMedications(orgId, patientId);
  const history = usePatientReminderHistory(orgId, patientId, 14, canAccess);

  if (!canAccess) return null;

  const historyBlocked =
    history.error instanceof ApiError && history.error.status === 403;

  return (
    <section className="mb-6">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground/60">
          Lembretes / adesão
        </h2>
        <p className="text-xs text-foreground/35 mt-0.5 leading-relaxed">
          Visão da adesão autorreportada pelo paciente. A clínica não altera doses
          nem prescritos — histórico exige consentimento LEMBRETES.
        </p>
      </div>

      <div className="glass-panel p-4 mb-3 border border-amber-500/15">
        <p className="text-[11px] text-foreground/50 leading-relaxed">
          {meds.data?.disclaimer ??
            "O sistema não prescreve nem altera doses; registros são autorreportados."}
        </p>
      </div>

      {meds.isLoading && (
        <div className="h-20 rounded-xl bg-foreground/[0.06] animate-pulse mb-3" />
      )}
      {meds.error && (
        <div className="mb-3">
          <ErrorMessage
            message={
              meds.error instanceof Error
                ? meds.error.message
                : "Falha ao carregar medicações."
            }
            onRetry={() => meds.refetch()}
          />
        </div>
      )}
      {!meds.isLoading && !meds.error && (
        <ul className="space-y-2 mb-4">
          {(meds.data?.data ?? []).length === 0 ? (
            <li className="text-xs text-foreground/40">
              Nenhuma medicação registrada pelo paciente.
            </li>
          ) : (
            (meds.data?.data ?? []).map((med) => (
              <li key={med.id} className="glass-panel p-3">
                <p className="text-sm text-foreground/75">
                  {med.name} · {med.dose}
                </p>
                <p className="text-[11px] text-foreground/40 mt-1">
                  {med.schedule.times.join(", ")} · {med.status}
                </p>
              </li>
            ))
          )}
        </ul>
      )}

      <p className="text-xs font-medium text-foreground/50 mb-2">
        Histórico recente
      </p>
      {historyBlocked && (
        <p className="text-xs text-foreground/40">
          Paciente sem consentimento LEMBRETES ativo — histórico oculto.
        </p>
      )}
      {!historyBlocked && history.isLoading && (
        <div className="h-16 rounded-xl bg-foreground/[0.06] animate-pulse" />
      )}
      {!historyBlocked && history.error && (
        <ErrorMessage
          message={
            history.error instanceof Error
              ? history.error.message
              : "Falha ao carregar histórico."
          }
          onRetry={() => history.refetch()}
        />
      )}
      {!historyBlocked && !history.isLoading && !history.error && (
        <ul className="space-y-1">
          {(history.data ?? []).slice(0, 8).map((item) => (
            <li
              key={item.id}
              className="flex justify-between gap-2 text-[11px] text-foreground/50 py-1"
            >
              <span>{new Date(item.dueAt).toLocaleString("pt-BR")}</span>
              <span>{item.status}</span>
            </li>
          ))}
          {(history.data ?? []).length === 0 && (
            <li className="text-xs text-foreground/40">Sem respostas ainda.</li>
          )}
        </ul>
      )}
    </section>
  );
}
