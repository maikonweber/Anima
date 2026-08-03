"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Select } from "@/components/ui/Select";
import {
  DAY_LABELS,
  MODALITY_LABELS,
} from "@/components/clinic/AppointmentStatusBadge";
import {
  ClinicPageFrame,
  ClinicPageHeader,
} from "@/components/clinic/ClinicPageFrame";
import {
  useAvailabilities,
  useCreateAvailability,
  useDeleteAvailability,
} from "@/hooks/use-agenda";
import type { AppointmentModality } from "@anima/shared";

export default function AvailabilityPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const { data, isLoading, error, refetch } = useAvailabilities(orgId);
  const createAvailability = useCreateAvailability(orgId);
  const deleteAvailability = useDeleteAvailability(orgId);

  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(50);
  const [modality, setModality] = useState<AppointmentModality>("ONLINE");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await createAvailability.mutateAsync({
        dayOfWeek,
        startTime,
        endTime,
        slotDurationMinutes,
        modality,
      });
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Falha ao criar disponibilidade.",
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
          eyebrow="Agenda"
          title="Disponibilidade"
          description="Grade semanal recorrente do profissional"
        />

        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-3 sm:p-5 space-y-4 mb-5"
        >
          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-1.5">
              Dia da semana
            </label>
            <Select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
            >
              {DAY_LABELS.map((label, index) => (
                <option key={label} value={index}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Início"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <Input
              label="Fim"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <Input
            label="Duração do slot (min)"
            type="number"
            min={15}
            max={240}
            value={slotDurationMinutes}
            onChange={(e) => setSlotDurationMinutes(Number(e.target.value))}
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
          {formError && <p className="text-xs text-red-400">{formError}</p>}
          <Button
            type="submit"
            isLoading={createAvailability.isPending}
            className="!rounded-lg"
          >
            Adicionar horário
          </Button>
        </form>

        {error && (
          <ErrorMessage
            message="Não foi possível carregar disponibilidades."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="rounded-xl border border-[var(--clinic-border)] divide-y divide-[var(--clinic-border)]">
            {[1, 2].map((i) => (
              <div key={i} className="h-12 px-4 animate-pulse flex items-center">
                <div className="h-3 w-40 rounded bg-foreground/[0.06]" />
              </div>
            ))}
          </div>
        )}

        <ul className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] divide-y divide-[var(--clinic-border)] overflow-hidden">
          {data?.map((item) => (
            <li
              key={item.id}
              className="px-3 sm:px-4 py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground/85 truncate">
                  {DAY_LABELS[item.dayOfWeek]} · {item.startTime.slice(0, 5)}–
                  {item.endTime.slice(0, 5)}
                </p>
                <p className="text-xs text-foreground/40 mt-0.5">
                  {MODALITY_LABELS[item.modality]} · {item.slotDurationMinutes}
                  min
                  {!item.active ? " · inativa" : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-auto !px-2 !py-1.5 text-xs shrink-0"
                isLoading={deleteAvailability.isPending}
                onClick={() => deleteAvailability.mutate(item.id)}
              >
                Remover
              </Button>
            </li>
          ))}
        </ul>

        {!isLoading && data?.length === 0 && (
          <div className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] px-4 py-8 text-center text-sm text-foreground/40">
            Nenhuma disponibilidade cadastrada.
          </div>
        )}
      </motion.div>
    </ClinicPageFrame>
  );
}
