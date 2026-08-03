"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  useCreateMedication,
  useMyDueReminders,
  useMyMedications,
  useMyReminderHistory,
  useRespondOccurrence,
} from "@/hooks/use-reminders";
import { useMyOrganizations } from "@/hooks/use-organizations";
import { ApiError } from "@anima/shared";

type Tab = "due" | "meds" | "history";

export default function PatientRemindersPage() {
  const { data: orgs, isLoading: orgsLoading, error: orgsError, refetch: refetchOrgs } =
    useMyOrganizations();

  const patientOrgs = useMemo(
    () => (orgs ?? []).filter((item) => item.membership.role === "PATIENT"),
    [orgs],
  );

  const [orgId, setOrgId] = useState("");
  const [tab, setTab] = useState<Tab>("due");

  useEffect(() => {
    if (!orgId && patientOrgs.length > 0) {
      setOrgId(patientOrgs[0].organization.id);
    }
  }, [orgId, patientOrgs]);

  const dueQuery = useMyDueReminders(orgId, 7);
  const medsQuery = useMyMedications(orgId);
  const historyQuery = useMyReminderHistory(orgId, 14);
  const createMed = useCreateMedication(orgId);
  const respond = useRespondOccurrence(orgId);

  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState("08:00");
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleCreateMed(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await createMed.mutateAsync({
        name,
        dose,
        schedule: { times: [time] },
        startsOn: new Date().toISOString().slice(0, 10),
        createReminder: true,
      });
      setName("");
      setDose("");
      setTab("due");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Falha ao salvar medicação.",
      );
    }
  }

  async function handleRespond(
    occurrenceId: string,
    status: "TOMADO" | "NAO_TOMADO" | "ADIADO",
  ) {
    setActionError(null);
    try {
      await respond.mutateAsync({
        occurrenceId,
        payload: {
          status,
          snoozeMinutes: status === "ADIADO" ? 30 : undefined,
        },
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao registrar resposta.",
      );
    }
  }

  if (orgsLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="h-40 rounded-2xl bg-foreground/[0.06] animate-pulse" />
      </div>
    );
  }

  if (orgsError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ErrorMessage
          message="Não foi possível carregar suas clínicas."
          onRetry={() => refetchOrgs()}
        />
      </div>
    );
  }

  if (patientOrgs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-foreground/90 mb-2">Lembretes</h1>
        <p className="text-sm text-foreground/45">
          Você precisa estar vinculado a uma clínica como paciente para usar
          lembretes.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          Lembretes
        </h1>
        <p className="text-sm text-foreground/40 mb-4">
          Medicação e atividades — adesão no seu ritmo
        </p>

        <div className="glass-panel p-4 mb-6 border border-amber-500/20">
          <p className="text-xs text-foreground/55 leading-relaxed">
            {medsQuery.data?.disclaimer ??
              "O sistema não prescreve nem altera doses; o registro reflete orientação profissional informada por você."}
          </p>
        </div>

        <div className="mb-6">
          <Select
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            aria-label="Clínica"
          >
            {patientOrgs.map((item) => (
              <option key={item.organization.id} value={item.organization.id}>
                {item.organization.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(
            [
              ["due", "Pendentes"],
              ["meds", "Medicações"],
              ["history", "Histórico"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                tab === id
                  ? "border-anima-violet/40 text-anima-violet"
                  : "border-foreground/10 text-foreground/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {actionError && (
          <div className="mb-4">
            <ErrorMessage message={actionError} />
          </div>
        )}

        {tab === "due" && (
          <DueList
            loading={dueQuery.isLoading}
            error={dueQuery.error}
            items={dueQuery.data ?? []}
            onRetry={() => dueQuery.refetch()}
            onRespond={handleRespond}
            busy={respond.isPending}
          />
        )}

        {tab === "meds" && (
          <div className="space-y-6">
            <form onSubmit={handleCreateMed} className="glass-panel p-5 space-y-3">
              <p className="text-sm font-medium text-foreground/70">
                Nova medicação
              </p>
              {formError && <ErrorMessage message={formError} />}
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome (ex.: Vitamina D)"
                required
              />
              <Input
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="Dose (ex.: 1000 UI)"
                required
              />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
              <Button type="submit" isLoading={createMed.isPending}>
                Salvar e criar lembrete
              </Button>
            </form>

            {medsQuery.isLoading && (
              <div className="h-24 rounded-2xl bg-foreground/[0.06] animate-pulse" />
            )}
            {medsQuery.error && (
              <ErrorMessage
                message={
                  medsQuery.error instanceof ApiError
                    ? medsQuery.error.message
                    : "Falha ao carregar medicações."
                }
                onRetry={() => medsQuery.refetch()}
              />
            )}
            <ul className="space-y-2">
              {(medsQuery.data?.data ?? []).map((med) => (
                <li key={med.id} className="glass-panel p-4">
                  <p className="text-sm font-medium text-foreground/80">
                    {med.name} · {med.dose}
                  </p>
                  <p className="text-xs text-foreground/40 mt-1">
                    {med.schedule.times.join(", ")} · {med.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "history" && (
          <HistoryList
            loading={historyQuery.isLoading}
            error={historyQuery.error}
            items={historyQuery.data ?? []}
            onRetry={() => historyQuery.refetch()}
          />
        )}
      </motion.div>
    </div>
  );
}

function DueList({
  loading,
  error,
  items,
  onRetry,
  onRespond,
  busy,
}: {
  loading: boolean;
  error: unknown;
  items: Array<{
    id: string;
    dueAt: string;
    status: string;
    reminder?: { title: string } | null;
  }>;
  onRetry: () => void;
  onRespond: (
    id: string,
    status: "TOMADO" | "NAO_TOMADO" | "ADIADO",
  ) => void;
  busy: boolean;
}) {
  if (loading) {
    return <div className="h-32 rounded-2xl bg-foreground/[0.06] animate-pulse" />;
  }
  if (error) {
    return (
      <ErrorMessage
        message={
          error instanceof ApiError
            ? error.message
            : "Não foi possível carregar pendentes."
        }
        onRetry={onRetry}
      />
    );
  }
  if (items.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-sm text-foreground/45">
        Nenhum lembrete pendente neste período.
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="glass-panel p-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground/80">
              {item.reminder?.title ?? "Lembrete"}
            </p>
            <p className="text-xs text-foreground/40 mt-1">
              {new Date(item.dueAt).toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="w-auto"
              disabled={busy}
              onClick={() => onRespond(item.id, "TOMADO")}
            >
              Tomado
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-auto"
              disabled={busy}
              onClick={() => onRespond(item.id, "NAO_TOMADO")}
            >
              Não tomado
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-auto"
              disabled={busy}
              onClick={() => onRespond(item.id, "ADIADO")}
            >
              Adiar 30 min
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function HistoryList({
  loading,
  error,
  items,
  onRetry,
}: {
  loading: boolean;
  error: unknown;
  items: Array<{
    id: string;
    dueAt: string;
    status: string;
    reason: string | null;
  }>;
  onRetry: () => void;
}) {
  if (loading) {
    return <div className="h-32 rounded-2xl bg-foreground/[0.06] animate-pulse" />;
  }
  if (error) {
    return (
      <ErrorMessage
        message={
          error instanceof ApiError
            ? error.message
            : "Não foi possível carregar o histórico."
        }
        onRetry={onRetry}
      />
    );
  }
  if (items.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-sm text-foreground/45">
        Sem histórico ainda.
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="glass-panel p-3 flex justify-between gap-3">
          <div>
            <p className="text-xs text-foreground/40">
              {new Date(item.dueAt).toLocaleString("pt-BR")}
            </p>
            {item.reason && (
              <p className="text-xs text-foreground/50 mt-1">{item.reason}</p>
            )}
          </div>
          <span className="text-[11px] text-foreground/60">{item.status}</span>
        </li>
      ))}
    </ul>
  );
}
