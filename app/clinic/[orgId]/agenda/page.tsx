"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  AppointmentStatusBadge,
  APPOINTMENT_STATUS_LABELS,
  MODALITY_LABELS,
  formatDateTime,
} from "@/components/clinic/AppointmentStatusBadge";
import { ClinicPagination } from "@/components/clinic/ClinicPagination";
import {
  ClinicPageFrame,
  ClinicPageHeader,
} from "@/components/clinic/ClinicPageFrame";
import { useAppointments } from "@/hooks/use-agenda";
import { usePatients } from "@/hooks/use-patients";
import type { AppointmentStatus } from "@anima/shared";

const STATUS_FILTERS: Array<AppointmentStatus | "ALL"> = [
  "ALL",
  "AGENDADA",
  "CONFIRMADA",
  "REMARCADA",
  "CANCELADA",
  "CONCLUIDA",
  "NO_SHOW",
];

export default function AgendaPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const [status, setStatus] = useState<AppointmentStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const range = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() - 7);
    from.setHours(0, 0, 0, 0);
    const to = new Date();
    to.setDate(to.getDate() + 45);
    to.setHours(23, 59, 59, 999);
    return { from: from.toISOString(), to: to.toISOString() };
  }, []);

  const query = useMemo(
    () => ({
      ...range,
      status: status === "ALL" ? undefined : status,
      page,
      limit: 20,
    }),
    [range, status, page],
  );

  const { data, isLoading, error, refetch } = useAppointments(orgId, query);
  const patientsQuery = usePatients(orgId, { limit: 100, page: 1 });

  const patientNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const patient of patientsQuery.data?.items ?? []) {
      map.set(patient.id, patient.fullName);
    }
    return map;
  }, [patientsQuery.data]);

  return (
    <ClinicPageFrame>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ClinicPageHeader
          eyebrow="Operação"
          title="Agenda"
          description="Sessões da clínica (últimos 7 dias → próximos 45)"
          actions={
            <>
              <Link href={`/clinic/${orgId}/agenda/disponibilidade`}>
                <Button
                  type="button"
                  variant="secondary"
                  className="!rounded-lg !px-3 !py-2 text-xs"
                >
                  Disponibilidade
                </Button>
              </Link>
              <Link href={`/clinic/${orgId}/agenda/new`}>
                <Button type="button" className="!rounded-lg !px-3 !py-2 text-xs">
                  Nova sessão
                </Button>
              </Link>
            </>
          }
        />

        <div className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-[var(--clinic-border)]">
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setPage(1);
                    setStatus(item);
                  }}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    status === item
                      ? "bg-[var(--clinic-accent-soft)] text-[var(--clinic-accent)]"
                      : "text-foreground/45 hover:bg-foreground/[0.04] hover:text-foreground/70"
                  }`}
                >
                  {item === "ALL" ? "Todas" : APPOINTMENT_STATUS_LABELS[item]}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4">
              <ErrorMessage
                message="Não foi possível carregar a agenda."
                onRetry={() => refetch()}
              />
            </div>
          )}

          {isLoading && (
            <div className="divide-y divide-[var(--clinic-border)]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 px-4 flex items-center gap-4 animate-pulse"
                >
                  <div className="h-3 w-36 rounded bg-foreground/[0.06]" />
                  <div className="h-3 w-24 rounded bg-foreground/[0.04] ml-auto" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && data?.items.length === 0 && (
            <div className="px-4 py-12 text-center">
              <h3 className="text-base font-semibold text-foreground/70 mb-1">
                Nenhuma sessão neste período
              </h3>
              <p className="text-sm text-foreground/40 mb-4">
                Agende a primeira sessão com um paciente do CRM.
              </p>
              <Link href={`/clinic/${orgId}/agenda/new`}>
                <Button type="button" className="w-auto mx-auto !rounded-lg">
                  Agendar sessão
                </Button>
              </Link>
            </div>
          )}

          {!isLoading && !error && data && data.items.length > 0 && (
            <>
              <div className="hidden sm:grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_7.5rem_1.25rem] gap-3 px-4 py-2 text-[10px] uppercase tracking-wider text-foreground/35 border-b border-[var(--clinic-border)] bg-foreground/[0.015]">
                <span>Paciente</span>
                <span>Horário</span>
                <span>Status</span>
                <span />
              </div>
              <ul className="divide-y divide-[var(--clinic-border)]">
                {data.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/clinic/${orgId}/agenda/${item.id}`}
                      className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_7.5rem_1.25rem] gap-1 sm:gap-3 items-center px-3 sm:px-4 py-2.5 hover:bg-[var(--clinic-row-hover)] transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground/85 truncate">
                          {patientNameById.get(item.patientId) ?? "Paciente"}
                        </p>
                        <p className="sm:hidden text-xs text-foreground/40 mt-0.5 truncate">
                          {formatDateTime(item.startsAt)} ·{" "}
                          {MODALITY_LABELS[item.modality]}
                        </p>
                      </div>
                      <p className="hidden sm:block text-xs text-foreground/45 truncate">
                        {formatDateTime(item.startsAt)} ·{" "}
                        {MODALITY_LABELS[item.modality]}
                      </p>
                      <div>
                        <AppointmentStatusBadge status={item.status} />
                      </div>
                      <span className="hidden sm:block text-foreground/25 text-sm text-right">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {data && !error && (
            <div className="px-3 sm:px-4 pb-4">
              <ClinicPagination
                page={data.page}
                totalPages={Math.max(data.totalPages, 1)}
                total={data.total}
                limit={data.limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </motion.div>
    </ClinicPageFrame>
  );
}
