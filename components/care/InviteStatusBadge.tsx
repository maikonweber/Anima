import type { CareInviteStatus } from "@/lib/types";

const STATUS_STYLES: Record<
  CareInviteStatus,
  { label: string; className: string }
> = {
  PENDENTE: {
    label: "Pendente",
    className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  },
  ACEITO: {
    label: "Aceito",
    className: "bg-green-500/15 text-green-600 border-green-500/30",
  },
  REVOGADO: {
    label: "Revogado",
    className: "bg-red-500/15 text-red-500 border-red-500/30",
  },
};

export function InviteStatusBadge({ status }: { status: CareInviteStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${style.className}`}
    >
      {style.label}
    </span>
  );
}
