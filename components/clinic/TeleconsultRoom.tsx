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
import { useTeleconsultWebRtc } from "@/hooks/use-teleconsult-webrtc";
import { endTeleconsult } from "@/lib/api/teleconsult";
import { TeleconsultPatientLinkPanel } from "@/components/clinic/TeleconsultPatientLinkPanel";
import type {
  TeleconsultSession,
  TeleconsultViewerRole,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";
import { useFeatureFlagsContext } from "@/providers/feature-flags-provider";
import { isTeleconsultDebugEnabled } from "@/lib/teleconsult-debug";

type Props = {
  session: TeleconsultSession;
  /** Preferir session.viewerRole / session.isInitiator da API. */
  viewerRole?: TeleconsultViewerRole;
  isInitiator?: boolean;
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
    /* autoplay bloqueado */
  });
}

function resolveViewerRole(
  session: TeleconsultSession,
  userId: string | undefined,
  override?: TeleconsultViewerRole,
): TeleconsultViewerRole {
  if (override) return override;
  if (session.viewerRole) return session.viewerRole;
  if (userId && session.professionalUserId === userId) return "PROFESSIONAL";
  return "PATIENT";
}

function resolveIsInitiator(
  session: TeleconsultSession,
  viewerRole: TeleconsultViewerRole,
  userId: string | undefined,
  override?: boolean,
): boolean {
  if (typeof override === "boolean") return override;
  if (typeof session.isInitiator === "boolean") return session.isInitiator;
  if (viewerRole === "PATIENT") return false;
  // Só o profissional da sessão inicia (admin sem ser o pro responde).
  return Boolean(userId && session.professionalUserId === userId);
}

export function TeleconsultRoom({
  session,
  viewerRole: viewerRoleProp,
  isInitiator: isInitiatorProp,
  enablePostConsultBriefing,
  onEnded,
}: Props) {
  const { user } = useAuth();
  const {
    teleconsultTranscription,
    teleconsultMultimodal,
    teleconsultRecording,
  } = useFeatureFlagsContext();

  const viewerRole = resolveViewerRole(session, user?.id, viewerRoleProp);
  const isInitiator = resolveIsInitiator(
    session,
    viewerRole,
    user?.id,
    isInitiatorProp,
  );
  const isPatient = viewerRole === "PATIENT";
  const isClinician = !isPatient;
  const showClinicalTools =
    isClinician &&
    (enablePostConsultBriefing ?? isInitiator);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [ending, setEnding] = useState(false);
  const [ended, setEnded] = useState(
    session.status === "ENCERRADA" || session.status === "CANCELADA",
  );
  const [showBriefing, setShowBriefing] = useState(false);
  const [multimodalOn, setMultimodalOn] = useState(false);

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

  const mediaReady = Boolean(ready && accessGranted && activeStream && !ended);

  const {
    bindRemoteVideo,
    remoteVideoRef,
    remoteReady,
    peerPresent,
    needsGesture,
    tryPlayRemote,
    debugInfo,
    error: webrtcError,
    setError: setWebrtcError,
    teardown: teardownRtc,
  } = useTeleconsultWebRtc({
    orgId: session.organizationId,
    sessionId: session.id,
    userId: user?.id,
    isInitiator,
    viewerRole,
    localStream: activeStream,
    mediaReady,
    enabled: !ended,
  });

  const multimodal = useMultimodalAssistive({
    orgId: session.organizationId,
    sessionId: session.id,
    mediaStream: activeStream ?? null,
    videoEl: localVideoRef.current,
    muted,
    videoOff,
    enabled: multimodalOn && isClinician && !ended && teleconsultMultimodal,
  });
  const recording = useTeleconsultRecording({
    orgId: session.organizationId,
    sessionId: session.id,
    localStream: activeStream ?? null,
    localVideo: localVideoRef.current,
    remoteVideo: remoteVideoRef.current,
  });

  const bindLocalVideo = useCallback(
    (el: HTMLVideoElement | null) => {
      localVideoRef.current = el;
      attachStreamToVideo(el, activeStream ?? null);
    },
    [activeStream],
  );

  useEffect(() => {
    attachStreamToVideo(localVideoRef.current, activeStream ?? null);
  }, [activeStream]);

  useEffect(() => {
    if (multimodalOn && isClinician && !ended && activeStream) {
      void multimodal.start();
    } else if (multimodal.active) {
      void multimodal.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- evita loop pelo objeto multimodal
  }, [multimodalOn, isClinician, ended, activeStream]);

  const teardownMedia = useCallback(async () => {
    setMultimodalOn(false);
    if (recording.active) await recording.stop();
    if (multimodal.active) await multimodal.stop();
    if (asr.active) await asr.stop();
    await teardownRtc();
    await stopAllStreaming();
  }, [asr, multimodal, recording, stopAllStreaming, teardownRtc]);

  async function handleLeave() {
    if (ending || ended) return;
    setEnding(true);
    setWebrtcError(null);
    try {
      await teardownMedia();
      setEnded(true);
      onEnded?.(session);
    } catch (err) {
      setWebrtcError(
        err instanceof Error ? err.message : "Falha ao sair da sala",
      );
    } finally {
      setEnding(false);
    }
  }

  async function handleEnd() {
    if (ending || ended) return;
    setEnding(true);
    setWebrtcError(null);
    try {
      const updated = await endTeleconsult(
        session.organizationId,
        session.id,
      );
      await teardownMedia();
      setEnded(true);
      if (showClinicalTools) {
        setShowBriefing(true);
      } else {
        onEnded?.(updated);
      }
    } catch (err) {
      setWebrtcError(
        err instanceof Error ? err.message : "Falha ao encerrar",
      );
    } finally {
      setEnding(false);
    }
  }

  const remoteLabel = isPatient
    ? remoteReady
      ? "Profissional"
      : "Aguardando profissional…"
    : remoteReady
      ? "Paciente"
      : peerPresent
        ? "Paciente conectando…"
        : "Aguardando paciente…";

  const roleBadge = isPatient ? "Paciente" : "Clínico";

  if (showBriefing) {
    return (
      <div className="teleconsult-shell space-y-4">
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
      <div className="teleconsult-shell glass-panel p-6 space-y-3">
        <p className="text-sm text-foreground/70">Sessão encerrada.</p>
        <p className="text-[11px] text-foreground/35">
          Código da sala: <code>{session.roomCode}</code> · status ENCERRADA
        </p>
        {isClinician && teleconsultRecording && (
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
      <div className="teleconsult-shell glass-panel p-6 space-y-3">
        <p className="text-xs font-medium text-[var(--teleconsult-accent)]">
          Entrando como {roleBadge}
        </p>
        <p className="text-sm text-foreground/60">
          {isPatient
            ? "Permita câmera e microfone para falar com o profissional."
            : "Permita câmera e microfone para atender o paciente."}
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
    <div
      className={`teleconsult-shell teleconsult-room space-y-4 ${
        isPatient ? "teleconsult-room--patient" : "teleconsult-room--clinician"
      }`}
    >
      <div className="teleconsult-role-bar flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span className="teleconsult-role-pill">{roleBadge}</span>
          <span className="text-[11px] text-foreground/40">
            {peerPresent || remoteReady
              ? isPatient
                ? "Profissional na sala"
                : "Paciente na sala"
              : isPatient
                ? "Aguardando o profissional"
                : "Aguardando o paciente"}
          </span>
        </div>
        <span className="text-[11px] text-foreground/35">
          Sala <code>{session.roomCode}</code>
        </span>
      </div>

      {isClinician && !remoteReady && (
        <div className="glass-panel p-4">
          <p className="text-xs text-foreground/50 mb-3">
            {peerPresent
              ? "Paciente entrou — conectando o vídeo…"
              : "O paciente ainda não entrou. Envie o link:"}
          </p>
          {!peerPresent && (
            <TeleconsultPatientLinkPanel
              orgId={session.organizationId}
              patientId={session.patientId}
              roomCode={session.roomCode}
              patientJoinUrl={session.patientJoinUrl}
              compact
            />
          )}
        </div>
      )}

      {isPatient && !remoteReady && (
        <div className="glass-panel p-4">
          <p className="text-sm text-foreground/70">
            Você está na sala. Assim que o profissional estiver pronto, o vídeo
            aparece automaticamente.
          </p>
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
                Você · {roleBadge}
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
                {remoteLabel}
              </span>
              {!remoteReady && (
                <span className="absolute right-3 top-3 text-[10px] px-2 py-0.5 rounded-md bg-black/50 text-white/80 max-w-[70%] text-right">
                  {isPatient
                    ? "Aguardando o profissional… Permita câmera/microfone"
                    : "Envie o link ao paciente e aguarde ele entrar"}
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
            {isClinician && teleconsultTranscription && asr.supported && (
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
            {isClinician && teleconsultMultimodal && multimodal.supported && (
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
            {isClinician && teleconsultRecording && recording.supported && (
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
            {isPatient ? (
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                className="!w-full !py-2.5 !px-3 text-xs sm:text-sm !text-red-600 dark:!text-red-400 !border-red-500/25 hover:!bg-red-500/10"
                isLoading={ending}
                onClick={() => void handleLeave()}
              >
                Sair da consulta
              </Button>
            ) : (
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
            )}
          </div>

          {needsGesture && remoteReady && (
            <div className="glass-panel p-3 flex flex-wrap items-center gap-3">
              <p className="text-xs text-foreground/60 flex-1">
                O navegador bloqueou o áudio do vídeo remoto. Clique para
                liberar.
              </p>
              <Button
                type="button"
                fullWidth={false}
                className="!py-2 !px-3 text-xs"
                onClick={tryPlayRemote}
              >
                Ativar áudio/vídeo
              </Button>
            </div>
          )}

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
        status {session.status}
        {isInitiator ? " · iniciando conexão" : " · respondendo conexão"}
        {peerPresent ? " · peer presente" : ""}
        {remoteReady ? " · mídia remota OK" : ""}
      </p>
      {webrtcError && (
        <p className="text-xs text-red-400">{webrtcError}</p>
      )}
      {isTeleconsultDebugEnabled() && (
        <details className="glass-panel p-3 text-[11px] text-foreground/60">
          <summary className="cursor-pointer font-medium text-[var(--teleconsult-accent,#0d7377)]">
            Diagnóstico WebRTC (console: [teleconsult:webrtc])
          </summary>
          <pre className="mt-2 overflow-auto max-h-56 whitespace-pre-wrap break-all">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          <p className="mt-2 text-foreground/40">
            Desligar logs: localStorage.setItem(&apos;teleconsultDebug&apos;,&apos;0&apos;)
          </p>
        </details>
      )}
    </div>
  );
}
