import { absoluteUrl } from "@/lib/seo/site";

export function buildTeleconsultPatientUrl(
  roomCode: string,
  patientJoinUrl?: string | null,
): string {
  if (patientJoinUrl?.trim()) {
    return patientJoinUrl.trim();
  }
  return absoluteUrl(`/teleconsulta/${encodeURIComponent(roomCode)}`);
}

export function buildTeleconsultWhatsAppMessage(
  roomCode: string,
  patientJoinUrl?: string | null,
): string {
  const url = buildTeleconsultPatientUrl(roomCode, patientJoinUrl);
  return `Olá! Sua teleconsulta está pronta. Entre pelo link abaixo (faça login com sua conta):\n\n${url}`;
}
