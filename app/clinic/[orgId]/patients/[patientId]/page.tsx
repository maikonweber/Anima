"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Select } from "@/components/ui/Select";
import {
  PatientStatusBadge,
  STATUS_LABELS,
} from "@/components/clinic/PatientStatusBadge";
import { PatientConsentsPanel } from "@/components/clinic/PatientConsentsPanel";
import { PatientAppLinkPanel } from "@/components/clinic/PatientAppLinkPanel";
import { PatientClinicalNotesPanel } from "@/components/clinic/PatientClinicalNotesPanel";
import { PatientDiaryPanel } from "@/components/clinic/PatientDiaryPanel";
import { PatientRemindersPanel } from "@/components/clinic/PatientRemindersPanel";
import { PatientCarePlanPanel } from "@/components/clinic/PatientCarePlanPanel";
import { PatientAiSynthesesPanel } from "@/components/clinic/PatientAiSynthesesPanel";
import { PatientClinicalAlertsPanel } from "@/components/clinic/PatientClinicalAlertsPanel";
import { ClinicToolHelp } from "@/components/clinic/ClinicToolHelp";
import { getClinicUiDictionary } from "@/lib/i18n/clinic-ui-dictionary";
import { useLocale } from "@/lib/i18n/locale-provider";
import { useMyOrganizations } from "@/hooks/use-organizations";
import {
  useDeletePatient,
  usePatient,
  useUpdatePatientStatus,
} from "@/hooks/use-patients";
import type { OrganizationRole, PatientStatus } from "@anima/shared";

type TabId =
  | "resumo"
  | "diario"
  | "plano"
  | "ia"
  | "prontuario"
  | "alertas";

const TAB_IDS: TabId[] = [
  "resumo",
  "diario",
  "plano",
  "alertas",
  "ia",
  "prontuario",
];

export default function PatientDetailPage() {
  const params = useParams<{ orgId: string; patientId: string }>();
  const { orgId, patientId } = params;
  const router = useRouter();
  const { locale, localizedHref } = useLocale();
  const tabs = getClinicUiDictionary(locale).patientTabs;
  const tabItems: Array<{ id: TabId; label: string }> = [
    { id: "resumo", label: tabs.summary },
    { id: "diario", label: tabs.diary },
    { id: "plano", label: tabs.carePlan },
    { id: "alertas", label: tabs.alerts },
    { id: "ia", label: tabs.syntheses },
    { id: "prontuario", label: tabs.notes },
  ];
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );
  const canDelete = role === "CLINIC_ADMIN";
  const { data, isLoading, error, refetch } = usePatient(orgId, patientId);
  const updateStatus = useUpdatePatientStatus(orgId, patientId);
  const deletePatient = useDeletePatient(orgId);
  const [status, setStatus] = useState<PatientStatus | "">("");
  const [reason, setReason] = useState("");
  const [statusError, setStatusError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tab, setTab] = useState<TabId>("resumo");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as TabId;
    if (TAB_IDS.includes(hash)) setTab(hash);
  }, []);

  function selectTab(next: TabId) {
    setTab(next);
    window.history.replaceState(null, "", `#${next}`);
  }

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

  async function handleDelete() {
    setDeleteError(null);
    try {
      await deletePatient.mutateAsync(patientId);
      router.push(localizedHref(`/clinic/${orgId}/patients`));
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Não foi possível remover o paciente.",
      );
      setConfirmDelete(false);
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
          href={localizedHref(`/clinic/${orgId}/patients`)}
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
            <div className="flex items-start justify-between gap-3 mb-4">
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

            <nav className="flex gap-1 overflow-x-auto pb-2 mb-5 border-b border-foreground/[0.06]">
              {tabItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectTab(item.id)}
                  className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    tab === item.id
                      ? "bg-foreground/[0.08] text-foreground/85"
                      : "text-foreground/40 hover:text-foreground/70"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <ClinicToolHelp tab={tab} key={tab} />

            {tab === "resumo" && (
              <>
                <PatientAppLinkPanel orgId={orgId} patient={data} />

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
                  <p className="text-xs text-foreground/40 -mt-1 mb-1 leading-relaxed">
                    Acompanhe a jornada do paciente no funil da clínica. Manter o
                    status atualizado ajuda a equipe a priorizar o próximo passo.
                  </p>
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
                  <section className="mb-6">
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

                {canDelete && (
                  <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5 space-y-3">
                    <div>
                      <h2 className="text-base font-semibold text-red-700/90">
                        Remover paciente
                      </h2>
                      <p className="text-xs text-foreground/45 mt-1 leading-relaxed">
                        Remove o paciente da listagem do CRM (inativação lógica).
                        O histórico permanece na auditoria. Apenas administradores
                        da clínica podem fazer isso.
                      </p>
                    </div>
                    {deleteError && (
                      <p className="text-xs text-red-500">{deleteError}</p>
                    )}
                    {!confirmDelete ? (
                      <Button
                        type="button"
                        variant="secondary"
                        className="!w-auto !text-red-700 !border-red-500/25 hover:!bg-red-500/10"
                        onClick={() => setConfirmDelete(true)}
                      >
                        Remover paciente
                      </Button>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          isLoading={deletePatient.isPending}
                          className="!w-auto !bg-red-700 hover:!bg-red-800 !from-red-700 !to-red-800"
                          onClick={() => void handleDelete()}
                        >
                          Confirmar remoção
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="!w-auto"
                          disabled={deletePatient.isPending}
                          onClick={() => setConfirmDelete(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </section>
                )}
              </>
            )}

            {tab === "diario" && (
              <>
                <PatientDiaryPanel orgId={orgId} patientId={patientId} />
                <PatientRemindersPanel orgId={orgId} patientId={patientId} />
              </>
            )}

            {tab === "plano" && (
              <PatientCarePlanPanel orgId={orgId} patientId={patientId} />
            )}

            {tab === "alertas" && (
              <PatientClinicalAlertsPanel orgId={orgId} patientId={patientId} />
            )}

            {tab === "ia" && (
              <PatientAiSynthesesPanel orgId={orgId} patientId={patientId} />
            )}

            {tab === "prontuario" && (
              <PatientClinicalNotesPanel orgId={orgId} patientId={patientId} />
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
