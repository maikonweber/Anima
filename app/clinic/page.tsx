"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
              Clínicas
            </h1>
            <p className="text-sm text-foreground/40">
              Gestão multi-tenant EmotiveCare — CRM e equipe por organização
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-auto whitespace-nowrap"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancelar" : "Nova clínica"}
          </Button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="glass-panel p-5 mb-6 space-y-4"
          >
            <Input
              label="Nome da clínica"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Clínica Aurora"
              error={formError ?? undefined}
            />
            <Button type="submit" isLoading={createOrg.isPending}>
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
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-foreground/[0.06] animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && !error && (!data || data.length === 0) && (
          <div className="glass-panel p-10 text-center">
            <h3 className="text-base font-semibold text-foreground/70 mb-2">
              Nenhuma clínica ainda
            </h3>
            <p className="text-sm text-foreground/40 max-w-sm mx-auto mb-4">
              Crie uma organização para cadastrar pacientes, convidar a equipe e
              operar o CRM clínico.
            </p>
            <Button
              type="button"
              className="w-auto mx-auto"
              onClick={() => setShowForm(true)}
            >
              Criar clínica
            </Button>
          </div>
        )}

        <ul className="space-y-3">
          {data?.map(({ organization, membership }) => (
            <li key={organization.id}>
              <Link
                href={`/clinic/${organization.id}`}
                className="block glass-panel p-5 hover:scale-[1.01] transition-transform duration-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground/85">
                      {organization.name}
                    </p>
                    <p className="text-xs text-foreground/40 mt-0.5">
                      {ROLE_LABELS[membership.role] ?? membership.role} ·{" "}
                      {organization.timezone}
                    </p>
                  </div>
                  <span className="text-anima-violet text-sm">Abrir →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
