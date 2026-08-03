import type { ConsentPurpose, ConsentStatus } from "@anima/shared";

const STATUS_STYLES: Record<ConsentStatus, string> = {
  PENDENTE: "bg-foreground/[0.06] text-foreground/60",
  CONCEDIDO: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  REVOGADO: "bg-red-500/10 text-red-600 dark:text-red-300",
  EXPIRADO: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
};

export const CONSENT_STATUS_LABELS: Record<ConsentStatus, string> = {
  PENDENTE: "Pendente",
  CONCEDIDO: "Concedido",
  REVOGADO: "Revogado",
  EXPIRADO: "Expirado",
};

export const CONSENT_PURPOSE_LABELS: Record<ConsentPurpose, string> = {
  TRATAMENTO_CLINICO: "Tratamento clínico",
  PRONTUARIO: "Prontuário",
  DIARIO_CHECKIN: "Diário / check-in",
  TELECONSULTA: "Teleconsulta",
  IA_ASSISTIVA: "IA assistiva",
  PESQUISA_QUALIDADE: "Pesquisa e qualidade",
  DASHBOARD_PROFISSIONAL: "Dashboard profissional",
  LEMBRETES: "Lembretes e adesão",
};

export const CONSENT_CHANNEL_LABELS = {
  APP: "App",
  PAPER: "Papel / TCLE",
  VERBAL_RECORDED: "Verbal registrado",
  OTHER: "Outro",
} as const;

export function ConsentStatusBadge({ status }: { status: ConsentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status]}`}
    >
      {CONSENT_STATUS_LABELS[status]}
    </span>
  );
}
