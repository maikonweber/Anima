import { absoluteUrl } from "@/lib/seo/site";

export function buildTeleconsultPatientUrl(roomCode: string): string {
  return absoluteUrl(`/teleconsulta/${encodeURIComponent(roomCode)}`);
}

export function buildTeleconsultWhatsAppMessage(roomCode: string): string {
  const url = buildTeleconsultPatientUrl(roomCode);
  return `Olá! Sua teleconsulta está pronta. Entre pelo link abaixo (faça login com sua conta):\n\n${url}`;
}
