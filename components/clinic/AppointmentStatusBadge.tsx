import type { AppointmentStatus } from "@anima/shared";

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  AGENDADA: "bg-foreground/[0.06] text-foreground/60",
  CONFIRMADA: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REMARCADA: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  CANCELADA: "bg-red-500/10 text-red-600 dark:text-red-300",
  CONCLUIDA: "bg-anima-violet/10 text-anima-violet",
  NO_SHOW: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  AGENDADA: "Agendada",
  CONFIRMADA: "Confirmada",
  REMARCADA: "Remarcada",
  CANCELADA: "Cancelada",
  CONCLUIDA: "Concluída",
  NO_SHOW: "Falta",
};

export const DAY_LABELS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

export const MODALITY_LABELS = {
  PRESENCIAL: "Presencial",
  ONLINE: "Online",
  HIBRIDO: "Híbrido",
} as const;

export function AppointmentStatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status]}`}
    >
      {APPOINTMENT_STATUS_LABELS[status]}
    </span>
  );
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function localInputToIso(value: string): string {
  return new Date(value).toISOString();
}
