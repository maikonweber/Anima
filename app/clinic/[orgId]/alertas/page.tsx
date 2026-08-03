"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  ClinicPageFrame,
  ClinicPageHeader,
} from "@/components/clinic/ClinicPageFrame";
import { useOrgClinicalAlerts } from "@/hooks/use-clinical-alerts";

export default function ClinicalAlertsInboxPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const pending = useOrgClinicalAlerts(orgId, {
    status: "PENDENTE_REVISAO",
    limit: 50,
  });

  return (
    <ClinicPageFrame>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ClinicPageHeader
          eyebrow="Revisão humana"
          title="Alertas pendentes"
          description="Candidatos assistivos — aprove ou rejeite na ficha do paciente. Não é canal de emergência."
        />

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

        <ul className="space-y-2">
          {(pending.data ?? []).length === 0 && !pending.isLoading ? (
            <li className="text-sm text-foreground/40 px-1">
              Nenhum alerta pendente.
            </li>
          ) : (
            (pending.data ?? []).map((item) => (
              <li key={item.id}>
                <Link
                  href={`/clinic/${orgId}/patients/${item.patientId}#alertas`}
                  className="block rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-3 hover:bg-[var(--clinic-row-hover)] transition-colors"
                >
                  <p className="text-sm font-medium text-foreground/85">
                    {item.title}
                  </p>
                  <p className="text-xs text-foreground/40 mt-1">
                    {item.patientFullName ?? "Paciente"} · {item.severity} ·{" "}
                    {new Date(item.criadoEm).toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-foreground/55 mt-2 line-clamp-2">
                    {item.workingMessage}
                  </p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </motion.div>
    </ClinicPageFrame>
  );
}
