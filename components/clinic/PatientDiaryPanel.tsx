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

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

const RANGE_PRESETS: { label: string; days: number | null }[] = [
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
  { label: "Tudo", days: null },
];

export function PatientDiaryPanel({ orgId, patientId }: Props) {
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );

  const canAccess = role === "CLINIC_ADMIN" || role === "PROFESSIONAL";
  const [page, setPage] = useState(1);
  const [rangeDays, setRangeDays] = useState<number | null>(30);

  const query = useMemo(
    () => ({
      page,
      limit: 10,
      from: rangeDays != null ? daysAgoIso(rangeDays) : undefined,
    }),
    [page, rangeDays],
  );

  const { data, isLoading, error, refetch } = usePatientDiary(
    orgId,
    patientId,
    query,
  );

  if (!canAccess) {
    return null;
  }

  const entries = data?.data ?? [];
  const meta = data?.meta;
  const isUnlinked =
    error instanceof ApiError && /sem v[ií]nculo|vinculo/i.test(error.message);
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Não foi possível carregar o diário.";

  return (
    <section className="mb-6">
      <div className="mb-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
        <h2 className="text-sm font-semibold text-foreground/60">
          Diário / check-ins
        </h2>
        <p className="text-xs text-foreground/35 mt-0.5 leading-relaxed">
          Somente leitura · só itens que o paciente compartilhou · exige vínculo
          com o app e consentimento DIARIO_CHECKIN
        </p>
        </div>
        {!isUnlinked && (
          <div className="flex flex-wrap gap-1.5">
            {RANGE_PRESETS.map((preset) => {
              const active = rangeDays === preset.days;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setPage(1);
                    setRangeDays(preset.days);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    active
                      ? "border-[var(--clinic-accent)] bg-[var(--clinic-accent-soft)] text-[var(--clinic-accent)]"
                      : "border-[var(--clinic-border)] text-foreground/40 hover:text-foreground/65"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {isUnlinked && (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-4 mb-3">
          <p className="text-sm font-medium text-foreground/80 mb-1">
            Paciente ainda sem vínculo com o app
          </p>
          <p className="text-xs text-foreground/50 leading-relaxed">
            No resumo do paciente, vincule o e-mail da conta EmotiveCare. Depois
            registre o consentimento DIARIO_CHECKIN para ver os check-ins
            compartilhados.
          </p>
        </div>
      )}

      {error && !isUnlinked && (
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
