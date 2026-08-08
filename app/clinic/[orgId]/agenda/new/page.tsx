"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useCreateAppointment } from "@/hooks/use-agenda";
import { usePatients } from "@/hooks/use-patients";
import type { AppointmentModality } from "@anima/shared";
import {
  MODALITY_LABELS,
  localInputToIso,
  toLocalInputValue,
} from "@/components/clinic/AppointmentStatusBadge";
import { useFeatureFlagsContext } from "@/providers/feature-flags-provider";

export default function NewAppointmentPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const router = useRouter();
  const createAppointment = useCreateAppointment(orgId);
  const { teleconsult: teleconsultEnabled } = useFeatureFlagsContext();
  const patientsQuery = usePatients(orgId, {
    status: "ATIVO",
    limit: 100,
    page: 1,
  });
  const allPatients = usePatients(orgId, { limit: 100, page: 1 });

  const patientOptions = useMemo(() => {
    const map = new Map(
      [...(patientsQuery.data?.items ?? []), ...(allPatients.data?.items ?? [])].map(
        (p) => [p.id, p],
      ),
    );
    return Array.from(map.values());
  }, [patientsQuery.data, allPatients.data]);

  const defaultStart = useMemo(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return d;
  }, []);
  const defaultEnd = useMemo(() => {
    const d = new Date(defaultStart);
    d.setMinutes(d.getMinutes() + 50);
    return d;
  }, [defaultStart]);

  const [patientId, setPatientId] = useState("");
  const [startsAt, setStartsAt] = useState(toLocalInputValue(defaultStart));
  const [endsAt, setEndsAt] = useState(toLocalInputValue(defaultEnd));
  const [modality, setModality] = useState<AppointmentModality>("ONLINE");
  const [locationOrLink, setLocationOrLink] = useState("");
  const [operationalNotes, setOperationalNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!patientId) {
      setError("Selecione um paciente.");
      return;
    }
    try {
      const appointment = await createAppointment.mutateAsync({
        patientId,
        startsAt: localInputToIso(startsAt),
        endsAt: localInputToIso(endsAt),
        modality,
        locationOrLink: locationOrLink.trim() || undefined,
        operationalNotes: operationalNotes.trim() || undefined,
      });
      router.push(`/clinic/${orgId}/agenda/${appointment.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível agendar.",
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
          href={`/clinic/${orgId}/agenda`}
          className="text-sm text-foreground/40 hover:text-anima-violet mb-4 inline-block"
        >
          ← Agenda
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          Nova sessão
        </h1>
        <p className="text-sm text-foreground/40 mb-8">
          Agenda uma sessão com paciente do CRM deste tenant
        </p>

        <form onSubmit={handleSubmit} className="glass-panel p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-1.5">
              Paciente
            </label>
            <Select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {patientOptions.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.fullName}
                  {patient.status !== "ATIVO" ? ` (${patient.status})` : ""}
                </option>
              ))}
            </Select>
            {patientOptions.length === 0 && (
              <p className="mt-2 text-xs text-foreground/40">
                Nenhum paciente no CRM.{" "}
                <Link
                  href={`/clinic/${orgId}/patients/new`}
                  className="text-anima-violet underline"
                >
                  Cadastrar agora
                </Link>
              </p>
            )}
          </div>

          <Input
            label="Início"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
          <Input
            label="Fim"
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-1.5">
              Modalidade
            </label>
            <Select
              value={modality}
              onChange={(e) =>
                setModality(e.target.value as AppointmentModality)
              }
            >
              {(Object.keys(MODALITY_LABELS) as AppointmentModality[]).map(
                (key) => (
                  <option key={key} value={key}>
                    {MODALITY_LABELS[key]}
                  </option>
                ),
              )}
            </Select>
          </div>

          <Input
            label={
              !teleconsultEnabled && modality === "ONLINE"
                ? "Link do Google Meet"
                : "Link ou local"
            }
            value={locationOrLink}
            onChange={(e) => setLocationOrLink(e.target.value)}
            placeholder={
              !teleconsultEnabled && modality === "ONLINE"
                ? "https://meet.google.com/abc-defg-hij"
                : "https://meet... ou endereço"
            }
          />

          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-1.5">
              Notas operacionais
            </label>
            <textarea
              value={operationalNotes}
              onChange={(e) => setOperationalNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm bg-foreground/[0.03] border border-foreground/[0.08] text-foreground/90"
              placeholder="Observações para secretaria/profissional"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" isLoading={createAppointment.isPending}>
            Agendar
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
