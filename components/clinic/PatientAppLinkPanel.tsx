"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  useCreatePatientAppInvite,
  useLinkPatientAppUser,
  usePatientAppInvites,
  useRevokePatientAppInvite,
  useUnlinkPatientAppUser,
} from "@/hooks/use-patients";
import { useMyOrganizations } from "@/hooks/use-organizations";
import type { OrganizationRole, PatientDetail } from "@anima/shared";

type Props = {
  orgId: string;
  patient: PatientDetail;
};

export function PatientAppLinkPanel({ orgId, patient }: Props) {
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );
  const canLink = role === "CLINIC_ADMIN" || role === "PROFESSIONAL";
  const link = useLinkPatientAppUser(orgId, patient.id);
  const unlink = useUnlinkPatientAppUser(orgId, patient.id);
  const invites = usePatientAppInvites(orgId, patient.id, canLink);
  const createInvite = useCreatePatientAppInvite(orgId, patient.id);
  const revokeInvite = useRevokePatientAppInvite(orgId, patient.id);
  const [email, setEmail] = useState(patient.email ?? "");
  const [grantPleno, setGrantPleno] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  if (!canLink) return null;

  async function handleLink(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    try {
      await link.mutateAsync({
        email: email.trim(),
        grantPleno,
      });
      setOk(
        grantPleno
          ? "Conta vinculada com Pleno patrocinado (+ R$ 5/mês no plano Cuidado)."
          : "Conta do app vinculada. O diário compartilhado passa a aparecer.",
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível vincular.",
      );
    }
  }

  async function handleInvite(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    try {
      await createInvite.mutateAsync({
        email: email.trim() || undefined,
        grantPleno,
      });
      setOk(
        "Convite enviado por e-mail. Ao aceitar, o paciente se vincula à clínica.",
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível enviar o convite.",
      );
    }
  }

  async function handleUnlink() {
    setError(null);
    setOk(null);
    try {
      await unlink.mutateAsync();
      setOk("Vínculo removido. O patrocínio Pleno desta clínica foi encerrado.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível desvincular.",
      );
    }
  }

  const pendingInvites =
    invites.data?.filter((item) => item.status === "PENDENTE") ?? [];

  return (
    <section className="rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4 sm:p-5 mb-5 space-y-3 shadow-[0_1px_2px_rgba(15,28,36,0.03)]">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Vínculo com o app
        </h2>
        <p className="text-xs text-[var(--clinic-muted)] mt-1 leading-relaxed">
          Necessário para diário, lembretes e sínteses. Convide por e-mail ou
          vincule uma conta existente. Pleno patrocinado custa R$ 5/mês por
          paciente no plano Cuidado.
        </p>
      </div>

      {patient.userId ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-foreground/80">
            <span className="inline-flex items-center rounded-md bg-[var(--clinic-accent-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--clinic-accent)] mr-2">
              Vinculado
            </span>
            Conta do app conectada a este cadastro CRM.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="!rounded-lg !w-auto clinic-btn-secondary !px-3 !py-2 text-xs"
            isLoading={unlink.isPending}
            onClick={() => void handleUnlink()}
          >
            Remover vínculo
          </Button>
        </div>
      ) : (
        <form className="space-y-3">
          <Input
            label="E-mail da conta do app"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="paciente@email.com"
          />
          <label className="flex items-start gap-2 text-xs text-foreground/70 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={grantPleno}
              onChange={(e) => setGrantPleno(e.target.checked)}
            />
            <span>
              Conceder Pleno patrocinado (+ R$ 5/mês no profissional Cuidado —
              cobre as 500 mensagens do assistente).
            </span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              className="!rounded-lg sm:!w-auto clinic-btn-primary"
              isLoading={createInvite.isPending}
              onClick={(e) => void handleInvite(e)}
            >
              Convidar por e-mail
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="!rounded-lg sm:!w-auto clinic-btn-secondary"
              isLoading={link.isPending}
              onClick={(e) => void handleLink(e)}
            >
              Vincular conta existente
            </Button>
          </div>
        </form>
      )}

      {pendingInvites.length > 0 && (
        <div className="space-y-2 border-t border-[var(--clinic-border)] pt-3">
          <p className="text-xs font-medium text-foreground/70">
            Convites pendentes
          </p>
          {pendingInvites.map((invite) => (
            <div
              key={invite.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
            >
              <span className="text-foreground/65">
                {invite.email}
                {invite.grantPleno ? " · Pleno" : ""}
              </span>
              <Button
                type="button"
                variant="secondary"
                className="!rounded-lg !w-auto clinic-btn-secondary !px-3 !py-1.5 text-xs"
                isLoading={revokeInvite.isPending}
                onClick={() => {
                  setError(null);
                  setOk(null);
                  void revokeInvite
                    .mutateAsync(invite.id)
                    .then(() => setOk("Convite revogado."))
                    .catch((err: unknown) =>
                      setError(
                        err instanceof Error
                          ? err.message
                          : "Não foi possível revogar.",
                      ),
                    );
                }}
              >
                Revogar
              </Button>
            </div>
          ))}
        </div>
      )}

      {ok && <p className="text-xs text-emerald-700">{ok}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </section>
  );
}
