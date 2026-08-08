"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TeleconsultRoom } from "@/components/clinic/TeleconsultRoom";
import { TeleconsultFeatureGate } from "@/components/clinic/TeleconsultDisabledNotice";
import { useJoinTeleconsult } from "@/hooks/use-teleconsult";
import { useAuth } from "@/providers/auth-provider";
import type { TeleconsultSession } from "@anima/shared";

export default function TeleconsultJoinPage() {
  const params = useParams<{ roomCode: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const join = useJoinTeleconsult();
  const [roomCode, setRoomCode] = useState(params.roomCode ?? "");
  const [session, setSession] = useState<TeleconsultSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !params.roomCode || !user || session) return;
    let cancelled = false;
    void join
      .mutateAsync(params.roomCode)
      .then((result) => {
        if (!cancelled) setSession(result);
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
  }, [authLoading, params.roomCode, user?.id]);

  async function handleJoin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) {
      router.push(
        `/login?next=${encodeURIComponent(`/teleconsulta/${roomCode.trim()}`)}`,
      );
      return;
    }
    try {
      const result = await join.mutateAsync(roomCode.trim());
      setSession(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao entrar na sala");
    }
  }

  const isPatientView =
    session?.viewerRole === "PATIENT" ||
    (!session?.viewerRole &&
      session?.professionalUserId !== user?.id);

  return (
    <TeleconsultFeatureGate backHref="/dashboard" backLabel="← Voltar ao início">
    <div className="teleconsult-shell min-h-[100dvh]">
      <div className="teleconsult-page max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-medium tracking-wide text-[var(--teleconsult-accent)] mb-2">
            EmotiveCare · Teleconsulta
          </p>
          <h1 className="text-2xl font-bold text-foreground/90 mb-2">
            {session
              ? isPatientView
                ? "Sua consulta"
                : "Sala clínica"
              : "Entrar na teleconsulta"}
          </h1>
          <p className="text-sm text-foreground/45 mb-6">
            {session
              ? isPatientView
                ? "Você está na sala do paciente. O profissional entra pelo painel da clínica."
                : "Você entrou pelo link do paciente com perfil clínico."
              : "Use o código fornecido pela clínica. É necessário estar logado e ter consentimento TELECONSULTA."}
          </p>

          {authLoading || (join.isPending && !session && !error) ? (
            <div className="h-32 rounded-2xl bg-foreground/[0.06] animate-pulse" />
          ) : session ? (
            <TeleconsultRoom
              session={session}
              viewerRole={session.viewerRole}
              isInitiator={session.isInitiator}
              enablePostConsultBriefing={session.viewerRole !== "PATIENT"}
              onEnded={(updated) => {
                setSession(updated);
                router.push(isPatientView ? "/dashboard" : "/");
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
