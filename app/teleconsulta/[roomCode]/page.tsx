"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * Compatibilidade: links antigos `/teleconsulta/{code}` vão para a sala do paciente.
 * Profissional deve usar `/teleconsulta/{code}/profissional` (ou o redirect do painel clínico).
 */
export default function TeleconsultLegacyRoomRedirect() {
  const params = useParams<{ roomCode: string }>();
  const router = useRouter();
  const roomCode = params.roomCode ?? "";

  useEffect(() => {
    if (!roomCode) return;
    router.replace(
      `/teleconsulta/${encodeURIComponent(roomCode)}/paciente`,
    );
  }, [roomCode, router]);

  return (
    <div className="teleconsult-shell min-h-[100dvh] flex items-center justify-center px-4">
      <p className="text-sm text-foreground/45">Abrindo sala do paciente…</p>
    </div>
  );
}
