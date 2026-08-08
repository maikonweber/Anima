"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TeleconsultRoom } from "@/components/clinic/TeleconsultRoom";
import { TeleconsultFeatureGate } from "@/components/clinic/TeleconsultDisabledNotice";
import { useJoinTeleconsult } from "@/hooks/use-teleconsult";
import { useAuth } from "@/providers/auth-provider";
import type { TeleconsultSession, TeleconsultViewerRole } from "@anima/shared";

export type TeleconsultRouteRole = "paciente" | "profissional";

type Props = {
  roomCodeParam: string;
  routeRole: TeleconsultRouteRole;
};

function isPatientRole(role: TeleconsultViewerRole | undefined): boolean {
  return role === "PATIENT";
}

function isClinicianRole(role: TeleconsultViewerRole | undefined): boolean {
  return role === "PROFESSIONAL" || role === "CLINIC_ADMIN";
}

function roleMatchesRoute(
  routeRole: TeleconsultRouteRole,
  viewerRole: TeleconsultViewerRole | undefined,
): boolean {
  if (routeRole === "paciente") return isPatientRole(viewerRole);
  return isClinicianRole(viewerRole);
}

export function TeleconsultRoleJoinShell({
  roomCodeParam,
  routeRole,
}: Props) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const join = useJoinTeleconsult();
  const [roomCode, setRoomCode] = useState(roomCodeParam ?? "");
  const [session, setSession] = useState<TeleconsultSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loginNext = useMemo(
    () =>
      `/teleconsulta/${encodeURIComponent(roomCodeParam || roomCode.trim())}/${routeRole}`,
    [roomCode, roomCodeParam, routeRole],
  );

  const preferredAs =
    routeRole === "paciente" ? ("PATIENT" as const) : ("PROFESSIONAL" as const);

  useEffect(() => {
    if (authLoading || !roomCodeParam || !user || session) return;
    let cancelled = false;
    void join
      .mutateAsync({ roomCode: roomCodeParam, as: preferredAs })
      .then((result) => {
        if (cancelled) return;
        if (!roleMatchesRoute(routeRole, result.viewerRole)) {
          const role = result.viewerRole ?? "desconhecido";
          setError(
            routeRole === "paciente"
              ? `Esta URL é só para o paciente (API retornou ${role}). Entre com a conta do paciente vinculada à sessão.`
              : `Esta URL é só para o profissional (API retornou ${role}). Faça login com a conta da clínica.`,
          );
          setSession(null);
          return;
        }
        setSession(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Falha ao entrar na sala",
          );
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, roomCodeParam, user?.id, routeRole, preferredAs]);

  async function handleJoin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(loginNext)}`);
      return;
    }
    try {
      const result = await join.mutateAsync({
        roomCode: roomCode.trim(),
        as: preferredAs,
      });
      if (!roleMatchesRoute(routeRole, result.viewerRole)) {
        const role = result.viewerRole ?? "desconhecido";
        setError(
          routeRole === "paciente"
            ? `Esta URL é só para o paciente (API retornou ${role}).`
            : `Esta URL é só para o profissional (API retornou ${role}).`,
        );
        return;
      }
      setSession(result);
      if (roomCode.trim() !== roomCodeParam) {
        router.replace(
          `/teleconsulta/${encodeURIComponent(roomCode.trim())}/${routeRole}`,
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao entrar na sala");
    }
  }

  const isPatientRoute = routeRole === "paciente";
  const forcedViewerRole: TeleconsultViewerRole = isPatientRoute
    ? "PATIENT"
    : session?.viewerRole === "CLINIC_ADMIN"
      ? "CLINIC_ADMIN"
      : "PROFESSIONAL";
  // A rota define o lado WebRTC: profissional = offer, paciente = answer.
  const forcedInitiator = !isPatientRoute;

  return (
    <TeleconsultFeatureGate
      backHref={isPatientRoute ? "/dashboard" : "/clinic"}
      backLabel={isPatientRoute ? "← Voltar ao início" : "← Voltar às clínicas"}
    >
      <div className="teleconsult-shell min-h-[100dvh]">
        <div className="teleconsult-page max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs font-medium tracking-wide text-[var(--teleconsult-accent)] mb-2">
              EmotiveCare · Teleconsulta ·{" "}
              {isPatientRoute ? "Paciente" : "Profissional"}
            </p>
            <h1 className="text-2xl font-bold text-foreground/90 mb-2">
              {session
                ? isPatientRoute
                  ? "Sua consulta"
                  : "Sala clínica"
                : isPatientRoute
                  ? "Entrar como paciente"
                  : "Entrar como profissional"}
            </h1>
            <p className="text-sm text-foreground/45 mb-6">
              {session
                ? isPatientRoute
                  ? "Sala do paciente. Câmera e áudio locais; o vídeo do profissional aparece quando a oferta WebRTC chegar."
                  : "Sala do profissional. Você inicia a conexão (offer); o paciente responde nesta sessão."
                : "É necessário estar logado e ter consentimento TELECONSULTA. Use o código da sala."}
            </p>

            {authLoading || (join.isPending && !session && !error) ? (
              <div className="h-32 rounded-2xl bg-foreground/[0.06] animate-pulse" />
            ) : session ? (
              <TeleconsultRoom
                session={session}
                viewerRole={forcedViewerRole}
                isInitiator={forcedInitiator}
                enablePostConsultBriefing={!isPatientRoute}
                onEnded={(updated) => {
                  setSession(updated);
                  router.push(isPatientRoute ? "/dashboard" : "/clinic");
                }}
              />
            ) : (
              <form onSubmit={handleJoin} className="glass-panel p-6 space-y-3">
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="Código da sala"
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <Button type="submit" isLoading={join.isPending}>
                  Entrar
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </TeleconsultFeatureGate>
  );
}
