import type { PatientStatus } from "@anima/shared";

const STATUS_STYLES: Record<PatientStatus, string> = {
  LEAD: "bg-foreground/[0.06] text-foreground/60",
  TRIAGEM: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  ATIVO: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  PAUSADO: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  ALTA: "bg-anima-violet/10 text-anima-violet",
  INATIVO: "bg-foreground/[0.04] text-foreground/35",
};

const STATUS_LABELS: Record<PatientStatus, string> = {
  LEAD: "Lead",
  TRIAGEM: "Triagem",
  ATIVO: "Ativo",
  PAUSADO: "Pausado",
  ALTA: "Alta",
  INATIVO: "Inativo",
};

export function PatientStatusBadge({ status }: { status: PatientStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export { STATUS_LABELS };
