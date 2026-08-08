"use client";

import { FormEvent, useMemo, useState } from "react";
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
  formatTimeLabel,
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
import { useLocale } from "@/lib/i18n/locale-provider";
import type { AppointmentModality, ProfessionalAvailability } from "@anima/shared";

function groupByDay(items: ProfessionalAvailability[]) {
  const grouped = new Map<number, ProfessionalAvailability[]>();
  for (let day = 0; day < DAY_LABELS.length; day += 1) {
    grouped.set(day, []);
  }
  for (const item of items) {
    const slots = grouped.get(item.dayOfWeek) ?? [];
    slots.push(item);
    grouped.set(item.dayOfWeek, slots);
  }
  for (const slots of grouped.values()) {
    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
  return grouped;
}

export default function AvailabilityPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const { localizedHref } = useLocale();
  const { data, isLoading, error, refetch } = useAvailabilities(orgId);
  const createAvailability = useCreateAvailability(orgId);
  const deleteAvailability = useDeleteAvailability(orgId);

  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(50);
  const [modality, setModality] = useState<AppointmentModality>("ONLINE");
  const [formError, setFormError] = useState<string | null>(null);

  const groupedByDay = useMemo(() => groupByDay(data ?? []), [data]);

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
          actions={
            <Link href={localizedHref(`/clinic/${orgId}/agenda`)}>
              <Button
                type="button"
                variant="secondary"
                className="!rounded-lg !px-3.5 !py-2.5 text-sm clinic-btn-secondary"
              >
                ← Voltar à agenda
              </Button>
            </Link>
          }
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
              value={String(dayOfWeek)}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
            >
              {DAY_LABELS.map((label, index) => (
                <option key={label} value={String(index)}>
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

        <div className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] overflow-hidden">
          {error && (
            <div className="p-4">
              <ErrorMessage
                message="Não foi possível carregar disponibilidades."
                onRetry={() => refetch()}
              />
            </div>
          )}

          {isLoading && (
            <div className="divide-y divide-[var(--clinic-border)]">
              {DAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="px-3 sm:px-4 py-3 animate-pulse flex items-center gap-3"
                >
                  <div className="h-3 w-16 rounded bg-foreground/[0.06]" />
                  <div className="h-3 flex-1 max-w-xs rounded bg-foreground/[0.04]" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && data?.length === 0 && (
            <div className="px-4 py-10 text-center">
              <h3 className="text-base font-semibold text-foreground/70 mb-1">
                Nenhuma disponibilidade cadastrada
              </h3>
              <p className="text-sm text-foreground/40">
                Adicione horários recorrentes para liberar agendamentos.
              </p>
            </div>
          )}

          {!isLoading && !error && data && data.length > 0 && (
            <div className="divide-y divide-[var(--clinic-border)]">
              {DAY_LABELS.map((label, dayIndex) => {
                const slots = groupedByDay.get(dayIndex) ?? [];
                return (
                  <section
                    key={label}
                    className="px-3 sm:px-4 py-3 sm:py-3.5"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <p className="w-16 sm:w-20 shrink-0 text-xs sm:text-sm font-semibold text-foreground/70 pt-0.5">
                        {label}
                      </p>
                      {slots.length === 0 ? (
                        <p className="text-sm text-foreground/30 pt-0.5">
                          Sem horários
                        </p>
                      ) : (
                        <ul className="flex-1 min-w-0 space-y-2">
                          {slots.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-center justify-between gap-3 rounded-lg border border-[var(--clinic-border)] bg-foreground/[0.015] px-3 py-2"
                            >
                              <div className="min-w-0 flex-1 pr-2">
                                <p className="text-sm font-medium text-foreground/85 truncate">
                                  {formatTimeLabel(item.startTime)}–
                                  {formatTimeLabel(item.endTime)}
                                </p>
                                <p className="text-xs text-foreground/40 mt-0.5 truncate">
                                  {MODALITY_LABELS[item.modality]} ·{" "}
                                  {item.slotDurationMinutes} min
                                  {!item.active ? " · inativa" : ""}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                className="!w-auto !shrink-0 !px-2.5 !py-1.5 text-xs whitespace-nowrap"
                                isLoading={
                                  deleteAvailability.isPending &&
                                  deleteAvailability.variables === item.id
                                }
                                onClick={() =>
                                  deleteAvailability.mutate(item.id)
                                }
                              >
                                Remover
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </ClinicPageFrame>
  );
}
