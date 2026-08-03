"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  useCreateOrganizationInvite,
  useOrganization,
  useOrganizationInvites,
} from "@/hooks/use-organizations";
import type { OrganizationRole } from "@anima/shared";

const INVITE_ROLES: OrganizationRole[] = [
  "PROFESSIONAL",
  "SECRETARY",
  "CLINIC_ADMIN",
  "DPO",
];

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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/clinic"
          className="text-sm text-foreground/40 hover:text-anima-violet mb-4 inline-block"
        >
          ← Minhas clínicas
        </Link>

        {error && (
          <ErrorMessage
            message="Não foi possível carregar a clínica."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="h-28 rounded-2xl bg-foreground/[0.06] animate-pulse mb-6" />
        )}

        {org && (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
              {org.name}
            </h1>
            <p className="text-sm text-foreground/40 mb-8">
              {org.slug} · {org.timezone}
            </p>

            <div className="grid gap-3 sm:grid-cols-2 mb-8">
              <Link
                href={`/clinic/${orgId}/patients`}
                className="glass-panel p-5 hover:scale-[1.01] transition-transform"
              >
                <p className="font-semibold text-foreground/85">CRM de pacientes</p>
                <p className="text-xs text-foreground/40 mt-1">
                  Cadastro, funil e contatos
                </p>
              </Link>
              <Link
                href={`/clinic/${orgId}/agenda`}
                className="glass-panel p-5 hover:scale-[1.01] transition-transform"
              >
                <p className="font-semibold text-foreground/85">Agenda</p>
                <p className="text-xs text-foreground/40 mt-1">
                  Sessões, confirmação e disponibilidade
                </p>
              </Link>
              <Link
                href={`/clinic/${orgId}/patients/new`}
                className="glass-panel p-5 hover:scale-[1.01] transition-transform"
              >
                <p className="font-semibold text-foreground/85">Novo paciente</p>
                <p className="text-xs text-foreground/40 mt-1">
                  Abrir ficha no CRM
                </p>
              </Link>
              <Link
                href={`/clinic/${orgId}/agenda/new`}
                className="glass-panel p-5 hover:scale-[1.01] transition-transform"
              >
                <p className="font-semibold text-foreground/85">Nova sessão</p>
                <p className="text-xs text-foreground/40 mt-1">
                  Agendar atendimento
                </p>
              </Link>
            </div>

            <section className="glass-panel p-5 space-y-4">
              <h2 className="text-base font-semibold text-foreground/80">
                Convidar equipe
              </h2>
              <form onSubmit={handleInvite} className="space-y-3">
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
                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value as OrganizationRole)
                    }
                    className="w-full rounded-xl px-4 py-3 text-sm bg-foreground/[0.03] border border-foreground/[0.08] text-foreground/90"
                  >
                    {INVITE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                {inviteOk && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    {inviteOk}
                  </p>
                )}
                <Button type="submit" isLoading={createInvite.isPending}>
                  Enviar convite
                </Button>
              </form>

              {invites.data && invites.data.length > 0 && (
                <ul className="divide-y divide-foreground/[0.06] pt-2">
                  {invites.data.slice(0, 8).map((invite) => (
                    <li
                      key={invite.id}
                      className="py-2.5 flex justify-between gap-3 text-sm"
                    >
                      <span className="text-foreground/70 truncate">
                        {invite.email}
                      </span>
                      <span className="text-foreground/35 text-xs whitespace-nowrap">
                        {invite.role} · {invite.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </motion.div>
    </div>
  );
}
