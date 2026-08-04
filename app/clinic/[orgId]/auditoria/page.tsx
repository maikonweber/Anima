"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  ClinicPageFrame,
  ClinicPageHeader,
} from "@/components/clinic/ClinicPageFrame";
import {
  useMyOrganizations,
  useOrganizationAuditLogs,
} from "@/hooks/use-organizations";
import type { OrganizationRole } from "@anima/shared";

const ACTION_FILTERS: { label: string; value: string }[] = [
  { label: "Todas", value: "" },
  { label: "Consentimentos", value: "consent." },
  { label: "Prontuário", value: "clinical_note." },
  { label: "Pacientes", value: "patient." },
  { label: "Agenda", value: "appointment." },
  { label: "Teleconsulta", value: "teleconsult." },
  { label: "Sínteses", value: "ai_synthesis." },
  { label: "Alertas", value: "clinical_alert." },
  { label: "Crise", value: "crisis_resource." },
  { label: "Governança", value: "organization." },
];

export default function ClinicAuditLogsPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );
  const canView = role === "CLINIC_ADMIN" || role === "DPO";
  const [action, setAction] = useState("");

  const logs = useOrganizationAuditLogs(
    orgId,
    { limit: 100, action: action || undefined },
    canView,
  );

  if (orgs && !canView) {
    return (
      <ClinicPageFrame width="narrow">
        <p className="text-sm text-foreground/50">
          Auditoria disponível apenas para admin da clínica ou DPO.
        </p>
      </ClinicPageFrame>
    );
  }

  return (
    <ClinicPageFrame>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ClinicPageHeader
          eyebrow="Governança"
          title="Auditoria"
          description={
            role === "DPO"
              ? "Trilha de ações com metadata minimizada — sem conteúdo clínico."
              : "Trilha de ações da organização (governança e domínio clínico)."
          }
        />

        <div className="flex flex-wrap gap-2 mb-5">
          {ACTION_FILTERS.map((filter) => {
            const active = action === filter.value;
            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => setAction(filter.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  active
                    ? "border-[var(--clinic-accent)] bg-[var(--clinic-accent-soft)] text-[var(--clinic-accent)]"
                    : "border-[var(--clinic-border)] text-foreground/45 hover:text-foreground/70"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {logs.isLoading && (
          <div className="h-28 rounded-xl bg-foreground/[0.06] animate-pulse" />
        )}
        {logs.error && (
          <ErrorMessage
            message={
              logs.error instanceof Error
                ? logs.error.message
                : "Falha ao carregar auditoria."
            }
            onRetry={() => logs.refetch()}
          />
        )}

        <ul className="space-y-2">
          {(logs.data ?? []).length === 0 && !logs.isLoading ? (
            <li className="text-sm text-foreground/40 px-1">
              Nenhum evento nesta trilha.
            </li>
          ) : (
            (logs.data ?? []).map((row) => (
              <li
                key={row.id}
                className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground/85 font-mono">
                      {row.action}
                    </p>
                    <p className="text-xs text-foreground/40 mt-1">
                      {row.targetType ?? "—"}
                      {row.targetId ? ` · ${row.targetId.slice(0, 8)}…` : ""}
                      {row.actorUserId
                        ? ` · ator ${row.actorUserId.slice(0, 8)}…`
                        : " · sistema"}
                    </p>
                    {Object.keys(row.metadata ?? {}).length > 0 ? (
                      <p className="text-[11px] text-foreground/35 mt-2 font-mono break-all line-clamp-2">
                        {JSON.stringify(row.metadata)}
                      </p>
                    ) : null}
                  </div>
                  <time className="text-[11px] text-foreground/35 shrink-0 tabular-nums">
                    {new Date(row.criadoEm).toLocaleString("pt-BR")}
                  </time>
                </div>
              </li>
            ))
          )}
        </ul>
      </motion.div>
    </ClinicPageFrame>
  );
}
