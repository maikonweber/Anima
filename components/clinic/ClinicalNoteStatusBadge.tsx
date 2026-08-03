import type { ClinicalNoteStatus } from "@anima/shared";

const STATUS_STYLES: Record<ClinicalNoteStatus, string> = {
  RASCUNHO: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  ASSINADA: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export const CLINICAL_NOTE_STATUS_LABELS: Record<ClinicalNoteStatus, string> =
  {
    RASCUNHO: "Rascunho",
    ASSINADA: "Assinada",
  };

export function ClinicalNoteStatusBadge({
  status,
}: {
  status: ClinicalNoteStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status]}`}
    >
      {CLINICAL_NOTE_STATUS_LABELS[status]}
    </span>
  );
}
