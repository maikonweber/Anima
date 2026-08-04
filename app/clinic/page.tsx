"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  ClinicPageFrame,
  ClinicPageHeader,
} from "@/components/clinic/ClinicPageFrame";
import {
  useCreateOrganization,
  useMyOrganizations,
} from "@/hooks/use-organizations";
import { getClinicUiDictionary } from "@/lib/i18n/clinic-ui-dictionary";
import { useLocale } from "@/lib/i18n/locale-provider";

function orgInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "C";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function ClinicHomePage() {
  const router = useRouter();
  const { locale, localizedHref } = useLocale();
  const t = getClinicUiDictionary(locale);
  const roleLabels: Record<string, string> = {
    CLINIC_ADMIN: t.roles.admin,
    PROFESSIONAL: t.roles.professional,
    SECRETARY: t.roles.secretary,
    PATIENT: t.roles.patient,
    DPO: t.roles.dpo,
  };
  const { data, isLoading, error, refetch } = useMyOrganizations();
  const createOrg = useCreateOrganization();
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (name.trim().length < 2) {
      setFormError("Informe o nome da clínica.");
      return;
    }
    try {
      const result = await createOrg.mutateAsync({ name: name.trim() });
      setName("");
      setShowForm(false);
      router.push(
        localizedHref(`/clinic/${result.organization.id}/patients`),
      );
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Não foi possível criar a clínica.",
      );
    }
  }

  return (
    <ClinicPageFrame>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <ClinicPageHeader
          eyebrow="Área profissional"
          title={t.brand.clinics}
          description="CRM, agenda e equipe por organização — separado do app do paciente."
          actions={
            <Button
              type="button"
              variant={showForm ? "secondary" : "primary"}
              className={`!rounded-lg !px-4 !py-2.5 text-sm ${
                showForm ? "clinic-btn-secondary" : "clinic-btn-primary"
              }`}
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Cancelar" : "Nova clínica"}
            </Button>
          }
        />

        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.25 }}
            onSubmit={handleCreate}
            className="rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4 sm:p-6 mb-6 space-y-4 shadow-[0_1px_3px_rgba(15,28,36,0.04)] overflow-hidden"
          >
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Nova organização
              </h2>
              <p className="text-sm text-[var(--clinic-muted)] mt-1">
                Você será o administrador e poderá convidar a equipe depois.
              </p>
            </div>
            <Input
              label="Nome da clínica"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Clínica Aurora"
              error={formError ?? undefined}
              autoFocus
            />
            <Button
              type="submit"
              isLoading={createOrg.isPending}
              className="!rounded-lg sm:!w-auto clinic-btn-primary"
            >
              Criar e abrir CRM
            </Button>
          </motion.form>
        )}

        {error && (
          <ErrorMessage
            message="Não foi possível carregar suas clínicas."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[4.5rem] rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && !error && (!data || data.length === 0) && (
          <div className="relative overflow-hidden rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-5 py-14 sm:px-8 text-center shadow-[0_1px_3px_rgba(15,28,36,0.04)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(13,115,119,0.1),transparent_70%)]"
            />
            <div className="relative">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--clinic-accent-soft)] text-[var(--clinic-accent)]">
                <BuildingEmptyIcon />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma clínica ainda
              </h3>
              <p className="text-sm text-[var(--clinic-muted)] max-w-sm mx-auto mb-6 leading-relaxed">
                Crie uma organização para cadastrar pacientes, convidar a equipe
                e operar o CRM clínico.
              </p>
              <Button
                type="button"
                className="w-auto mx-auto !rounded-lg clinic-btn-primary"
                onClick={() => setShowForm(true)}
              >
                Criar clínica
              </Button>
            </div>
          </div>
        )}

        {data && data.length > 0 && (
          <div>
            <div className="flex items-baseline justify-between gap-3 mb-3 px-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--clinic-subtle)]">
                Suas organizações
              </p>
              <p className="text-xs text-[var(--clinic-subtle)]">
                {data.length} {data.length === 1 ? "clínica" : "clínicas"}
              </p>
            </div>
            <ul className="space-y-2.5">
              {data.map(({ organization, membership }, index) => (
                <motion.li
                  key={organization.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.04 * index,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={localizedHref(`/clinic/${organization.id}`)}
                    className="group flex items-center gap-3.5 sm:gap-4 rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-3.5 sm:px-5 py-3.5 sm:py-4 shadow-[0_1px_2px_rgba(15,28,36,0.03)] hover:border-[rgba(13,115,119,0.28)] hover:shadow-[0_4px_20px_rgba(13,115,119,0.08)] hover:bg-[var(--clinic-row-hover)] transition-all duration-200"
                  >
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--clinic-accent-soft)] text-[var(--clinic-accent)] text-sm font-semibold tracking-tight">
                      {orgInitials(organization.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-foreground truncate group-hover:text-[var(--clinic-accent)] transition-colors">
                        {organization.name}
                      </p>
                      <p className="text-xs sm:text-sm text-[var(--clinic-muted)] mt-0.5 truncate">
                        {roleLabels[membership.role] ?? membership.role}
                        <span className="text-[var(--clinic-subtle)]"> · </span>
                        {organization.timezone.replace(/_/g, " ")}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 shrink-0 rounded-lg bg-[var(--clinic-accent-soft)] px-2.5 py-1.5 text-xs font-semibold text-[var(--clinic-accent)] opacity-90 group-hover:opacity-100 transition-opacity">
                      Abrir
                      <ArrowIcon />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </ClinicPageFrame>
  );
}

function BuildingEmptyIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 21h19.5M3.75 21V8.25A2.25 2.25 0 016 6h4.5a2.25 2.25 0 012.25 2.25V21m0 0V9.75A2.25 2.25 0 0115 7.5h3a2.25 2.25 0 012.25 2.25V21"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}
