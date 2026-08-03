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
  DAY_LABELS,
  MODALITY_LABELS,
} from "@/components/clinic/AppointmentStatusBadge";
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
          Disponibilidade
        </h1>
        <p className="text-sm text-foreground/40 mb-8">
          Grade semanal recorrente do profissional
        </p>

        <form onSubmit={handleCreate} className="glass-panel p-5 space-y-4 mb-8">
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
          <Button type="submit" isLoading={createAvailability.isPending}>
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
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-foreground/[0.06] animate-pulse"
              />
            ))}
          </div>
        )}

        <ul className="space-y-3">
          {data?.map((item) => (
            <li
              key={item.id}
              className="glass-panel p-4 flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-semibold text-foreground/85">
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
                className="w-auto"
                isLoading={deleteAvailability.isPending}
                onClick={() => deleteAvailability.mutate(item.id)}
              >
                Remover
              </Button>
            </li>
          ))}
        </ul>

        {!isLoading && data?.length === 0 && (
          <div className="glass-panel p-8 text-center text-sm text-foreground/40">
            Nenhuma disponibilidade cadastrada.
          </div>
        )}
      </motion.div>
    </div>
  );
}
