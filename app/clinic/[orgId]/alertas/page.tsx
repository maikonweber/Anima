"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  ClinicPageFrame,
  ClinicPageHeader,
} from "@/components/clinic/ClinicPageFrame";
import {
  useApproveClinicalAlert,
  useOrgClinicalAlerts,
  useRejectClinicalAlert,
} from "@/hooks/use-clinical-alerts";
import { dateLocale } from "@/lib/i18n/config";
import { getClinicUiDictionary } from "@/lib/i18n/clinic-ui-dictionary";
import { useLocale } from "@/lib/i18n/locale-provider";

export default function ClinicalAlertsInboxPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const { locale, localizedHref } = useLocale();
  const t = getClinicUiDictionary(locale);
  const dl = dateLocale(locale);
  const pending = useOrgClinicalAlerts(orgId, {
    status: "PENDENTE_REVISAO",
    limit: 50,
  });
  const approve = useApproveClinicalAlert(orgId);
  const reject = useRejectClinicalAlert(orgId);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleApprove(patientId: string, alertId: string) {
    setActionError(null);
    try {
      await approve.mutateAsync({ alertId, patientId });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao aprovar alerta.",
      );
    }
  }

  async function handleReject(patientId: string, alertId: string) {
    setActionError(null);
    try {
      await reject.mutateAsync({
        alertId,
        patientId,
        reason: "Rejeitado na inbox",
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao rejeitar alerta.",
      );
    }
  }

  return (
    <ClinicPageFrame>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ClinicPageHeader
          eyebrow="Revisão humana"
          title={t.pages.alerts}
          description="Candidatos assistivos — revise aqui ou na ficha do paciente. Não é canal de emergência."
        />

        {actionError && (
          <p className="text-xs text-red-400 mb-3">{actionError}</p>
        )}

        {pending.isLoading && (
          <div className="h-28 rounded-xl bg-foreground/[0.06] animate-pulse" />
        )}
        {pending.error && (
          <ErrorMessage
            message={
              pending.error instanceof Error
                ? pending.error.message
                : "Falha ao carregar inbox."
            }
            onRetry={() => pending.refetch()}
          />
        )}

        <ul className="space-y-3">
          {(pending.data ?? []).length === 0 && !pending.isLoading ? (
            <li className="text-sm text-foreground/40 px-1">
              Nenhum alerta pendente.
            </li>
          ) : (
            (pending.data ?? []).map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground/85">
                      {item.title}
                    </p>
                    <p className="text-xs text-foreground/40 mt-1">
                      {item.patientFullName ?? "Paciente"} · {item.severity} ·{" "}
                      {new Date(item.criadoEm).toLocaleString(dl)}
                    </p>
                    <p className="text-xs text-foreground/55 mt-2 line-clamp-3">
                      {item.workingMessage}
                    </p>
                    <Link
                      href={localizedHref(
                        `/clinic/${orgId}/patients/${item.patientId}#alertas`,
                      )}
                      className="inline-block text-[11px] text-[var(--clinic-accent)] mt-2"
                    >
                      Abrir ficha →
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Button
                      type="button"
                      className="!rounded-lg !px-3 !py-2 text-xs"
                      isLoading={approve.isPending}
                      onClick={() =>
                        void handleApprove(item.patientId, item.id)
                      }
                    >
                      Aprovar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="!rounded-lg !px-3 !py-2 text-xs"
                      isLoading={reject.isPending}
                      onClick={() =>
                        void handleReject(item.patientId, item.id)
                      }
                    >
                      Rejeitar
                    </Button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </motion.div>
    </ClinicPageFrame>
  );
}
