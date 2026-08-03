"use client";

/**
 * Hook de mídia local inspirado em
 * https://github.com/maikonweber/video-conf-hook (react-media-devices / useUserMedia).
 * Mantém a mesma superfície básica: stream, mute/vídeo, devices.
 */
import { useCallback, useEffect, useRef, useState } from "react";

type UseUserMediaOptions = {
  preferEnvironmentCamera?: boolean;
};

export function useUserMedia(options: UseUserMediaOptions = {}) {
  const [activeStream, setActiveStream] = useState<MediaStream | undefined>();
  const [ready, setReady] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>();
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>();
  const streamRef = useRef<MediaStream | undefined>();

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    setAudioDevices(devices.filter((d) => d.kind === "audioinput"));
    setVideoDevices(devices.filter((d) => d.kind === "videoinput"));
    setOutputDevices(devices.filter((d) => d.kind === "audiooutput"));
  }, []);

  const start = useCallback(async () => {
    const videoConstraint: MediaTrackConstraints = options.preferEnvironmentCamera
      ? { facingMode: { ideal: "environment" } }
      : true;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: videoConstraint,
    });
    streamRef.current = stream;
    setActiveStream(stream);
    setAccessGranted(true);
    setReady(true);
    const audioTrack = stream.getAudioTracks()[0];
    const videoTrack = stream.getVideoTracks()[0];
    setSelectedAudioDevice(audioTrack?.getSettings().deviceId);
    setSelectedVideoDevice(videoTrack?.getSettings().deviceId);
    await refreshDevices();
  }, [options.preferEnvironmentCamera, refreshDevices]);

  useEffect(() => {
    void start().catch(() => {
      setReady(true);
      setAccessGranted(false);
    });
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [start]);

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
    try {
      await start();
      return { video: true, audio: true };
    } catch {
      return { video: false, audio: false };
    }
  }, [start]);

  return {
    activeStream,
    ready,
    accessGranted,
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
