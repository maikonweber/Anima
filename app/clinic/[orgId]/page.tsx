"use client";

import { FormEvent, useMemo, useState } from "react";
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
  useMyOrganizations,
  useOrganization,
  useOrganizationInvites,
} from "@/hooks/use-organizations";
import { useClinicDashboard } from "@/hooks/use-clinical-alerts";
import { dateLocale, type Locale } from "@/lib/i18n/config";
import { getClinicUiDictionary } from "@/lib/i18n/clinic-ui-dictionary";
import { useLocale } from "@/lib/i18n/locale-provider";
import type { OrganizationRole } from "@anima/shared";

function inviteRoles(locale: Locale) {
  const roles = getClinicUiDictionary(locale).roles;
  return [
    { value: "PROFESSIONAL" as const, label: roles.professional },
    { value: "SECRETARY" as const, label: roles.secretary },
    { value: "CLINIC_ADMIN" as const, label: roles.admin },
    { value: "DPO" as const, label: roles.dpo },
  ];
}

function quickActions(
  orgId: string,
  role: OrganizationRole | undefined,
  locale: Locale,
) {
  const qa = getClinicUiDictionary(locale).quickActions;
  const items: Array<{ href: string; title: string; subtitle: string }> = [
    {
      href: `/clinic/${orgId}/patients`,
      title: qa.patients.title,
      subtitle: qa.patients.subtitle,
    },
    {
      href: `/clinic/${orgId}/agenda`,
      title: qa.agenda.title,
      subtitle: qa.agenda.subtitle,
    },
  ];
  if (role === "CLINIC_ADMIN" || role === "PROFESSIONAL") {
    items.push(
      {
        href: `/clinic/${orgId}/alertas`,
        title: qa.alerts.title,
        subtitle: qa.alerts.subtitle,
      },
      {
        href: `/clinic/${orgId}/conhecimento`,
        title: qa.knowledge.title,
        subtitle: qa.knowledge.subtitle,
      },
      {
        href: `/clinic/${orgId}/crise`,
        title: qa.crisis.title,
        subtitle: qa.crisis.subtitle,
      },
    );
  }
  if (role === "CLINIC_ADMIN" || role === "DPO") {
    items.push({
      href: `/clinic/${orgId}/auditoria`,
      title: qa.audit.title,
      subtitle: qa.audit.subtitle,
    });
  }
  if (role === "DPO") {
    return items.filter((i) => i.href.includes("/auditoria"));
  }
  return items;
}

export default function ClinicOrgHomePage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const { locale, localizedHref } = useLocale();
  const t = getClinicUiDictionary(locale);
  const inviteRoleOptions = inviteRoles(locale);
  const { data: org, isLoading, error, refetch } = useOrganization(orgId);
  const { data: orgs } = useMyOrganizations();
  const role = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );
  const dashboard = useClinicDashboard(orgId, !!role && role !== "PATIENT");
  const invites = useOrganizationInvites(orgId);
  const createInvite = useCreateOrganizationInvite(orgId);
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] =
    useState<OrganizationRole>("PROFESSIONAL");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteOk, setInviteOk] = useState<string | null>(null);

  const caps = dashboard.data?.capabilities;
  const canInvite = caps?.invites ?? role === "CLINIC_ADMIN";
  const canClinical = caps?.clinicalQueues ?? false;
  const canOps =
    (caps?.crm ?? true) && role !== "DPO" && role !== "PATIENT";
  const actions = quickActions(orgId, role ?? dashboard.data?.role, locale);
  const dl = dateLocale(locale);

  async function handleInvite(e: FormEvent) {
    e.preventDefault();
    setInviteError(null);
    setInviteOk(null);
    try {
      await createInvite.mutateAsync({
        email: email.trim(),
        role: inviteRole,
      });
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
              eyebrow={
                role === "DPO"
                  ? "Governança"
                  : role === "SECRETARY"
                    ? "Operações"
                    : "Organização"
              }
              title={org.name}
              description={`${org.slug} · ${org.timezone}${
                role ? ` · ${role}` : ""
              }`}
              actions={
                canOps ? (
                  <>
                    <Link href={localizedHref(`/clinic/${orgId}/patients/new`)}>
                      <Button
                        type="button"
                        variant="secondary"
                        className="!rounded-lg !px-3.5 !py-2.5 text-sm clinic-btn-secondary"
                      >
                        Novo paciente
                      </Button>
                    </Link>
                    <Link href={localizedHref(`/clinic/${orgId}/agenda/new`)}>
                      <Button
                        type="button"
                        className="!rounded-lg !px-3.5 !py-2.5 text-sm clinic-btn-primary"
                      >
                        Nova sessão
                      </Button>
                    </Link>
                  </>
                ) : role === "DPO" ? (
                  <Link href={localizedHref(`/clinic/${orgId}/auditoria`)}>
                    <Button
                      type="button"
                      className="!rounded-lg !px-3.5 !py-2.5 text-sm clinic-btn-primary"
                    >
                      Abrir auditoria
                    </Button>
                  </Link>
                ) : null
              }
            />

            {dashboard.error && (
              <ErrorMessage
                message={
                  dashboard.error instanceof Error
                    ? dashboard.error.message
                    : "Falha ao carregar visão geral."
                }
                onRetry={() => dashboard.refetch()}
              />
            )}

            {dashboard.data?.role === "DPO" && dashboard.data.auditSummary && (
              <section className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] overflow-hidden mb-5">
                <div className="px-3 sm:px-4 py-2.5 border-b border-[var(--clinic-border)] flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                    Auditoria recente
                  </h2>
                  <Link
                    href={localizedHref(`/clinic/${orgId}/auditoria`)}
                    className="text-[11px] text-[var(--clinic-accent)]"
                  >
                    Ver trilha
                  </Link>
                </div>
                <ul className="divide-y divide-[var(--clinic-border)]">
                  {dashboard.data.auditSummary.items.map((item) => (
                    <li
                      key={item.id}
                      className="px-3 sm:px-4 py-3 flex justify-between gap-3"
                    >
                      <span className="text-sm font-mono text-foreground/75 truncate">
                        {item.action}
                      </span>
                      <time className="text-[11px] text-foreground/35 shrink-0">
                        {new Date(item.criadoEm).toLocaleString(dl)}
                      </time>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {dashboard.data && canOps && (
              <section className="grid gap-3 sm:grid-cols-3 mb-6">
                <Link
                  href={localizedHref(`/clinic/${orgId}/agenda`)}
                  className="rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-4 hover:border-[rgba(13,115,119,0.28)] transition-all"
                >
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--clinic-subtle)] font-semibold">
                    Hoje
                  </p>
                  <p className="text-3xl font-semibold text-foreground mt-1.5 tracking-tight">
                    {dashboard.data.today?.total ?? 0}
                  </p>
                  <p className="text-xs text-[var(--clinic-muted)] mt-1">
                    sessão(ões)
                    {role === "PROFESSIONAL" ? " na sua agenda" : " na agenda"}
                  </p>
                </Link>
                {canClinical ? (
                  <>
                    <Link
                      href={localizedHref(`/clinic/${orgId}/alertas`)}
                      className="rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-4 hover:border-[rgba(13,115,119,0.28)] transition-all"
                    >
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--clinic-subtle)] font-semibold">
                        {t.nav.alerts}
                      </p>
                      <p className="text-3xl font-semibold text-foreground mt-1.5 tracking-tight">
                        {dashboard.data.pendingAlerts?.count ?? 0}
                      </p>
                      <p className="text-xs text-[var(--clinic-muted)] mt-1">
                        pendentes de revisão
                      </p>
                    </Link>
                    <div className="rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--clinic-subtle)] font-semibold">
                        Sínteses IA
                      </p>
                      <p className="text-3xl font-semibold text-foreground mt-1.5 tracking-tight">
                        {dashboard.data.pendingSyntheses?.count ?? 0}
                      </p>
                      <p className="text-xs text-[var(--clinic-muted)] mt-1">
                        aguardando aprovação
                      </p>
                    </div>
                  </>
                ) : (
                  <Link
                    href={localizedHref(`/clinic/${orgId}/patients`)}
                    className="rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-4 sm:col-span-2 hover:border-[rgba(13,115,119,0.28)] transition-all"
                  >
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--clinic-subtle)] font-semibold">
                      {t.nav.patients}
                    </p>
                    <p className="text-3xl font-semibold text-foreground mt-1.5 tracking-tight">
                      {dashboard.data.patientsSummary?.total ?? 0}
                    </p>
                    <p className="text-xs text-[var(--clinic-muted)] mt-1">
                      no CRM da clínica
                    </p>
                  </Link>
                )}
              </section>
            )}

            {canClinical &&
              (dashboard.data?.pendingSyntheses?.items.length ?? 0) > 0 && (
                <section className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] overflow-hidden mb-5">
                  <div className="px-3 sm:px-4 py-2.5 border-b border-[var(--clinic-border)]">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                      Sínteses para revisar
                    </h2>
                  </div>
                  <ul className="divide-y divide-[var(--clinic-border)]">
                    {dashboard.data!.pendingSyntheses!.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={localizedHref(
                            `/clinic/${orgId}/patients/${item.patientId}#ia`,
                          )}
                          className="flex items-center justify-between gap-3 px-3 sm:px-4 py-3 hover:bg-[var(--clinic-row-hover)] transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground/85 truncate">
                              {item.title || "Síntese sem título"}
                            </p>
                            <p className="text-xs text-foreground/40 mt-0.5">
                              {new Date(item.criadoEm).toLocaleString(dl)}
                            </p>
                          </div>
                          <span className="text-[var(--clinic-accent)] text-sm">
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {canOps &&
              (dashboard.data?.today?.appointments.length ?? 0) > 0 && (
                <section className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] overflow-hidden mb-5">
                  <div className="px-3 sm:px-4 py-2.5 border-b border-[var(--clinic-border)] flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                      Agenda de hoje
                    </h2>
                    <Link
                      href={localizedHref(`/clinic/${orgId}/agenda`)}
                      className="text-[11px] text-[var(--clinic-accent)]"
                    >
                      Ver tudo
                    </Link>
                  </div>
                  <ul className="divide-y divide-[var(--clinic-border)]">
                    {dashboard.data!.today!.appointments.map((appt) => (
                      <li key={appt.id}>
                        <Link
                          href={localizedHref(
                            `/clinic/${orgId}/agenda/${appt.id}`,
                          )}
                          className="flex items-center justify-between gap-3 px-3 sm:px-4 py-3 hover:bg-[var(--clinic-row-hover)] transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground/85">
                              {new Date(appt.startsAt).toLocaleTimeString(dl, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              · {appt.modality}
                            </p>
                            <p className="text-xs text-foreground/40 mt-0.5">
                              {appt.status}
                            </p>
                          </div>
                          <span className="text-[var(--clinic-accent)] text-sm">
                            →
                          </span>
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
                {actions.map((action) => (
                  <li key={action.href}>
                    <Link
                      href={localizedHref(action.href)}
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

            {canInvite && (
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
                        value={inviteRole}
                        onChange={(e) =>
                          setInviteRole(e.target.value as OrganizationRole)
                        }
                      >
                        {inviteRoleOptions.map((r) => (
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
                    className="!rounded-lg sm:!w-auto clinic-btn-primary"
                  >
                    Enviar convite
                  </Button>
                </form>

                {invites.data && invites.data.length > 0 && (
                  <ul className="divide-y divide-[var(--clinic-border)] pt-1">
                    {invites.data.slice(0, 8).map((invite) => (
                      <li
                        key={invite.id}
                        className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-3 text-sm"
                      >
                        <span className="text-foreground/70 truncate min-w-0">
                          {invite.email}
                        </span>
                        <span className="text-foreground/35 text-xs whitespace-nowrap">
                          {inviteRoleOptions.find((r) => r.value === invite.role)
                            ?.label ?? invite.role}{" "}
                          · {invite.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </>
        )}
      </motion.div>
    </ClinicPageFrame>
  );
}
