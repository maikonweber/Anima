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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href={`/clinic/${orgId}`}
          className="text-sm text-foreground/40 hover:text-anima-violet mb-4 inline-block"
        >
          ← Clínica
        </Link>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
              Agenda
            </h1>
            <p className="text-sm text-foreground/40">
              Sessões da clínica (últimos 7 dias → próximos 45)
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href={`/clinic/${orgId}/agenda/new`}>
              <Button type="button" className="w-auto whitespace-nowrap">
                Nova sessão
              </Button>
            </Link>
            <Link href={`/clinic/${orgId}/agenda/disponibilidade`}>
              <Button
                type="button"
                variant="secondary"
                className="w-auto whitespace-nowrap"
              >
                Disponibilidade
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setPage(1);
                setStatus(item);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                status === item
                  ? "bg-anima-violet/15 text-anima-violet"
                  : "bg-foreground/[0.04] text-foreground/45 hover:text-foreground/70"
              }`}
            >
              {item === "ALL" ? "Todas" : APPOINTMENT_STATUS_LABELS[item]}
            </button>
          ))}
        </div>

        {error && (
          <ErrorMessage
            message="Não foi possível carregar a agenda."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-foreground/[0.06] animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && !error && data?.items.length === 0 && (
          <div className="glass-panel p-10 text-center">
            <h3 className="text-base font-semibold text-foreground/70 mb-2">
              Nenhuma sessão neste período
            </h3>
            <p className="text-sm text-foreground/40 mb-4">
              Agende a primeira sessão com um paciente do CRM.
            </p>
            <Link href={`/clinic/${orgId}/agenda/new`}>
              <Button type="button" className="w-auto mx-auto">
                Agendar sessão
              </Button>
            </Link>
          </div>
        )}

        <ul className="space-y-3">
          {data?.items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/clinic/${orgId}/agenda/${item.id}`}
                className="block glass-panel p-5 hover:scale-[1.01] transition-transform duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground/85">
                      {patientNameById.get(item.patientId) ?? "Paciente"}
                    </p>
                    <p className="text-xs text-foreground/40 mt-0.5">
                      {formatDateTime(item.startsAt)} ·{" "}
                      {MODALITY_LABELS[item.modality]}
                    </p>
                  </div>
                  <AppointmentStatusBadge status={item.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              type="button"
              variant="secondary"
              className="w-auto"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <span className="text-xs text-foreground/40">
              Página {data.page} de {data.totalPages}
            </span>
            <Button
              type="button"
              variant="secondary"
              className="w-auto"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
