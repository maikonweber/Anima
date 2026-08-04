"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useUserMedia } from "@/hooks/use-user-media";
import {
  endTeleconsult,
  postTeleconsultSignal,
  pullTeleconsultSignals,
} from "@/lib/api/teleconsult";
import type { TeleconsultSession } from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
];

type Props = {
  session: TeleconsultSession;
  isInitiator: boolean;
  /** Chamado após encerrar com sucesso (ex.: navegar para a agenda). */
  onEnded?: (session: TeleconsultSession) => void;
};

export function TeleconsultRoom({ session, isInitiator, onEnded }: Props) {
  const { user } = useAuth();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const lastSignalId = useRef<string | undefined>(undefined);
  const makingOffer = useRef(false);
  const pollStopped = useRef(false);
  const [remoteReady, setRemoteReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);
  const [ended, setEnded] = useState(
    session.status === "ENCERRADA" || session.status === "CANCELADA",
  );

  const {
    activeStream,
    ready,
    accessGranted,
    muted,
    videoOff,
    audioDevices,
    videoDevices,
    toggleMute,
    toggleVideo,
    switchInput,
    stopAllStreaming,
    checkPermission,
  } = useUserMedia();

  useEffect(() => {
    if (localVideoRef.current && activeStream) {
      localVideoRef.current.srcObject = activeStream;
    }
  }, [activeStream]);

  const ensurePeer = useCallback(() => {
    if (pcRef.current) return pcRef.current;
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteReady(true);
      }
    };

    pc.onicecandidate = (event) => {
      if (!event.candidate) return;
      void postTeleconsultSignal(session.organizationId, session.id, {
        type: "ice",
        payload: event.candidate.toJSON(),
      });
    };

    return pc;
  }, [session.id, session.organizationId]);

  useEffect(() => {
    if (!activeStream) return;
    const pc = ensurePeer();
    for (const track of activeStream.getTracks()) {
      const sender = pc.getSenders().find((s) => s.track?.kind === track.kind);
      if (sender) {
        void sender.replaceTrack(track);
      } else {
        pc.addTrack(track, activeStream);
      }
    }
  }, [activeStream, ensurePeer]);

  useEffect(() => {
    if (ended || !ready || !accessGranted || !isInitiator || !activeStream) return;
    let cancelled = false;

    async function createOffer() {
      try {
        makingOffer.current = true;
        const pc = ensurePeer();
        const offer = await pc.createOffer();
        if (cancelled) return;
        await pc.setLocalDescription(offer);
        await postTeleconsultSignal(session.organizationId, session.id, {
          type: "offer",
          payload: offer,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao criar oferta WebRTC",
        );
      } finally {
        makingOffer.current = false;
      }
    }

    void createOffer();
    return () => {
      cancelled = true;
    };
  }, [
    accessGranted,
    activeStream,
    ended,
    ensurePeer,
    isInitiator,
    ready,
    session.id,
    session.organizationId,
  ]);

  useEffect(() => {
    if (ended) return;
    pollStopped.current = false;

    async function poll() {
      while (!pollStopped.current) {
        try {
          const messages = await pullTeleconsultSignals(
            session.organizationId,
            session.id,
            lastSignalId.current,
          );
          for (const msg of messages) {
            lastSignalId.current = msg.id;
            if (msg.fromUserId === user?.id) continue;
            const pc = ensurePeer();
            if (msg.type === "offer" && !isInitiator) {
              await pc.setRemoteDescription(
                msg.payload as RTCSessionDescriptionInit,
              );
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              await postTeleconsultSignal(session.organizationId, session.id, {
                type: "answer",
                payload: answer,
              });
            } else if (msg.type === "answer" && isInitiator) {
              await pc.setRemoteDescription(
                msg.payload as RTCSessionDescriptionInit,
              );
            } else if (msg.type === "ice") {
              try {
                await pc.addIceCandidate(msg.payload as RTCIceCandidateInit);
              } catch {
                // ignore late candidates
              }
            }
          }
        } catch {
          // keep polling
        }
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    void poll();
    return () => {
      pollStopped.current = true;
    };
  }, [
    ended,
    ensurePeer,
    isInitiator,
    session.id,
    session.organizationId,
    user?.id,
  ]);

  useEffect(() => {
    return () => {
      pcRef.current?.close();
      pcRef.current = null;
      void stopAllStreaming();
    };
  }, [stopAllStreaming]);

  const teardownMedia = useCallback(async () => {
    pollStopped.current = true;
    pcRef.current?.close();
    pcRef.current = null;
    await stopAllStreaming();
  }, [stopAllStreaming]);

  async function handleEnd() {
    if (ending || ended) return;
    setEnding(true);
    setError(null);
    try {
      const updated = await endTeleconsult(
        session.organizationId,
        session.id,
      );
      await teardownMedia();
      setEnded(true);
      onEnded?.(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao encerrar");
    } finally {
      setEnding(false);
    }
  }

  if (ended) {
    return (
      <div className="glass-panel p-6 space-y-3">
        <p className="text-sm text-foreground/70">Sessão encerrada.</p>
        <p className="text-[11px] text-foreground/35">
          Código da sala: <code>{session.roomCode}</code> · status ENCERRADA
        </p>
      </div>
    );
  }

  if (ready && !accessGranted) {
    return (
      <div className="glass-panel p-6 space-y-3">
        <p className="text-sm text-foreground/60">
          Permita acesso à câmera e ao microfone para entrar na teleconsulta.
        </p>
        <Button type="button" onClick={() => void checkPermission()}>
          Permitir acesso
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-foreground/10">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          <span className="absolute left-3 bottom-3 text-[11px] px-2 py-0.5 rounded-md bg-black/50 text-white">
            Você
          </span>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-foreground/10">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
          <span className="absolute left-3 bottom-3 text-[11px] px-2 py-0.5 rounded-md bg-black/50 text-white">
            {remoteReady ? "Remoto" : "Aguardando participante…"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={toggleMute}>
          {muted ? "Ativar microfone" : "Mute"}
        </Button>
        <Button type="button" variant="secondary" onClick={toggleVideo}>
          {videoOff ? "Ligar vídeo" : "Desligar vídeo"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-red-500"
          isLoading={ending}
          onClick={() => void handleEnd()}
        >
          Encerrar
        </Button>
      </div>

      {(videoDevices.length > 1 || audioDevices.length > 1) && (
        <div className="grid gap-2 sm:grid-cols-2">
          {videoDevices.length > 0 && (
            <select
              className="rounded-xl px-3 py-2 text-sm bg-foreground/[0.03] border border-foreground/[0.08]"
              onChange={(e) => void switchInput(e.target.value, "video")}
              defaultValue=""
            >
              <option value="" disabled>
                Câmera…
              </option>
              {videoDevices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || d.deviceId.slice(0, 8)}
                </option>
              ))}
            </select>
          )}
          {audioDevices.length > 0 && (
            <select
              className="rounded-xl px-3 py-2 text-sm bg-foreground/[0.03] border border-foreground/[0.08]"
              onChange={(e) => void switchInput(e.target.value, "audio")}
              defaultValue=""
            >
              <option value="" disabled>
                Microfone…
              </option>
              {audioDevices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || d.deviceId.slice(0, 8)}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <p className="text-[11px] text-foreground/35">
        Código da sala: <code>{session.roomCode}</code> · status {session.status}
      </p>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
