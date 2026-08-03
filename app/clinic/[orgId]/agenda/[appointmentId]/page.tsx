"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  AppointmentStatusBadge,
  APPOINTMENT_STATUS_LABELS,
  MODALITY_LABELS,
  formatDateTime,
  localInputToIso,
  toLocalInputValue,
} from "@/components/clinic/AppointmentStatusBadge";
import { useAppointment, useUpdateAppointment } from "@/hooks/use-agenda";
import { usePatient } from "@/hooks/use-patients";
import type { AppointmentStatus } from "@anima/shared";

export default function AppointmentDetailPage() {
  const params = useParams<{ orgId: string; appointmentId: string }>();
  const { orgId, appointmentId } = params;
  const { data, isLoading, error, refetch } = useAppointment(
    orgId,
    appointmentId,
  );
  const updateAppointment = useUpdateAppointment(orgId, appointmentId);
  const patientQuery = usePatient(orgId, data?.patientId ?? "");

  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setStartsAt(toLocalInputValue(new Date(data.startsAt)));
    setEndsAt(toLocalInputValue(new Date(data.endsAt)));
  }, [data]);

  async function runUpdate(
    payload: Parameters<typeof updateAppointment.mutateAsync>[0],
  ) {
    setActionError(null);
    try {
      await updateAppointment.mutateAsync(payload);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao atualizar sessão.",
      );
    }
  }

  async function handleReschedule(e: FormEvent) {
    e.preventDefault();
    await runUpdate({
      startsAt: localInputToIso(startsAt),
      endsAt: localInputToIso(endsAt),
    });
  }

  const canManage =
    data &&
    (data.status === "AGENDADA" ||
      data.status === "CONFIRMADA" ||
      data.status === "REMARCADA");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href={`/clinic/${orgId}/agenda`}
          className="text-sm text-foreground/40 hover:text-anima-violet mb-4 inline-block"
        >
          ← Agenda
        </Link>

        {error && (
          <ErrorMessage
            message="Não foi possível carregar a sessão."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="h-40 rounded-2xl bg-foreground/[0.06] animate-pulse" />
        )}

        {data && (
          <>
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
                  {patientQuery.data?.fullName ?? "Sessão"}
                </h1>
                <p className="text-sm text-foreground/40">
                  {formatDateTime(data.startsAt)} ·{" "}
                  {MODALITY_LABELS[data.modality]}
                </p>
              </div>
              <AppointmentStatusBadge status={data.status} />
            </div>

            <div className="glass-panel p-5 space-y-2 mb-6 text-sm text-foreground/70">
              <p>
                <span className="text-foreground/40">Status:</span>{" "}
                {APPOINTMENT_STATUS_LABELS[data.status as AppointmentStatus]}
              </p>
              {data.locationOrLink && (
                <p>
                  <span className="text-foreground/40">Local/link:</span>{" "}
                  {data.locationOrLink}
                </p>
              )}
              {data.operationalNotes && (
                <p className="whitespace-pre-wrap">
                  <span className="text-foreground/40">Notas:</span>{" "}
                  {data.operationalNotes}
                </p>
              )}
              {data.cancelReason && (
                <p>
                  <span className="text-foreground/40">Cancelamento:</span>{" "}
                  {data.cancelReason}
                </p>
              )}
            </div>

            {canManage && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {data.status !== "CONFIRMADA" && (
                    <Button
                      type="button"
                      className="w-auto"
                      isLoading={updateAppointment.isPending}
                      onClick={() => runUpdate({ status: "CONFIRMADA" })}
                    >
                      Confirmar
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-auto"
                    isLoading={updateAppointment.isPending}
                    onClick={() => runUpdate({ status: "CONCLUIDA" })}
                  >
                    Marcar concluída
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-auto"
                    isLoading={updateAppointment.isPending}
                    onClick={() => runUpdate({ status: "NO_SHOW" })}
                  >
                    Registrar falta
                  </Button>
                </div>

                <form
                  onSubmit={handleReschedule}
                  className="glass-panel p-5 space-y-3"
                >
                  <h2 className="text-base font-semibold text-foreground/80">
                    Remarcar
                  </h2>
                  <Input
                    label="Novo início"
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    required
                  />
                  <Input
                    label="Novo fim"
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    required
                  />
                  <Button type="submit" isLoading={updateAppointment.isPending}>
                    Salvar remarcação
                  </Button>
                </form>

                <div className="glass-panel p-5 space-y-3">
                  <h2 className="text-base font-semibold text-foreground/80">
                    Cancelar
                  </h2>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={2}
                    placeholder="Motivo (opcional)"
                    className="w-full rounded-xl px-4 py-3 text-sm bg-foreground/[0.03] border border-foreground/[0.08] text-foreground/90"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    isLoading={updateAppointment.isPending}
                    onClick={() =>
                      runUpdate({
                        status: "CANCELADA",
                        cancelReason: cancelReason.trim() || undefined,
                      })
                    }
                  >
                    Cancelar sessão
                  </Button>
                </div>
              </div>
            )}

            {actionError && (
              <p className="text-xs text-red-400 mt-4">{actionError}</p>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
