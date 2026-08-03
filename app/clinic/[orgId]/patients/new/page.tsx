"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  ClinicPageFrame,
  ClinicPageHeader,
} from "@/components/clinic/ClinicPageFrame";
import { useCreatePatient } from "@/hooks/use-patients";
import type { PatientStatus } from "@anima/shared";
import { STATUS_LABELS } from "@/components/clinic/PatientStatusBadge";

export default function NewPatientPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const router = useRouter();
  const createPatient = useCreatePatient(orgId);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<PatientStatus>("LEAD");
  const [operationalNotes, setOperationalNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (fullName.trim().length < 2) {
      setError("Informe o nome completo.");
      return;
    }
    try {
      const patient = await createPatient.mutateAsync({
        fullName: fullName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        status,
        operationalNotes: operationalNotes.trim() || undefined,
      });
      router.push(`/clinic/${orgId}/patients/${patient.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível cadastrar.",
      );
    }
  }

  return (
    <ClinicPageFrame width="narrow">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ClinicPageHeader
          eyebrow="Cadastro"
          title="Novo paciente"
          description="Cadastro operacional do CRM (sem notas clínicas)"
        />

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-3 sm:p-5 space-y-4"
        >
          <Input
            label="Nome completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-1.5">
              Status inicial
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as PatientStatus)}
            >
              {(Object.keys(STATUS_LABELS) as PatientStatus[]).map((key) => (
                <option key={key} value={key}>
                  {STATUS_LABELS[key]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-1.5">
              Notas operacionais
            </label>
            <textarea
              value={operationalNotes}
              onChange={(e) => setOperationalNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm bg-foreground/[0.03] border border-[var(--clinic-border)] text-foreground/90 placeholder:text-foreground/25 focus:outline-none focus:ring-2 focus:ring-[var(--clinic-accent)]/25"
              placeholder="Preferências de horário, contatos etc."
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" isLoading={createPatient.isPending} className="!rounded-lg">
            Salvar paciente
          </Button>
        </form>
      </motion.div>
    </ClinicPageFrame>
  );
}
