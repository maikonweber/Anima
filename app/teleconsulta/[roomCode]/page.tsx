"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TeleconsultRoom } from "@/components/clinic/TeleconsultRoom";
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground/90 mb-2">
          Entrar na teleconsulta
        </h1>
        <p className="text-sm text-foreground/45 mb-6">
          Use o código fornecido pela clínica. É necessário estar logado e ter
          consentimento TELECONSULTA.
        </p>

        {authLoading || (join.isPending && !session && !error) ? (
          <div className="h-32 rounded-2xl bg-foreground/[0.06] animate-pulse" />
        ) : session ? (
          <TeleconsultRoom
            session={session}
            isInitiator={session.professionalUserId === user?.id}
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
  );
}
