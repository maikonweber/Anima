import { absoluteUrl } from "@/lib/seo/site";

/** Canonical patient room URL (WebRTC answer side). */
export function buildTeleconsultPatientUrl(
  roomCode: string,
  _patientJoinUrl?: string | null,
): string {
  return absoluteUrl(
    `/teleconsulta/${encodeURIComponent(roomCode)}/paciente`,
  );
}

/** Canonical professional room URL (WebRTC offer side). */
export function buildTeleconsultProfessionalUrl(roomCode: string): string {
  return absoluteUrl(
    `/teleconsulta/${encodeURIComponent(roomCode)}/profissional`,
  );
}

export function buildTeleconsultWhatsAppMessage(
  roomCode: string,
  patientJoinUrl?: string | null,
): string {
  const url = buildTeleconsultPatientUrl(roomCode, patientJoinUrl);
  return `Olá! Sua teleconsulta está pronta. Entre pelo link abaixo (faça login com sua conta):\n\n${url}`;
}
