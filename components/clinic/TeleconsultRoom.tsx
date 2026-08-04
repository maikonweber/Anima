"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { selectClassName } from "@/components/ui/Select";
import { TeleconsultChat } from "@/components/clinic/TeleconsultChat";
import { SessionIntelligencePanel } from "@/components/clinic/SessionIntelligencePanel";
import { TeleconsultRecordingsPanel } from "@/components/clinic/TeleconsultRecordingsPanel";
import { useUserMedia } from "@/hooks/use-user-media";
import { useMultimodalAssistive } from "@/hooks/use-multimodal-assistive";
import { useTeleconsultRecording } from "@/hooks/use-teleconsult-recording";
import { useWebSpeechTranscription } from "@/hooks/use-web-speech-transcription";
import {
  endTeleconsult,
  postTeleconsultSignal,
  pullTeleconsultSignals,
} from "@/lib/api/teleconsult";
import { TeleconsultPatientLinkPanel } from "@/components/clinic/TeleconsultPatientLinkPanel";
import type { TeleconsultSession } from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";
import { useFeatureFlagsContext } from "@/providers/feature-flags-provider";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
];

type Props = {
  session: TeleconsultSession;
  isInitiator: boolean;
  /** Exibe briefing pós-consulta (clínica/profissional). */
  enablePostConsultBriefing?: boolean;
  onEnded?: (session: TeleconsultSession) => void;
};

export function TeleconsultRoom({
  session,
  isInitiator,
  enablePostConsultBriefing = false,
  onEnded,
}: Props) {
  const { user } = useAuth();
  const {
    teleconsultTranscription,
    teleconsultMultimodal,
    teleconsultRecording,
  } = useFeatureFlagsContext();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const lastSignalId = useRef<string | undefined>(undefined);
  const makingOffer = useRef(false);
  const pollStopped = useRef(false);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const [remoteReady, setRemoteReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);
  const [ended, setEnded] = useState(
    session.status === "ENCERRADA" || session.status === "CANCELADA",
  );
  const [showBriefing, setShowBriefing] = useState(false);

  const asr = useWebSpeechTranscription(
    session.organizationId,
    session.id,
  );

  const {
    activeStream,
    ready,
    accessGranted,
    requesting,
    mediaError,
    muted,
    videoOff,
    audioDevices,
    videoDevices,
    toggleMute,
    toggleVideo,
    switchInput,
    stopAllStreaming,
    checkPermission,
  } = useUserMedia({ autoStart: false });

  const [multimodalOn, setMultimodalOn] = useState(false);
  const multimodal = useMultimodalAssistive({
    orgId: session.organizationId,
    sessionId: session.id,
    mediaStream: activeStream ?? null,
    videoEl: localVideoRef.current,
    muted,
    videoOff,
    enabled: multimodalOn && isInitiator && !ended && teleconsultMultimodal,
  });
  const recording = useTeleconsultRecording({
    orgId: session.organizationId,
    sessionId: session.id,
    localStream: activeStream ?? null,
    localVideo: localVideoRef.current,
    remoteVideo: remoteVideoRef.current,
  });

  const attachStreamToVideo = useCallback(
    (el: HTMLVideoElement | null, stream: MediaStream | null) => {
      if (!el || !stream) return;
      if (el.srcObject !== stream) {
        el.srcObject = stream;
      }
      void el.play().catch(() => {
        /* autoplay bloqueado — usuário pode interagir com os controles */
      });
    },
    [],
  );

  const bindLocalVideo = useCallback(
    (el: HTMLVideoElement | null) => {
      localVideoRef.current = el;
      attachStreamToVideo(el, activeStream ?? null);
    },
    [activeStream, attachStreamToVideo],
  );

  const bindRemoteVideo = useCallback(
    (el: HTMLVideoElement | null) => {
      remoteVideoRef.current = el;
      if (el?.srcObject) {
        void el.play().catch(() => {});
      }
    },
    [],
  );

  useEffect(() => {
    attachStreamToVideo(localVideoRef.current, activeStream ?? null);
  }, [activeStream, attachStreamToVideo]);

  useEffect(() => {
    if (multimodalOn && isInitiator && !ended && activeStream) {
      void multimodal.start();
    } else if (multimodal.active) {
      void multimodal.stop();
    }
    // start/stop estáveis o suficiente para toggle de sessão
    // eslint-disable-next-line react-hooks/exhaustive-deps -- evita loop pelo objeto multimodal
  }, [multimodalOn, isInitiator, ended, activeStream]);

  const flushPendingIce = useCallback(async (pc: RTCPeerConnection) => {
    if (!pc.remoteDescription) return;
    const pending = [...pendingIceRef.current];
    pendingIceRef.current = [];
    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(candidate);
      } catch {
        // candidato expirado ou duplicado
      }
    }
  }, []);

  const addIceCandidateSafe = useCallback(
    async (pc: RTCPeerConnection, candidate: RTCIceCandidateInit) => {
      if (!pc.remoteDescription) {
        pendingIceRef.current.push(candidate);
        return;
      }
      try {
        await pc.addIceCandidate(candidate);
      } catch {
        // candidato fora de ordem — tenta enfileirar
        pendingIceRef.current.push(candidate);
      }
    },
    [],
  );

  const ensurePeer = useCallback(() => {
    if (pcRef.current) return pcRef.current;
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (!stream || !remoteVideoRef.current) return;
      remoteVideoRef.current.srcObject = stream;
      void remoteVideoRef.current.play().catch(() => {});
      setRemoteReady(true);
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed") {
        setError(
          "Conexão de vídeo falhou. Verifique a rede ou peça ao paciente para recarregar o link.",
        );
      }
    };

    pc.onicecandidate = (event) => {
      if (!event.candidate) return;
      void postTeleconsultSignal(session.organizationId, session.id, {
        type: "ice",
        payload: event.candidate.toJSON(),
      }).catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : "Falha ao enviar sinal de conexão",
        );
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
        setError(null);
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

  // Reenvia oferta enquanto o paciente ainda não conectou (entrou depois).
  useEffect(() => {
    if (!isInitiator || ended || remoteReady || !activeStream) return;
    const interval = window.setInterval(() => {
      if (makingOffer.current || remoteReady) return;
      const pc = pcRef.current;
      if (!pc) return;
      if (
        pc.signalingState !== "stable" &&
        pc.signalingState !== "have-local-offer"
      ) {
        return;
      }
      void (async () => {
        try {
          makingOffer.current = true;
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          await postTeleconsultSignal(session.organizationId, session.id, {
            type: "offer",
            payload: offer,
          });
        } catch {
          // próximo ciclo tenta de novo
        } finally {
          makingOffer.current = false;
        }
      })();
    }, 8000);
    return () => window.clearInterval(interval);
  }, [
    activeStream,
    ended,
    isInitiator,
    remoteReady,
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
              if (pc.signalingState === "stable") {
                await pc.setRemoteDescription(
                  msg.payload as RTCSessionDescriptionInit,
                );
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                await postTeleconsultSignal(session.organizationId, session.id, {
                  type: "answer",
                  payload: answer,
                });
                await flushPendingIce(pc);
                setError(null);
              }
            } else if (msg.type === "answer" && isInitiator) {
              if (!pc.remoteDescription) {
                await pc.setRemoteDescription(
                  msg.payload as RTCSessionDescriptionInit,
                );
                await flushPendingIce(pc);
                setError(null);
              }
            } else if (msg.type === "ice") {
              await addIceCandidateSafe(
                pc,
                msg.payload as RTCIceCandidateInit,
              );
            }
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Falha na conexão com o servidor de sinais",
          );
        }
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    void poll();
    return () => {
      pollStopped.current = true;
    };
  }, [
    addIceCandidateSafe,
    ended,
    ensurePeer,
    flushPendingIce,
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
    setMultimodalOn(false);
    if (recording.active) await recording.stop();
    if (multimodal.active) await multimodal.stop();
    if (asr.active) await asr.stop();
    pcRef.current?.close();
    pcRef.current = null;
    await stopAllStreaming();
  }, [asr, multimodal, recording, stopAllStreaming]);

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
      if (enablePostConsultBriefing && isInitiator) {
        setShowBriefing(true);
      } else {
        onEnded?.(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao encerrar");
    } finally {
      setEnding(false);
    }
  }

  if (showBriefing) {
    return (
      <div className="space-y-4">
        {teleconsultRecording && (
          <TeleconsultRecordingsPanel
            orgId={session.organizationId}
            sessionId={session.id}
          />
        )}
        <SessionIntelligencePanel
          orgId={session.organizationId}
          sessionId={session.id}
          patientId={session.patientId}
          onDone={() => onEnded?.(session)}
        />
      </div>
    );
  }

  if (ended) {
    return (
      <div className="glass-panel p-6 space-y-3">
        <p className="text-sm text-foreground/70">Sessão encerrada.</p>
        <p className="text-[11px] text-foreground/35">
          Código da sala: <code>{session.roomCode}</code> · status ENCERRADA
        </p>
        {teleconsultRecording && (
          <TeleconsultRecordingsPanel
            orgId={session.organizationId}
            sessionId={session.id}
          />
        )}
      </div>
    );
  }

  if (ready && !accessGranted) {
    return (
      <div className="glass-panel p-6 space-y-3">
        <p className="text-sm text-foreground/60">
          Permita acesso à câmera e ao microfone para entrar na teleconsulta.
        </p>
        {typeof window !== "undefined" && !window.isSecureContext && (
          <p className="text-xs text-amber-500/90">
            Esta página precisa ser aberta via HTTPS para usar câmera e
            microfone.
          </p>
        )}
        {mediaError && <p className="text-xs text-red-400">{mediaError}</p>}
        <Button
          type="button"
          isLoading={requesting}
          onClick={() => void checkPermission()}
        >
          Permitir acesso
        </Button>
      </div>
    );
  }

  return (
    <div className="teleconsult-room space-y-4">
      {isInitiator && !remoteReady && (
        <div className="glass-panel p-4">
          <p className="text-xs text-foreground/50 mb-3">
            O paciente ainda não entrou. Envie o link:
          </p>
          <TeleconsultPatientLinkPanel
            orgId={session.organizationId}
            patientId={session.patientId}
            roomCode={session.roomCode}
            patientJoinUrl={session.patientJoinUrl}
            compact
          />
        </div>
      )}

      <div className="teleconsult-room-grid grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:items-stretch">
        <div className="teleconsult-room-main space-y-3 min-w-0">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-foreground/10">
              <video
                ref={bindLocalVideo}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover scale-x-[-1]"
              />
              <span className="absolute left-3 bottom-3 text-[11px] px-2 py-0.5 rounded-md bg-black/50 text-white">
                Você
              </span>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-foreground/10">
              <video
                ref={bindRemoteVideo}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 bottom-3 text-[11px] px-2 py-0.5 rounded-md bg-black/50 text-white">
                {remoteReady ? "Remoto" : "Aguardando participante…"}
              </span>
              {!remoteReady && isInitiator && (
                <span className="absolute right-3 top-3 text-[10px] px-2 py-0.5 rounded-md bg-black/50 text-white/80 max-w-[70%] text-right">
                  Envie o link ao paciente e aguarde ele entrar
                </span>
              )}
            </div>
          </div>

          <div className="teleconsult-controls grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            <Button
              type="button"
              variant="secondary"
              fullWidth={false}
              className="!w-full !py-2.5 !px-3 text-xs sm:text-sm"
              onClick={toggleMute}
            >
              {muted ? "Ativar microfone" : "Mute"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth={false}
              className="!w-full !py-2.5 !px-3 text-xs sm:text-sm"
              onClick={toggleVideo}
            >
              {videoOff ? "Ligar vídeo" : "Desligar vídeo"}
            </Button>
            {isInitiator && teleconsultTranscription && asr.supported && (
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                className="!w-full !py-2.5 !px-3 text-xs sm:text-sm"
                onClick={() =>
                  void (asr.active ? asr.stop() : asr.start())
                }
              >
                {asr.active ? "Parar transcrição" : "Transcrever"}
              </Button>
            )}
            {isInitiator && teleconsultMultimodal && multimodal.supported && (
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                className="!w-full !py-2.5 !px-3 text-xs sm:text-sm"
                onClick={() => setMultimodalOn((v) => !v)}
              >
                {multimodalOn ? "Parar sinais" : "Sinais assistivos"}
              </Button>
            )}
            {isInitiator && teleconsultRecording && recording.supported && (
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                className="!w-full !py-2.5 !px-3 text-xs sm:text-sm"
                isLoading={recording.uploading}
                onClick={() => {
                  if (recording.active) {
                    void recording.stop();
                    return;
                  }
                  const accepted = window.confirm(
                    "A gravação armazenará áudio e vídeo temporariamente por até 30 dias. Confirme que o paciente autorizou e que todos estão cientes.",
                  );
                  if (accepted) void recording.start();
                }}
              >
                {recording.active ? "Parar gravação" : "Gravar consulta"}
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              fullWidth={false}
              className="!w-full !py-2.5 !px-3 text-xs sm:text-sm !text-red-600 dark:!text-red-400 !border-red-500/25 hover:!bg-red-500/10"
              isLoading={ending}
              onClick={() => void handleEnd()}
            >
              Encerrar
            </Button>
          </div>

          {asr.active && (
            <p className="text-[11px] text-amber-500/90">
              Transcrição ativa
              {asr.lastPartial ? ` · ${asr.lastPartial}` : ""}
            </p>
          )}
          {multimodal.active && (
            <p className="text-[11px] text-sky-500/90">
              Análise multimodal ativa
              {multimodal.lastSentAt ? " · agregados enviados" : ""}
            </p>
          )}
          {recording.active && (
            <p className="text-[11px] font-semibold text-red-500">
              ● Gravação de áudio e vídeo ativa ·{" "}
              {Math.floor(recording.elapsedMs / 60000)
                .toString()
                .padStart(2, "0")}
              :
              {Math.floor((recording.elapsedMs % 60000) / 1000)
                .toString()
                .padStart(2, "0")}
            </p>
          )}
          {asr.error && (
            <p className="text-xs text-red-400">{asr.error}</p>
          )}
          {multimodal.error && (
            <p className="text-xs text-red-400">{multimodal.error}</p>
          )}
          {recording.error && (
            <p className="text-xs text-red-400">{recording.error}</p>
          )}

          {(videoDevices.length > 1 || audioDevices.length > 1) && (
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              {videoDevices.length > 0 && (
                <select
                  className={`${selectClassName} !px-3 !py-2.5`}
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
                  className={`${selectClassName} !px-3 !py-2.5`}
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
        </div>

        <TeleconsultChat
          orgId={session.organizationId}
          sessionId={session.id}
          className="lg:h-full lg:min-h-[min(480px,72vh)]"
        />
      </div>

      <p className="text-[11px] text-foreground/35">
        Código da sala: <code>{session.roomCode}</code> · status {session.status}
      </p>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
