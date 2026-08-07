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
  { urls: "stun:stun1.l.google.com:19302" },
];

type Props = {
  session: TeleconsultSession;
  isInitiator: boolean;
  /** Exibe briefing pós-consulta (clínica/profissional). */
  enablePostConsultBriefing?: boolean;
  onEnded?: (session: TeleconsultSession) => void;
};

function attachStreamToVideo(
  el: HTMLVideoElement | null,
  stream: MediaStream | null,
) {
  if (!el || !stream) return;
  if (el.srcObject !== stream) {
    el.srcObject = stream;
  }
  void el.play().catch(() => {
    /* autoplay bloqueado — usuário pode interagir com os controles */
  });
}

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
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const lastSignalId = useRef<string | undefined>(undefined);
  const makingOffer = useRef(false);
  const pollStopped = useRef(false);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const offerEpochRef = useRef(0);
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

  const mediaReady = Boolean(ready && accessGranted && activeStream && !ended);

  const bindLocalVideo = useCallback(
    (el: HTMLVideoElement | null) => {
      localVideoRef.current = el;
      attachStreamToVideo(el, activeStream ?? null);
    },
    [activeStream],
  );

  const bindRemoteVideo = useCallback((el: HTMLVideoElement | null) => {
    remoteVideoRef.current = el;
    attachStreamToVideo(el, remoteStreamRef.current);
  }, []);

  useEffect(() => {
    attachStreamToVideo(localVideoRef.current, activeStream ?? null);
  }, [activeStream]);

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
      if (!candidate) return;
      if (!pc.remoteDescription) {
        pendingIceRef.current.push(candidate);
        return;
      }
      try {
        await pc.addIceCandidate(candidate);
      } catch {
        pendingIceRef.current.push(candidate);
      }
    },
    [],
  );

  const wirePeerHandlers = useCallback(
    (pc: RTCPeerConnection) => {
      pc.ontrack = (event) => {
        const stream =
          event.streams[0] ?? new MediaStream([event.track]);
        remoteStreamRef.current = stream;
        attachStreamToVideo(remoteVideoRef.current, stream);
        setRemoteReady(true);
        setError(null);
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setRemoteReady(true);
          setError(null);
        } else if (pc.connectionState === "failed") {
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
    },
    [session.id, session.organizationId],
  );

  const attachLocalTracks = useCallback(
    (pc: RTCPeerConnection, stream: MediaStream) => {
      for (const track of stream.getTracks()) {
        const sender = pc
          .getSenders()
          .find((s) => s.track?.kind === track.kind);
        if (sender) {
          void sender.replaceTrack(track);
        } else {
          pc.addTrack(track, stream);
        }
      }
    },
    [],
  );

  const ensurePeer = useCallback(() => {
    if (pcRef.current) return pcRef.current;
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;
    wirePeerHandlers(pc);
    return pc;
  }, [wirePeerHandlers]);

  /** Recria o PC (usado quando a oferta ficou órfã sem answer). */
  const recreatePeer = useCallback(
    (stream: MediaStream) => {
      pcRef.current?.close();
      pcRef.current = null;
      pendingIceRef.current = [];
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;
      wirePeerHandlers(pc);
      attachLocalTracks(pc, stream);
      return pc;
    },
    [attachLocalTracks, wirePeerHandlers],
  );

  useEffect(() => {
    if (!activeStream) return;
    const pc = ensurePeer();
    attachLocalTracks(pc, activeStream);
  }, [activeStream, attachLocalTracks, ensurePeer]);

  const publishOffer = useCallback(
    async (pc: RTCPeerConnection) => {
      makingOffer.current = true;
      offerEpochRef.current += 1;
      const epoch = offerEpochRef.current;
      try {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        if (epoch !== offerEpochRef.current) return;
        await pc.setLocalDescription(offer);
        if (epoch !== offerEpochRef.current) return;
        await postTeleconsultSignal(session.organizationId, session.id, {
          type: "offer",
          payload: pc.localDescription ?? offer,
        });
        setError(null);
      } finally {
        if (epoch === offerEpochRef.current) {
          makingOffer.current = false;
        }
      }
    },
    [session.id, session.organizationId],
  );

  // Oferta inicial — só depois da mídia local estar no PeerConnection.
  useEffect(() => {
    if (!mediaReady || !isInitiator || !activeStream) return;
    let cancelled = false;

    async function createOffer() {
      try {
        const pc = ensurePeer();
        attachLocalTracks(pc, activeStream!);
        if (cancelled) return;
        if (pc.signalingState !== "stable") return;
        await publishOffer(pc);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Falha ao criar oferta WebRTC",
          );
        }
      }
    }

    void createOffer();
    return () => {
      cancelled = true;
    };
  }, [
    activeStream,
    attachLocalTracks,
    ensurePeer,
    isInitiator,
    mediaReady,
    publishOffer,
  ]);

  // Reoferece se o paciente entrar depois: só em stable (nunca substitui offer pendente).
  // Se ficou preso em have-local-offer sem answer, recria o PC.
  useEffect(() => {
    if (!isInitiator || !mediaReady || remoteReady || !activeStream) return;
    const interval = window.setInterval(() => {
      if (makingOffer.current || remoteReady) return;
      const existing = pcRef.current;
      if (!existing) return;
      if (existing.connectionState === "connected") return;

      void (async () => {
        try {
          let pc = existing;
          // Já tem answer: não reoferece enquanto ICE tenta conectar.
          if (pc.remoteDescription) {
            if (pc.connectionState === "failed") {
              pc = recreatePeer(activeStream);
              await publishOffer(pc);
            }
            return;
          }
          if (pc.signalingState === "have-local-offer") {
            // Offer órfã (paciente ainda não respondeu) — recria e manda de novo.
            pc = recreatePeer(activeStream);
          } else if (pc.signalingState !== "stable") {
            return;
          }
          await publishOffer(pc);
        } catch {
          // próximo ciclo tenta de novo
        }
      })();
    }, 8000);
    return () => window.clearInterval(interval);
  }, [
    activeStream,
    isInitiator,
    mediaReady,
    publishOffer,
    recreatePeer,
    remoteReady,
  ]);

  // Signaling só depois da mídia pronta — evita answer sem tracks e ontrack sem <video>.
  useEffect(() => {
    const userId = user?.id;
    if (!mediaReady || !userId) return;
    pollStopped.current = false;

    async function poll() {
      while (!pollStopped.current) {
        try {
          const messages = await pullTeleconsultSignals(
            session.organizationId,
            session.id,
            lastSignalId.current,
          );
          // Paciente: se o lote trouxe várias offers, responde só a última.
          const latestOfferId = !isInitiator
            ? [...messages]
                .reverse()
                .find((m) => m.type === "offer" && m.fromUserId !== userId)
                ?.id
            : undefined;

          const remoteMessages = messages.filter(
            (m) => m.fromUserId !== userId,
          );
          for (const msg of messages) {
            lastSignalId.current = msg.id;
          }

          const pc = ensurePeer();
          if (activeStream) attachLocalTracks(pc, activeStream);

          // SDP primeiro (offer/answer), ICE depois — evita candidatos no PC errado.
          for (const msg of remoteMessages) {
            if (msg.type === "offer" && !isInitiator) {
              if (latestOfferId && msg.id !== latestOfferId) continue;
              if (
                pc.signalingState !== "stable" &&
                pc.signalingState !== "have-remote-offer"
              ) {
                continue;
              }
              await pc.setRemoteDescription(
                msg.payload as RTCSessionDescriptionInit,
              );
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              await postTeleconsultSignal(session.organizationId, session.id, {
                type: "answer",
                payload: pc.localDescription ?? answer,
              });
              await flushPendingIce(pc);
              setError(null);
            } else if (msg.type === "answer" && isInitiator) {
              if (pc.signalingState !== "have-local-offer") continue;
              try {
                await pc.setRemoteDescription(
                  msg.payload as RTCSessionDescriptionInit,
                );
                await flushPendingIce(pc);
                setError(null);
              } catch {
                // answer órfã (oferta já foi substituída) — ignora
              }
            }
          }

          for (const msg of remoteMessages) {
            if (msg.type !== "ice") continue;
            await addIceCandidateSafe(pc, msg.payload as RTCIceCandidateInit);
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
    activeStream,
    addIceCandidateSafe,
    attachLocalTracks,
    ensurePeer,
    flushPendingIce,
    isInitiator,
    mediaReady,
    session.id,
    session.organizationId,
    user?.id,
  ]);

  useEffect(() => {
    return () => {
      pollStopped.current = true;
      pcRef.current?.close();
      pcRef.current = null;
      remoteStreamRef.current = null;
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
    remoteStreamRef.current = null;
    setRemoteReady(false);
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
              {!remoteReady && (
                <span className="absolute right-3 top-3 text-[10px] px-2 py-0.5 rounded-md bg-black/50 text-white/80 max-w-[70%] text-right">
                  {isInitiator
                    ? "Envie o link ao paciente e aguarde ele entrar"
                    : "Aguardando o profissional… Permita câmera/microfone nos dois lados"}
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
