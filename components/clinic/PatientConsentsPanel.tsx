"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Select } from "@/components/ui/Select";
import {
  CONSENT_CHANNEL_LABELS,
  CONSENT_PURPOSE_LABELS,
  ConsentStatusBadge,
} from "@/components/clinic/ConsentStatusBadge";
import {
  useConsentExports,
  useGrantConsent,
  usePatientConsentStatus,
  useRequestConsentExport,
  useRevokeConsent,
} from "@/hooks/use-consents";
import { useMyOrganizations } from "@/hooks/use-organizations";
import type {
  ConsentGrantChannel,
  ConsentPurpose,
  OrganizationRole,
} from "@anima/shared";

const ADMIN_CHANNELS: ConsentGrantChannel[] = [
  "PAPER",
  "VERBAL_RECORDED",
  "OTHER",
];

type Props = {
  orgId: string;
  patientId: string;
};

export function PatientConsentsPanel({ orgId, patientId }: Props) {
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );

  const {
    data: status,
    isLoading,
    error,
    refetch,
  } = usePatientConsentStatus(orgId, patientId);
  const exportsQuery = useConsentExports(orgId, patientId);
  const grant = useGrantConsent(orgId, patientId);
  const revoke = useRevokeConsent(orgId, patientId);
  const requestExport = useRequestConsentExport(orgId, patientId);

  const canGrant = role === "CLINIC_ADMIN";
  const canRevoke = role === "CLINIC_ADMIN" || role === "DPO";
  const canExport = role === "CLINIC_ADMIN" || role === "DPO";

  const [purpose, setPurpose] = useState<ConsentPurpose | "">("");
  const [channel, setChannel] = useState<ConsentGrantChannel>("PAPER");
  const [note, setNote] = useState("");
  const [revokeReason, setRevokeReason] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const grantablePurposes = useMemo(() => {
    if (!status) return [];
    return status.porFinalidade.filter(
      (item) => item.disponivel && item.status !== "CONCEDIDO",
    );
  }, [status]);

  async function handleGrant(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);
    if (!purpose) {
      setFormError("Selecione a finalidade.");
      return;
    }
    try {
      await grant.mutateAsync({
        purpose,
        channel,
        note: note.trim() || undefined,
      });
      setPurpose("");
      setNote("");
      setChannel("PAPER");
      setSuccessMsg("Consentimento registrado.");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Falha ao registrar consentimento.",
      );
    }
  }

  async function handleRevoke(consentId: string) {
    setFormError(null);
    setSuccessMsg(null);
    setRevokingId(consentId);
    try {
      await revoke.mutateAsync({
        consentId,
        payload: { reason: revokeReason.trim() || undefined },
      });
      setRevokeReason("");
      setSuccessMsg("Consentimento revogado.");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Falha ao revogar consentimento.",
      );
    } finally {
      setRevokingId(null);
    }
  }

  async function handleExport() {
    setFormError(null);
    setSuccessMsg(null);
    try {
      await requestExport.mutateAsync({});
      setSuccessMsg("Pedido de exportação LGPD registrado (processamento pendente).");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Falha ao solicitar exportação.",
      );
    }
  }

  return (
    <section className="mb-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground/60">
            Consentimentos (LGPD)
          </h2>
          <p className="text-xs text-foreground/35 mt-0.5 leading-relaxed">
            Ative as finalidades que abrem diário, teleconsulta, IA e demais
            ferramentas — com transparência para o paciente e trilha de auditoria.
          </p>
        </div>
        {status && (
          <span className="text-[11px] text-foreground/40 shrink-0">
            {status.todosConcedidos
              ? "Todas concedidas"
              : `${status.porFinalidade.filter((p) => p.status === "CONCEDIDO").length}/${status.porFinalidade.filter((p) => p.disponivel).length} concedidas`}
          </span>
        )}
      </div>

      {error && (
        <ErrorMessage
          message="Não foi possível carregar os consentimentos."
          onRetry={() => refetch()}
        />
      )}

      {isLoading && (
        <div className="h-28 rounded-xl bg-foreground/[0.06] animate-pulse" />
      )}

      {canRevoke &&
        (status?.porFinalidade.some((item) => item.status === "CONCEDIDO") ??
          false) && (
          <textarea
            value={revokeReason}
            onChange={(e) => setRevokeReason(e.target.value)}
            rows={1}
            placeholder="Motivo ao revogar (opcional)"
            className="w-full mb-3 rounded-xl px-4 py-3 text-sm bg-foreground/[0.03] border border-foreground/[0.08] text-foreground/90"
          />
        )}

      {status && (
        <ul className="space-y-2 mb-4">
          {status.porFinalidade
            .filter((item) => item.disponivel)
            .map((item) => (
              <li
                key={item.purpose}
                className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground/80">
                      {item.titulo ||
                        CONSENT_PURPOSE_LABELS[item.purpose] ||
                        item.purpose}
                    </p>
                    <ConsentStatusBadge status={item.status} />
                  </div>
                  <p className="text-[11px] text-foreground/35 mt-1">
                    {item.versao ? `v${item.versao}` : "—"}
                    {item.grantedAt
                      ? ` · concedido ${new Date(item.grantedAt).toLocaleString("pt-BR")}`
                      : ""}
                    {item.revokedAt
                      ? ` · revogado ${new Date(item.revokedAt).toLocaleString("pt-BR")}`
                      : ""}
                    {item.expiresAt
                      ? ` · expira ${new Date(item.expiresAt).toLocaleString("pt-BR")}`
                      : ""}
                  </p>
                </div>
                {canRevoke &&
                  item.status === "CONCEDIDO" &&
                  item.consentId && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-500 shrink-0"
                      isLoading={
                        revoke.isPending && revokingId === item.consentId
                      }
                      onClick={() => handleRevoke(item.consentId!)}
                    >
                      Revogar
                    </Button>
                  )}
              </li>
            ))}
        </ul>
      )}

      {canGrant && (
        <form
          onSubmit={handleGrant}
          className="glass-panel p-5 space-y-3 mb-4"
        >
          <h3 className="text-sm font-semibold text-foreground/75">
            Registrar consentimento
          </h3>
          <p className="text-xs text-foreground/40">
            Uso clínico: canal papel, verbal registrado ou outro (não APP).
          </p>
          <Select
            value={purpose}
            onChange={(e) =>
              setPurpose(e.target.value as ConsentPurpose | "")
            }
          >
            <option value="">Finalidade...</option>
            {grantablePurposes.map((item) => (
              <option key={item.purpose} value={item.purpose}>
                {item.titulo || CONSENT_PURPOSE_LABELS[item.purpose]}
              </option>
            ))}
          </Select>
          <Select
            value={channel}
            onChange={(e) =>
              setChannel(e.target.value as ConsentGrantChannel)
            }
          >
            {ADMIN_CHANNELS.map((key) => (
              <option key={key} value={key}>
                {CONSENT_CHANNEL_LABELS[key]}
              </option>
            ))}
          </Select>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Nota / referência do TCLE (opcional)"
            className="w-full rounded-xl px-4 py-3 text-sm bg-foreground/[0.03] border border-foreground/[0.08] text-foreground/90"
          />
          <Button
            type="submit"
            isLoading={grant.isPending}
            disabled={grantablePurposes.length === 0}
          >
            Registrar
          </Button>
        </form>
      )}

      {canExport && (
        <div className="glass-panel p-5 space-y-3 mb-4">
          <h3 className="text-sm font-semibold text-foreground/75">
            Exportação LGPD
          </h3>
          <p className="text-xs text-foreground/40">
            Registra o pedido. A geração do pacote será processada depois.
          </p>
          <Button
            type="button"
            variant="secondary"
            isLoading={requestExport.isPending}
            onClick={() => void handleExport()}
          >
            Solicitar exportação
          </Button>
          {(exportsQuery.data?.length ?? 0) > 0 && (
            <ul className="space-y-1.5 pt-1">
              {exportsQuery.data!.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="text-[11px] text-foreground/45 flex justify-between gap-2"
                >
                  <span>
                    {new Date(item.criadoEm).toLocaleString("pt-BR")} ·{" "}
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {formError && <p className="text-xs text-red-400 mb-2">{formError}</p>}
      {successMsg && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-2">
          {successMsg}
        </p>
      )}
    </section>
  );
}
