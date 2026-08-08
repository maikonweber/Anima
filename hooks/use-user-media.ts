"use client";

/**
 * Hook de mídia local alinhado a
 * https://github.com/maikonweber/video-conf-hook (react-media-devices / useUserMedia).
 * `switchInput` devolve tracks antigas/novas para o WebRTC fazer replaceTrack.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { rtcLog } from "@/lib/teleconsult-debug";

type UseUserMediaOptions = {
  preferEnvironmentCamera?: boolean;
  /** Se false, só solicita mídia após checkPermission() (gesto do usuário). */
  autoStart?: boolean;
};

export type SwitchInputResult = {
  oldVideoTrack: MediaStreamTrack | undefined;
  newVideoTrack: MediaStreamTrack | undefined;
  oldAudioTrack: MediaStreamTrack | undefined;
  newAudioTrack: MediaStreamTrack | undefined;
  newStream: MediaStream;
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
  const { autoStart = false, preferEnvironmentCamera = false } = options;
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
  const mutedRef = useRef(false);
  const videoOffRef = useRef(false);
  const selectedAudioRef = useRef<string | undefined>(undefined);
  const selectedVideoRef = useRef<string | undefined>(undefined);

  mutedRef.current = muted;
  videoOffRef.current = videoOff;
  selectedAudioRef.current = selectedAudioDevice;
  selectedVideoRef.current = selectedVideoDevice;

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    setAudioDevices(
      devices.filter((d) => d.kind === "audioinput" && !!d.deviceId),
    );
    setVideoDevices(
      devices.filter((d) => d.kind === "videoinput" && !!d.deviceId),
    );
    setOutputDevices(
      devices.filter((d) => d.kind === "audiooutput" && !!d.deviceId),
    );
  }, []);

  const applyStream = useCallback(
    async (stream: MediaStream) => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = stream;
      stream.getAudioTracks().forEach((t) => {
        t.enabled = !mutedRef.current;
      });
      stream.getVideoTracks().forEach((t) => {
        t.enabled = !videoOffRef.current;
      });
      setActiveStream(stream);
      setAccessGranted(true);
      setReady(true);
      setMediaError(null);
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];
      const audioId = audioTrack?.getSettings().deviceId;
      const videoId = videoTrack?.getSettings().deviceId;
      if (audioId) setSelectedAudioDevice(audioId);
      if (videoId) setSelectedVideoDevice(videoId);
      if (!videoTrack) setVideoOff(true);
      rtcLog("info", "usermedia_stream_ready", {
        audioTracks: stream.getAudioTracks().length,
        videoTracks: stream.getVideoTracks().length,
        audioId,
        videoId,
      });
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
      preferEnvironmentCamera
        ? { facingMode: { ideal: "environment" } }
        : true;

    rtcLog("info", "usermedia_getUserMedia_start", {
      preferEnvironmentCamera,
    });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: videoConstraint,
      });
      await applyStream(stream);
      return stream;
    } catch (err) {
      rtcLog("warn", "usermedia_av_failed_try_audio", {
        message: err instanceof Error ? err.message : String(err),
      });
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
  }, [applyStream, preferEnvironmentCamera]);

  useEffect(() => {
    if (!autoStart) return;
    void start().catch((err) => {
      setReady(true);
      setAccessGranted(false);
      setMediaError(describeMediaError(err));
      rtcLog("error", "usermedia_autostart_failed", {
        message: describeMediaError(err),
      });
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
    const next = !mutedRef.current;
    streamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !next;
    });
    setMuted(next);
    rtcLog("info", "usermedia_toggle_mute", { muted: next });
  }, []);

  const toggleVideo = useCallback(() => {
    const next = !videoOffRef.current;
    streamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !next;
    });
    setVideoOff(next);
    rtcLog("info", "usermedia_toggle_video", { videoOff: next });
  }, []);

  /**
   * Troca câmera/microfone e devolve tracks para o PeerConnection.replaceTrack
   * (padrão video-conf-hook).
   */
  const switchInput = useCallback(
    async (
      deviceId: string,
      type: "audio" | "video",
    ): Promise<SwitchInputResult | undefined> => {
      const current = streamRef.current;
      if (!current) return undefined;

      const oldVideoTrack = current.getVideoTracks()[0];
      const oldAudioTrack = current.getAudioTracks()[0];

      const audioConstraint =
        type === "audio"
          ? { deviceId: { exact: deviceId } }
          : selectedAudioRef.current
            ? { deviceId: { exact: selectedAudioRef.current } }
            : true;
      const videoConstraint =
        type === "video"
          ? { deviceId: { exact: deviceId } }
          : selectedVideoRef.current
            ? { deviceId: { exact: selectedVideoRef.current } }
            : true;

      rtcLog("info", "usermedia_switch_input", { type, deviceId });

      const next = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraint,
        video: videoConstraint,
      });

      const newVideoTrack = next.getVideoTracks()[0];
      const newAudioTrack = next.getAudioTracks()[0];
      if (newVideoTrack) newVideoTrack.enabled = !videoOffRef.current;
      if (newAudioTrack) newAudioTrack.enabled = !mutedRef.current;

      current.getTracks().forEach((t) => t.stop());
      streamRef.current = next;
      setActiveStream(next);
      if (type === "audio") setSelectedAudioDevice(deviceId);
      else setSelectedVideoDevice(deviceId);
      await refreshDevices();

      return {
        oldVideoTrack,
        newVideoTrack,
        oldAudioTrack,
        newAudioTrack,
        newStream: next,
      };
    },
    [refreshDevices],
  );

  const stopAllStreaming = useCallback(async () => {
    rtcLog("info", "usermedia_stop_all");
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
      const message = describeMediaError(err);
      setMediaError(message);
      rtcLog("error", "usermedia_permission_denied", { message });
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
