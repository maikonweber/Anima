"use client";

/**
 * Hook de mídia local inspirado em
 * https://github.com/maikonweber/video-conf-hook (react-media-devices / useUserMedia).
 * Mantém a mesma superfície básica: stream, mute/vídeo, devices.
 */
import { useCallback, useEffect, useRef, useState } from "react";

type UseUserMediaOptions = {
  preferEnvironmentCamera?: boolean;
  /** Se false, só solicita mídia após checkPermission() (gesto do usuário). */
  autoStart?: boolean;
};

function describeMediaError(err: unknown): string {
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return "Câmera e microfone só funcionam em conexão segura (HTTPS).";
  }
  if (typeof navigator !== "undefined" && !navigator.mediaDevices?.getUserMedia) {
    return "Seu navegador não suporta acesso à câmera e ao microfone.";
  }
  if (err instanceof DOMException) {
    switch (err.name) {
      case "NotAllowedError":
        return "Permissão negada. Clique em «Permitir acesso» e aceite no navegador, ou libere câmera e microfone nas configurações do site.";
      case "NotFoundError":
        return "Nenhuma câmera ou microfone encontrado. Conecte um dispositivo e tente novamente.";
      case "NotReadableError":
        return "Câmera ou microfone em uso por outro aplicativo. Feche outros programas e tente novamente.";
      case "OverconstrainedError":
        return "Não foi possível usar os dispositivos de mídia solicitados.";
      case "SecurityError":
        return "Acesso à mídia bloqueado por política de segurança do navegador.";
      default:
        return err.message || "Não foi possível acessar câmera e microfone.";
    }
  }
  return err instanceof Error
    ? err.message
    : "Não foi possível acessar câmera e microfone.";
}

export function useUserMedia(options: UseUserMediaOptions = {}) {
  const { autoStart = false } = options;
  const [activeStream, setActiveStream] = useState<MediaStream | undefined>();
  const [ready, setReady] = useState(!autoStart);
  const [accessGranted, setAccessGranted] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>();
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>();
  const streamRef = useRef<MediaStream | undefined>(undefined);

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    setAudioDevices(devices.filter((d) => d.kind === "audioinput"));
    setVideoDevices(devices.filter((d) => d.kind === "videoinput"));
    setOutputDevices(devices.filter((d) => d.kind === "audiooutput"));
  }, []);

  const applyStream = useCallback(
    async (stream: MediaStream) => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = stream;
      stream.getAudioTracks().forEach((t) => {
        t.enabled = true;
      });
      stream.getVideoTracks().forEach((t) => {
        t.enabled = true;
      });
      setActiveStream(stream);
      setAccessGranted(true);
      setReady(true);
      setMediaError(null);
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];
      setSelectedAudioDevice(audioTrack?.getSettings().deviceId);
      setSelectedVideoDevice(videoTrack?.getSettings().deviceId);
      if (!videoTrack) {
        setVideoOff(true);
      }
      await refreshDevices();
    },
    [refreshDevices],
  );

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new DOMException(
        "MediaDevices API indisponível",
        "NotSupportedError",
      );
    }

    const videoConstraint: boolean | MediaTrackConstraints =
      options.preferEnvironmentCamera
        ? { facingMode: { ideal: "environment" } }
        : true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: videoConstraint,
      });
      await applyStream(stream);
      return stream;
    } catch (err) {
      if (
        err instanceof DOMException &&
        (err.name === "NotFoundError" || err.name === "OverconstrainedError")
      ) {
        const audioOnly = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        await applyStream(audioOnly);
        return audioOnly;
      }
      throw err;
    }
  }, [applyStream, options.preferEnvironmentCamera]);

  useEffect(() => {
    if (!autoStart) return;
    void start().catch((err) => {
      setReady(true);
      setAccessGranted(false);
      setMediaError(describeMediaError(err));
    });
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [autoStart, start]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    streamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !next;
    });
    setMuted(next);
  }, [muted]);

  const toggleVideo = useCallback(() => {
    const next = !videoOff;
    streamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !next;
    });
    setVideoOff(next);
  }, [videoOff]);

  const switchInput = useCallback(
    async (deviceId: string, type: "audio" | "video") => {
      const current = streamRef.current;
      if (!current) return;
      const constraints =
        type === "audio"
          ? { audio: { deviceId: { exact: deviceId } }, video: true }
          : { audio: true, video: { deviceId: { exact: deviceId } } };
      const next = await navigator.mediaDevices.getUserMedia(constraints);
      current.getTracks().forEach((t) => t.stop());
      streamRef.current = next;
      setActiveStream(next);
      if (type === "audio") setSelectedAudioDevice(deviceId);
      else setSelectedVideoDevice(deviceId);
      if (muted) next.getAudioTracks().forEach((t) => (t.enabled = false));
      if (videoOff) next.getVideoTracks().forEach((t) => (t.enabled = false));
      await refreshDevices();
    },
    [muted, refreshDevices, videoOff],
  );

  const stopAllStreaming = useCallback(async () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = undefined;
    setActiveStream(undefined);
  }, []);

  const checkPermission = useCallback(async () => {
    setRequesting(true);
    setMediaError(null);
    try {
      await start();
      return { video: true, audio: true };
    } catch (err) {
      setAccessGranted(false);
      setReady(true);
      setMediaError(describeMediaError(err));
      return { video: false, audio: false };
    } finally {
      setRequesting(false);
    }
  }, [start]);

  return {
    activeStream,
    ready,
    accessGranted,
    requesting,
    mediaError,
    muted,
    videoOff,
    audioDevices,
    videoDevices,
    outputDevices,
    selectedAudioDevice,
    selectedVideoDevice,
    toggleMute,
    toggleVideo,
    switchInput,
    stopAllStreaming,
    checkPermission,
  };
}
