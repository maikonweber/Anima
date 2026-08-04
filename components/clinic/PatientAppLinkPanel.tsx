"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  useLinkPatientAppUser,
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
  const [email, setEmail] = useState(patient.email ?? "");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  if (!canLink) return null;

  async function handleLink(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    try {
      await link.mutateAsync({ email: email.trim() });
      setOk("Conta do app vinculada. O diário compartilhado passa a aparecer.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível vincular.",
      );
    }
  }

  async function handleUnlink() {
    setError(null);
    setOk(null);
    try {
      await unlink.mutateAsync();
      setOk("Vínculo removido.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível desvincular.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4 sm:p-5 mb-5 space-y-3 shadow-[0_1px_2px_rgba(15,28,36,0.03)]">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Vínculo com o app
        </h2>
        <p className="text-xs text-[var(--clinic-muted)] mt-1 leading-relaxed">
          Necessário para diário, lembretes e sínteses. Use o e-mail da conta
          EmotiveCare do paciente (app).
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
        <form onSubmit={handleLink} className="space-y-3">
          <Input
            label="E-mail da conta do app"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="paciente@email.com"
            required
          />
          <Button
            type="submit"
            className="!rounded-lg sm:!w-auto clinic-btn-primary"
            isLoading={link.isPending}
          >
            Vincular conta
          </Button>
        </form>
      )}

      {ok && <p className="text-xs text-emerald-700">{ok}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </section>
  );
}
