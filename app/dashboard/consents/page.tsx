"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Select } from "@/components/ui/Select";
import {
  CONSENT_PURPOSE_LABELS,
  ConsentStatusBadge,
} from "@/components/clinic/ConsentStatusBadge";
import {
  useGrantConsent,
  useMyConsentStatus,
  useRevokeConsent,
} from "@/hooks/use-consents";
import { useMyOrganizations } from "@/hooks/use-organizations";
import type { ConsentPurpose } from "@anima/shared";
import { ApiError } from "@anima/shared";

export default function PatientConsentsPage() {
  const { data: orgs, isLoading: orgsLoading, error: orgsError, refetch: refetchOrgs } =
    useMyOrganizations();

  const patientOrgs = useMemo(
    () =>
      (orgs ?? []).filter((item) => item.membership.role === "PATIENT"),
    [orgs],
  );

  const [orgId, setOrgId] = useState("");

  useEffect(() => {
    if (!orgId && patientOrgs.length > 0) {
      setOrgId(patientOrgs[0].organization.id);
    }
  }, [orgId, patientOrgs]);

  const selectedOrg = patientOrgs.find(
    (item) => item.organization.id === orgId,
  );

  const {
    data: status,
    isLoading: statusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useMyConsentStatus(orgId);

  const patientId = status?.patientId ?? "";
  const grant = useGrantConsent(orgId, patientId);
  const revoke = useRevokeConsent(orgId, patientId);

  const [busyPurpose, setBusyPurpose] = useState<ConsentPurpose | null>(null);
  const [busyRevokeId, setBusyRevokeId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleGrant(purpose: ConsentPurpose) {
    if (!patientId) return;
    setActionError(null);
    setSuccessMsg(null);
    setBusyPurpose(purpose);
    try {
      await grant.mutateAsync({ purpose, channel: "APP" });
      setSuccessMsg("Consentimento concedido.");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao conceder consentimento.",
      );
    } finally {
      setBusyPurpose(null);
    }
  }

  async function handleRevoke(consentId: string) {
    setActionError(null);
    setSuccessMsg(null);
    setBusyRevokeId(consentId);
    try {
      await revoke.mutateAsync({ consentId });
      setSuccessMsg("Consentimento revogado.");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao revogar consentimento.",
      );
    } finally {
      setBusyRevokeId(null);
    }
  }

  const statusErrorMessage =
    statusError instanceof ApiError
      ? statusError.message
      : statusError instanceof Error
        ? statusError.message
        : "Não foi possível carregar seus consentimentos.";

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-2">
          Consentimentos
        </h1>
        <p className="text-sm text-foreground/45 mb-8">
          Controle o que a clínica pode ver e usar. Você pode conceder ou
          revogar a qualquer momento.
        </p>
      </motion.div>

      {orgsError && (
        <ErrorMessage
          message="Não foi possível carregar suas clínicas."
          onRetry={() => refetchOrgs()}
        />
      )}

      {orgsLoading && (
        <div className="h-28 rounded-2xl bg-foreground/[0.06] animate-pulse" />
      )}

      {!orgsLoading && patientOrgs.length === 0 && (
        <div className="glass-panel p-6 text-sm text-foreground/50">
          Você ainda não está vinculado como paciente em nenhuma clínica. Quando
          a clínica fizer o vínculo, as finalidades aparecerão aqui.
        </div>
      )}

      {patientOrgs.length > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {patientOrgs.length > 1 && (
            <Select
              value={orgId}
              onChange={(e) => {
                setOrgId(e.target.value);
                setActionError(null);
                setSuccessMsg(null);
              }}
            >
              {patientOrgs.map((item) => (
                <option
                  key={item.organization.id}
                  value={item.organization.id}
                >
                  {item.organization.name}
                </option>
              ))}
            </Select>
          )}

          {selectedOrg && patientOrgs.length === 1 && (
            <p className="text-sm text-foreground/55">
              Clínica:{" "}
              <span className="font-medium text-foreground/80">
                {selectedOrg.organization.name}
              </span>
            </p>
          )}

          {statusError && orgId && (
            <ErrorMessage
              message={statusErrorMessage}
              onRetry={() => refetchStatus()}
            />
          )}

          {statusLoading && orgId && (
            <div className="h-40 rounded-2xl bg-foreground/[0.06] animate-pulse" />
          )}

          {status && (
            <>
              <p className="text-xs text-foreground/40">
                {status.todosConcedidos
                  ? "Todas as finalidades disponíveis foram concedidas."
                  : `${status.porFinalidade.filter((p) => p.status === "CONCEDIDO").length} de ${status.porFinalidade.filter((p) => p.disponivel).length} finalidades concedidas.`}
              </p>

              <ul className="space-y-3">
                {status.porFinalidade
                  .filter((item) => item.disponivel)
                  .map((item) => (
                    <li key={item.purpose} className="glass-panel p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground/80">
                            {item.titulo ||
                              CONSENT_PURPOSE_LABELS[item.purpose] ||
                              item.purpose}
                          </p>
                          {item.versao && (
                            <p className="text-[11px] text-foreground/35 mt-0.5">
                              v{item.versao}
                              {item.grantedAt
                                ? ` · concedido ${new Date(item.grantedAt).toLocaleDateString("pt-BR")}`
                                : ""}
                            </p>
                          )}
                        </div>
                        <ConsentStatusBadge status={item.status} />
                      </div>

                      {item.status !== "CONCEDIDO" ? (
                        <Button
                          type="button"
                          isLoading={
                            grant.isPending && busyPurpose === item.purpose
                          }
                          onClick={() => void handleGrant(item.purpose)}
                        >
                          Conceder
                        </Button>
                      ) : (
                        item.consentId && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-red-500"
                            isLoading={
                              revoke.isPending &&
                              busyRevokeId === item.consentId
                            }
                            onClick={() => void handleRevoke(item.consentId!)}
                          >
                            Revogar
                          </Button>
                        )
                      )}
                    </li>
                  ))}
              </ul>
            </>
          )}

          {actionError && (
            <p className="text-xs text-red-400">{actionError}</p>
          )}
          {successMsg && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              {successMsg}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
