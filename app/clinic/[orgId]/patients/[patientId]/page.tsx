"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Select } from "@/components/ui/Select";
import {
  PatientStatusBadge,
  STATUS_LABELS,
} from "@/components/clinic/PatientStatusBadge";
import { PatientConsentsPanel } from "@/components/clinic/PatientConsentsPanel";
import { PatientClinicalNotesPanel } from "@/components/clinic/PatientClinicalNotesPanel";
import { PatientDiaryPanel } from "@/components/clinic/PatientDiaryPanel";
import { PatientRemindersPanel } from "@/components/clinic/PatientRemindersPanel";
import { PatientCarePlanPanel } from "@/components/clinic/PatientCarePlanPanel";
import { PatientAiSynthesesPanel } from "@/components/clinic/PatientAiSynthesesPanel";
import { usePatient, useUpdatePatientStatus } from "@/hooks/use-patients";
import type { PatientStatus } from "@anima/shared";

export default function PatientDetailPage() {
  const params = useParams<{ orgId: string; patientId: string }>();
  const { orgId, patientId } = params;
  const { data, isLoading, error, refetch } = usePatient(orgId, patientId);
  const updateStatus = useUpdatePatientStatus(orgId, patientId);
  const [status, setStatus] = useState<PatientStatus | "">("");
  const [reason, setReason] = useState("");
  const [statusError, setStatusError] = useState<string | null>(null);

  async function handleStatus(e: FormEvent) {
    e.preventDefault();
    setStatusError(null);
    if (!status) {
      setStatusError("Selecione o novo status.");
      return;
    }
    try {
      await updateStatus.mutateAsync({
        status,
        reason: reason.trim() || undefined,
      });
      setReason("");
      setStatus("");
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : "Falha ao atualizar status.",
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href={`/clinic/${orgId}/patients`}
          className="text-sm text-foreground/40 hover:text-anima-violet mb-4 inline-block"
        >
          ← Pacientes
        </Link>

        {error && (
          <ErrorMessage
            message="Não foi possível carregar o paciente."
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
                  {data.fullName}
                </h1>
                <p className="text-sm text-foreground/40">
                  {[data.email, data.phone].filter(Boolean).join(" · ") ||
                    "Sem contato cadastrado"}
                </p>
              </div>
              <PatientStatusBadge status={data.status} />
            </div>

            {data.operationalNotes && (
              <div className="glass-panel p-5 mb-4">
                <p className="text-xs uppercase tracking-wide text-foreground/35 mb-2">
                  Notas operacionais
                </p>
                <p className="text-sm text-foreground/70 whitespace-pre-wrap">
                  {data.operationalNotes}
                </p>
              </div>
            )}

            <form
              onSubmit={handleStatus}
              className="glass-panel p-5 space-y-3 mb-6"
            >
              <h2 className="text-base font-semibold text-foreground/80">
                Alterar status do funil
              </h2>
              <Select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as PatientStatus | "")
                }
              >
                <option value="">Selecione...</option>
                {(Object.keys(STATUS_LABELS) as PatientStatus[])
                  .filter((s) => s !== data.status)
                  .map((key) => (
                    <option key={key} value={key}>
                      {STATUS_LABELS[key]}
                    </option>
                  ))}
              </Select>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder="Motivo (opcional)"
                className="w-full rounded-xl px-4 py-3 text-sm bg-foreground/[0.03] border border-foreground/[0.08] text-foreground/90"
              />
              {statusError && (
                <p className="text-xs text-red-400">{statusError}</p>
              )}
              <Button type="submit" isLoading={updateStatus.isPending}>
                Salvar status
              </Button>
            </form>

            <PatientConsentsPanel orgId={orgId} patientId={patientId} />

            <PatientDiaryPanel orgId={orgId} patientId={patientId} />

            <PatientRemindersPanel orgId={orgId} patientId={patientId} />

            <PatientCarePlanPanel orgId={orgId} patientId={patientId} />

            <PatientAiSynthesesPanel orgId={orgId} patientId={patientId} />

            <PatientClinicalNotesPanel orgId={orgId} patientId={patientId} />

            {data.contacts.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-foreground/60 mb-3">
                  Contatos / responsáveis
                </h2>
                <ul className="space-y-2">
                  {data.contacts.map((contact) => (
                    <li key={contact.id} className="glass-panel p-4 text-sm">
                      <p className="font-medium text-foreground/80">
                        {contact.name}
                        {contact.isEmergencyContact ? " · emergência" : ""}
                      </p>
                      <p className="text-xs text-foreground/40 mt-0.5">
                        {[contact.relationship, contact.email, contact.phone]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {data.statusHistory.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-foreground/60 mb-3">
                  Histórico de status
                </h2>
                <ul className="space-y-2">
                  {data.statusHistory.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl border border-foreground/[0.06] px-4 py-3 text-sm"
                    >
                      <p className="text-foreground/75">
                        {item.fromStatus
                          ? `${STATUS_LABELS[item.fromStatus]} → ${STATUS_LABELS[item.toStatus]}`
                          : STATUS_LABELS[item.toStatus]}
                      </p>
                      <p className="text-[11px] text-foreground/35 mt-1">
                        {item.changedByNome || "Sistema"} ·{" "}
                        {new Date(item.criadoEm).toLocaleString("pt-BR")}
                        {item.reason ? ` · ${item.reason}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
