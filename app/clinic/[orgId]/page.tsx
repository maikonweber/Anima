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
      href: `/clinic/${orgId}/patients/new`,
      title: "Novo paciente",
      subtitle: "Abrir ficha no CRM",
    },
    {
      href: `/clinic/${orgId}/agenda/new`,
      title: "Nova sessão",
      subtitle: "Agendar atendimento",
    },
  ] as const;

export default function ClinicOrgHomePage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const { data: org, isLoading, error, refetch } = useOrganization(orgId);
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
