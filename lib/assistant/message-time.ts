export function formatAssistantMessageTime(iso: string): string {
  const d = new Date(iso);
  const tMs = Date.now() - d.getTime();
  if (!Number.isFinite(tMs)) return "";

  const s = Math.floor(tMs / 1000);
  if (s < 45) return "agora";
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h} h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `há ${days} ${days === 1 ? "dia" : "dias"}`;

  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
