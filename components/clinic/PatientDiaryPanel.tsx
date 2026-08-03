"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SharedDiaryList } from "@/components/care/SharedDiaryList";
import { usePatientDiary } from "@/hooks/use-patient-diary";
import { useMyOrganizations } from "@/hooks/use-organizations";
import type { OrganizationRole } from "@anima/shared";
import { ApiError } from "@anima/shared";

type Props = {
  orgId: string;
  patientId: string;
};

export function PatientDiaryPanel({ orgId, patientId }: Props) {
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );

  const canAccess = role === "CLINIC_ADMIN" || role === "PROFESSIONAL";
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = usePatientDiary(
    orgId,
    patientId,
    { page, limit: 10 },
  );

  if (!canAccess) {
    return null;
  }

  const entries = data?.data ?? [];
  const meta = data?.meta;
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Não foi possível carregar o diário.";

  return (
    <section className="mb-6">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground/60">
          Diário / check-ins
        </h2>
        <p className="text-xs text-foreground/35 mt-0.5">
          Somente leitura · requer vínculo app + consentimento DIARIO_CHECKIN
        </p>
      </div>

      {error && (
        <div className="mb-3">
          <ErrorMessage message={errorMessage} onRetry={() => refetch()} />
        </div>
      )}

      {isLoading && (
        <div className="h-28 rounded-xl bg-foreground/[0.06] animate-pulse" />
      )}

      {!isLoading && !error && (
        <>
          <SharedDiaryList entries={entries} />
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 mt-3">
              <Button
                type="button"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <span className="text-[11px] text-foreground/40">
                Página {meta.page} de {meta.totalPages}
              </span>
              <Button
                type="button"
                variant="ghost"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
