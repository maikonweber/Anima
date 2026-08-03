"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Select } from "@/components/ui/Select";
import {
  ClinicPageFrame,
  ClinicPageHeader,
} from "@/components/clinic/ClinicPageFrame";
import {
  useCreateOrganizationInvite,
  useOrganization,
  useOrganizationInvites,
} from "@/hooks/use-organizations";
import { useClinicDashboard } from "@/hooks/use-clinical-alerts";
import type { OrganizationRole } from "@anima/shared";

const INVITE_ROLES: Array<{ value: OrganizationRole; label: string }> = [
  { value: "PROFESSIONAL", label: "Profissional" },
  { value: "SECRETARY", label: "Secretaria" },
  { value: "CLINIC_ADMIN", label: "Administrador" },
  { value: "DPO", label: "DPO" },
];

const QUICK_ACTIONS = (orgId: string) =>
  [
    {
      href: `/clinic/${orgId}/patients`,
      title: "CRM de pacientes",
      subtitle: "Cadastro, funil e contatos",
    },
    {
      href: `/clinic/${orgId}/agenda`,
      title: "Agenda",
      subtitle: "Sessões, confirmação e disponibilidade",
    },
    {
      href: `/clinic/${orgId}/alertas`,
      title: "Alertas pendentes",
      subtitle: "Revisão humana (RF-072)",
    },
    {
      href: `/clinic/${orgId}/conhecimento`,
      title: "Conhecimento clínico",
      subtitle: "Base curada para sínteses",
    },
  ] as const;

export default function ClinicOrgHomePage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const { data: org, isLoading, error, refetch } = useOrganization(orgId);
  const dashboard = useClinicDashboard(orgId);
  const invites = useOrganizationInvites(orgId);
  const createInvite = useCreateOrganizationInvite(orgId);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrganizationRole>("PROFESSIONAL");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteOk, setInviteOk] = useState<string | null>(null);

  async function handleInvite(e: FormEvent) {
    e.preventDefault();
    setInviteError(null);
    setInviteOk(null);
    try {
      await createInvite.mutateAsync({ email: email.trim(), role });
      setEmail("");
      setInviteOk("Convite enviado.");
    } catch (err) {
      setInviteError(
        err instanceof Error ? err.message : "Falha ao enviar convite.",
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
        {error && (
          <ErrorMessage
            message="Não foi possível carregar a clínica."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="h-24 rounded-xl bg-foreground/[0.06] animate-pulse mb-5" />
        )}

        {org && (
          <>
            <ClinicPageHeader
              eyebrow="Organização"
              title={org.name}
              description={`${org.slug} · ${org.timezone}`}
              actions={
                <>
                  <Link href={`/clinic/${orgId}/patients/new`}>
                    <Button
                      type="button"
                      variant="secondary"
                      className="!rounded-lg !px-3 !py-2 text-xs"
                    >
                      Novo paciente
                    </Button>
                  </Link>
                  <Link href={`/clinic/${orgId}/agenda/new`}>
                    <Button type="button" className="!rounded-lg !px-3 !py-2 text-xs">
                      Nova sessão
                    </Button>
                  </Link>
                </>
              }
            />

            {dashboard.data && (
              <section className="grid gap-3 sm:grid-cols-3 mb-5">
                <Link
                  href={`/clinic/${orgId}/agenda`}
                  className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-3 hover:bg-[var(--clinic-row-hover)] transition-colors"
                >
                  <p className="text-[11px] uppercase tracking-wider text-foreground/35">
                    Hoje
                  </p>
                  <p className="text-2xl font-semibold text-foreground/85 mt-1">
                    {dashboard.data.today.total}
                  </p>
                  <p className="text-xs text-foreground/40 mt-1">
                    sessão(ões) na agenda
                  </p>
                </Link>
                <Link
                  href={`/clinic/${orgId}/alertas`}
                  className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-3 hover:bg-[var(--clinic-row-hover)] transition-colors"
                >
                  <p className="text-[11px] uppercase tracking-wider text-foreground/35">
                    Alertas
                  </p>
                  <p className="text-2xl font-semibold text-foreground/85 mt-1">
                    {dashboard.data.pendingAlerts.count}
                  </p>
                  <p className="text-xs text-foreground/40 mt-1">
                    pendentes de revisão
                  </p>
                </Link>
                <div className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wider text-foreground/35">
                    Sínteses IA
                  </p>
                  <p className="text-2xl font-semibold text-foreground/85 mt-1">
                    {dashboard.data.pendingSyntheses.count}
                  </p>
                  <p className="text-xs text-foreground/40 mt-1">
                    aguardando aprovação
                  </p>
                </div>
              </section>
            )}

            {dashboard.data && dashboard.data.today.appointments.length > 0 && (
              <section className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] overflow-hidden mb-5">
                <div className="px-3 sm:px-4 py-2.5 border-b border-[var(--clinic-border)] flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                    Agenda de hoje
                  </h2>
                  <Link
                    href={`/clinic/${orgId}/agenda`}
                    className="text-[11px] text-[var(--clinic-accent)]"
                  >
                    Ver tudo
                  </Link>
                </div>
                <ul className="divide-y divide-[var(--clinic-border)]">
                  {dashboard.data.today.appointments.map((appt) => (
                    <li key={appt.id}>
                      <Link
                        href={`/clinic/${orgId}/agenda/${appt.id}`}
                        className="flex items-center justify-between gap-3 px-3 sm:px-4 py-3 hover:bg-[var(--clinic-row-hover)] transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground/85">
                            {new Date(appt.startsAt).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            · {appt.modality}
                          </p>
                          <p className="text-xs text-foreground/40 mt-0.5">
                            {appt.status}
                          </p>
                        </div>
                        <span className="text-[var(--clinic-accent)] text-sm">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {dashboard.data?.disclaimer && (
              <p className="text-[11px] text-foreground/35 mb-5 leading-relaxed">
                {dashboard.data.disclaimer}
              </p>
            )}

            <section className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] overflow-hidden mb-5">
              <div className="px-3 sm:px-4 py-2.5 border-b border-[var(--clinic-border)]">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                  Atalhos
                </h2>
              </div>
              <ul className="divide-y divide-[var(--clinic-border)]">
                {QUICK_ACTIONS(orgId).map((action) => (
                  <li key={action.href}>
                    <Link
                      href={action.href}
                      className="flex items-center justify-between gap-3 px-3 sm:px-4 py-3 hover:bg-[var(--clinic-row-hover)] transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground/85">
                          {action.title}
                        </p>
                        <p className="text-xs text-foreground/40 mt-0.5 truncate">
                          {action.subtitle}
                        </p>
                      </div>
                      <span className="text-[var(--clinic-accent)] text-sm shrink-0">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-3 sm:p-5 space-y-4">
              <h2 className="text-base font-semibold text-foreground/80">
                Convidar equipe
              </h2>
              <form onSubmit={handleInvite} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]">
                  <Input
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="profissional@clinica.com"
                    error={inviteError ?? undefined}
                  />
                  <div>
                    <label className="block text-sm font-medium text-foreground/60 mb-1.5">
                      Papel
                    </label>
                    <Select
                      value={role}
                      onChange={(e) =>
                        setRole(e.target.value as OrganizationRole)
                      }
                    >
                      {INVITE_ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                {inviteOk && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    {inviteOk}
                  </p>
                )}
                <Button
                  type="submit"
                  isLoading={createInvite.isPending}
                  className="!rounded-lg sm:!w-auto"
                >
                  Enviar convite
                </Button>
              </form>

              {invites.data && invites.data.length > 0 && (
                <ul className="divide-y divide-[var(--clinic-border)] pt-1">
                  {invites.data.slice(0, 8).map((invite) => (
                    <li
                      key={invite.id}
                      className="py-2.5 flex flex-col xs:flex-row sm:flex-row sm:justify-between gap-1 sm:gap-3 text-sm"
                    >
                      <span className="text-foreground/70 truncate min-w-0">
                        {invite.email}
                      </span>
                      <span className="text-foreground/35 text-xs whitespace-nowrap">
                        {INVITE_ROLES.find((r) => r.value === invite.role)
                          ?.label ?? invite.role}{" "}
                        · {invite.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </motion.div>
    </ClinicPageFrame>
  );
}
