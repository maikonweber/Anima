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

const ROLE_LABELS: Record<string, string> = {
  CLINIC_ADMIN: "Administrador",
  PROFESSIONAL: "Profissional",
  SECRETARY: "Secretaria",
  PATIENT: "Paciente",
  DPO: "DPO",
};

export default function ClinicHomePage() {
  const router = useRouter();
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
      router.push(`/clinic/${result.organization.id}/patients`);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Não foi possível criar a clínica.",
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
        <ClinicPageHeader
          eyebrow="Área profissional"
          title="Clínicas"
          description="CRM, agenda e equipe por organização — produto separado do app do paciente."
          actions={
            <Button
              type="button"
              variant="secondary"
              className="!rounded-lg !px-3 !py-2 text-xs"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Cancelar" : "Nova clínica"}
            </Button>
          }
        />

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-3 sm:p-5 mb-5 space-y-4"
          >
            <Input
              label="Nome da clínica"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Clínica Aurora"
              error={formError ?? undefined}
            />
            <Button
              type="submit"
              isLoading={createOrg.isPending}
              className="!rounded-lg sm:!w-auto"
            >
              Criar e abrir CRM
            </Button>
          </form>
        )}

        {error && (
          <ErrorMessage
            message="Não foi possível carregar suas clínicas."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] divide-y divide-[var(--clinic-border)]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 px-4 flex items-center animate-pulse">
                <div className="h-3 w-40 rounded bg-foreground/[0.06]" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && (!data || data.length === 0) && (
          <div className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-12 text-center">
            <h3 className="text-base font-semibold text-foreground/70 mb-2">
              Nenhuma clínica ainda
            </h3>
            <p className="text-sm text-foreground/40 max-w-sm mx-auto mb-4">
              Crie uma organização para cadastrar pacientes, convidar a equipe e
              operar o CRM clínico.
            </p>
            <Button
              type="button"
              className="w-auto mx-auto !rounded-lg"
              onClick={() => setShowForm(true)}
            >
              Criar clínica
            </Button>
          </div>
        )}

        {data && data.length > 0 && (
          <ul className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] divide-y divide-[var(--clinic-border)] overflow-hidden">
            {data.map(({ organization, membership }) => (
              <li key={organization.id}>
                <Link
                  href={`/clinic/${organization.id}`}
                  className="flex items-center justify-between gap-3 px-3 sm:px-4 py-3 hover:bg-[var(--clinic-row-hover)] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground/85 truncate">
                      {organization.name}
                    </p>
                    <p className="text-xs text-foreground/40 mt-0.5 truncate">
                      {ROLE_LABELS[membership.role] ?? membership.role} ·{" "}
                      {organization.timezone}
                    </p>
                  </div>
                  <span className="text-[var(--clinic-accent)] text-xs font-medium shrink-0">
                    Abrir →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </ClinicPageFrame>
  );
}
