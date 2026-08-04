"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  useApproveClinicalAlert,
  usePatientClinicalAlerts,
  useRejectClinicalAlert,
  useScanClinicalAlerts,
  useUpdateClinicalAlert,
} from "@/hooks/use-clinical-alerts";
import { useMyOrganizations } from "@/hooks/use-organizations";
import type { ClinicalAlert, OrganizationRole } from "@anima/shared";
import { ApiError } from "@anima/shared";

type Props = {
  orgId: string;
  patientId: string;
};

const STATUS_LABEL: Record<ClinicalAlert["status"], string> = {
  PENDENTE_REVISAO: "Pendente",
  APROVADA: "Aprovada",
  REJEITADA: "Rejeitada",
  ARQUIVADA: "Arquivada",
};

export function PatientClinicalAlertsPanel({ orgId, patientId }: Props) {
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );
  const canAccess = role === "CLINIC_ADMIN" || role === "PROFESSIONAL";

  const list = usePatientClinicalAlerts(orgId, patientId, {}, canAccess);
  const scan = useScanClinicalAlerts(orgId, patientId);
  const update = useUpdateClinicalAlert(orgId, patientId);
  const approve = useApproveClinicalAlert(orgId, patientId);
  const reject = useRejectClinicalAlert(orgId, patientId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!canAccess) return null;

  const consentBlocked =
    list.error instanceof ApiError && list.error.status === 403;

  async function handleScan() {
    setActionError(null);
    setSuccessMsg(null);
    try {
      const result = await scan.mutateAsync();
      setSuccessMsg(result.message);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao varrer alertas.",
      );
    }
  }

  async function handleSaveEdit(alertId: string) {
    setActionError(null);
    try {
      await update.mutateAsync({
        alertId,
        payload: { editedMessage: editMessage.trim() },
      });
      setEditingId(null);
      setSuccessMsg("Alerta atualizado.");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao salvar.",
      );
    }
  }

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground/60">
            Alertas revisáveis
          </h2>
          <p className="text-xs text-foreground/35 mt-0.5 leading-relaxed">
            Deixe a plataforma destacar padrões no diário compartilhado. Revise,
            ajuste e aprove com critério humano — para chegar à próxima sessão
            com mais contexto.
          </p>
        </div>
        {!consentBlocked && (
          <Button
            type="button"
            variant="secondary"
            isLoading={scan.isPending}
            onClick={() => void handleScan()}
            className="!rounded-lg !px-3 !py-2 text-xs shrink-0"
          >
            Varrer padrões
          </Button>
        )}
      </div>

      <div className="glass-panel p-4 mb-3 border border-amber-500/15">
        <p className="text-[11px] text-foreground/50 leading-relaxed">
          Alertas não são emergência, diagnóstico nem disparo automático. Revise
          antes de considerar clinicamente.
        </p>
      </div>

      {consentBlocked && (
        <p className="text-xs text-foreground/45 mb-3">
          Ative o consentimento{" "}
          <span className="text-foreground/70">IA assistiva</span> para gerar e
          revisar alertas.
        </p>
      )}

      {actionError && (
        <p className="text-xs text-red-400 mb-3">{actionError}</p>
      )}
      {successMsg && (
        <p className="text-xs text-emerald-500/80 mb-3">{successMsg}</p>
      )}

      {list.isLoading && (
        <div className="h-20 rounded-xl bg-foreground/[0.06] animate-pulse" />
      )}
      {list.error && !consentBlocked && (
        <ErrorMessage
          message={
            list.error instanceof Error
              ? list.error.message
              : "Falha ao carregar alertas."
          }
          onRetry={() => list.refetch()}
        />
      )}

      {!list.isLoading && !list.error && (
        <ul className="space-y-3">
          {(list.data ?? []).length === 0 ? (
            <li className="text-xs text-foreground/40">
              Nenhum alerta. Use &quot;Varrer padrões&quot; após check-ins
              compartilhados.
            </li>
          ) : (
            (list.data ?? []).map((item) => {
              const pending = item.status === "PENDENTE_REVISAO";
              const isEditing = editingId === item.id;
              return (
                <li key={item.id} className="glass-panel p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground/80">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-foreground/40 mt-0.5">
                        {item.severity} · {STATUS_LABEL[item.status]} ·{" "}
                        {item.code}
                      </p>
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl px-3 py-2 text-sm bg-foreground/[0.03] border border-foreground/[0.08]"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          isLoading={update.isPending}
                          onClick={() => void handleSaveEdit(item.id)}
                        >
                          Salvar
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground/70 whitespace-pre-wrap mb-3">
                      {item.workingMessage}
                    </p>
                  )}
                  {pending && !isEditing && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditMessage(item.workingMessage);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        isLoading={approve.isPending}
                        onClick={() =>
                          approve.mutate({ alertId: item.id })
                        }
                      >
                        Aprovar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        isLoading={reject.isPending}
                        onClick={() =>
                          reject.mutate({
                            alertId: item.id,
                            reason: "Rejeitado na revisão",
                          })
                        }
                      >
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </section>
  );
}
