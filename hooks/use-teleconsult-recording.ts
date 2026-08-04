"use client";

import { useCallback, useRef, useState } from "react";
import {
  completeTeleconsultRecording,
  getTeleconsultRecordingPartUrl,
  startTeleconsultRecording,
} from "@/lib/api/teleconsult";
import { ApiError } from "@anima/shared";

const MIN_PART_BYTES = 5 * 1024 * 1024;

type Props = {
  orgId: string;
  sessionId: string;
  localStream: MediaStream | null;
  localVideo: HTMLVideoElement | null;
  remoteVideo: HTMLVideoElement | null;
};

export function useTeleconsultRecording({
  orgId,
  sessionId,
  localStream,
  localVideo,
  remoteVideo,
}: Props) {
  const [active, setActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingIdRef = useRef<string | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chunkBytesRef = useRef(0);
  const partsRef = useRef<Array<{ partNumber: number; etag: string }>>([]);
  const nextPartRef = useRef(1);
  const uploadChainRef = useRef<Promise<void>>(Promise.resolve());
  const startedAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const composedStreamRef = useRef<MediaStream | null>(null);

  const uploadPart = useCallback(
    async (blob: Blob) => {
      const recordingId = recordingIdRef.current;
      if (!recordingId) throw new Error("Gravação não iniciada");
      const partNumber = nextPartRef.current++;
      const signed = await getTeleconsultRecordingPartUrl(
        orgId,
        sessionId,
        recordingId,
        partNumber,
      );
      const response = await fetch(signed.uploadUrl, {
        method: "PUT",
        body: blob,
      });
      if (!response.ok) throw new Error("Falha no upload da gravação");
      const etag = response.headers.get("etag");
      if (!etag) throw new Error("Storage não retornou ETag");
      partsRef.current.push({ partNumber, etag });
    },
    [orgId, sessionId],
  );

  const flushBuffered = useCallback(
    (force = false) => {
      if (!force && chunkBytesRef.current < MIN_PART_BYTES) return;
      if (chunksRef.current.length === 0) return;
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      chunksRef.current = [];
      chunkBytesRef.current = 0;
      uploadChainRef.current = uploadChainRef.current.then(() =>
        uploadPart(blob),
      );
    },
    [uploadPart],
  );

  const composeStream = useCallback(() => {
    if (!localStream) throw new Error("Mídia local indisponível");
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas indisponível");

    const draw = () => {
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const remoteReady = remoteVideo && remoteVideo.readyState >= 2;
      if (remoteReady) {
        ctx.drawImage(remoteVideo, 0, 0, canvas.width, canvas.height);
      } else if (localVideo && localVideo.readyState >= 2) {
        ctx.drawImage(localVideo, 0, 0, canvas.width, canvas.height);
      }
      if (remoteReady && localVideo && localVideo.readyState >= 2) {
        const w = 300;
        const h = 169;
        ctx.drawImage(localVideo, canvas.width - w - 24, 24, w, h);
      }
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();

    const canvasStream = canvas.captureStream(30);
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    audioContextRef.current = audioContext;
    const streams = [
      localStream,
      remoteVideo?.srcObject instanceof MediaStream
        ? remoteVideo.srcObject
        : null,
    ].filter((stream): stream is MediaStream => !!stream);
    for (const stream of streams) {
      if (stream.getAudioTracks().length > 0) {
        audioContext.createMediaStreamSource(stream).connect(destination);
      }
    }
    const composed = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...destination.stream.getAudioTracks(),
    ]);
    composedStreamRef.current = composed;
    return composed;
  }, [localStream, localVideo, remoteVideo]);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    composedStreamRef.current?.getTracks().forEach((track) => track.stop());
    composedStreamRef.current = null;
    if (audioContextRef.current) void audioContextRef.current.close();
    audioContextRef.current = null;
  }, []);

  const start = useCallback(async () => {
    if (active || !localStream) return;
    setError(null);
    try {
      const reservation = await startTeleconsultRecording(orgId, sessionId);
      recordingIdRef.current = reservation.id;
      chunksRef.current = [];
      chunkBytesRef.current = 0;
      partsRef.current = [];
      nextPartRef.current = 1;
      uploadChainRef.current = Promise.resolve();
      const stream = composeStream();
      const mimeType = MediaRecorder.isTypeSupported(
        "video/webm;codecs=vp9,opus",
      )
        ? "video/webm;codecs=vp9,opus"
        : "video/webm";
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 1_800_000,
        audioBitsPerSecond: 96_000,
      });
      recorder.ondataavailable = (event) => {
        if (event.data.size === 0) return;
        chunksRef.current.push(event.data);
        chunkBytesRef.current += event.data.size;
        flushBuffered(false);
      };
      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      recorder.start(1000);
      timerRef.current = setInterval(
        () => setElapsedMs(Date.now() - startedAtRef.current),
        1000,
      );
      setActive(true);
    } catch (caught) {
      cleanup();
      setError(
        caught instanceof ApiError || caught instanceof Error
          ? caught.message
          : "Não foi possível iniciar a gravação",
      );
    }
  }, [active, cleanup, composeStream, flushBuffered, localStream, orgId, sessionId]);

  const stop = useCallback(async () => {
    const recorder = recorderRef.current;
    const recordingId = recordingIdRef.current;
    if (!recorder || !recordingId) return;
    setUploading(true);
    setError(null);
    try {
      await new Promise<void>((resolve) => {
        recorder.addEventListener("stop", () => resolve(), { once: true });
        recorder.stop();
      });
      flushBuffered(true);
      await uploadChainRef.current;
      if (partsRef.current.length === 0) {
        throw new Error("A gravação não contém mídia suficiente");
      }
      await completeTeleconsultRecording(orgId, sessionId, recordingId, {
        parts: partsRef.current,
        durationMs: Math.max(1, Date.now() - startedAtRef.current),
      });
      setActive(false);
    } catch (caught) {
      setError(
        caught instanceof ApiError || caught instanceof Error
          ? caught.message
          : "Não foi possível finalizar a gravação",
      );
    } finally {
      cleanup();
      setUploading(false);
      recorderRef.current = null;
    }
  }, [cleanup, flushBuffered, orgId, sessionId]);

  return {
    active,
    uploading,
    elapsedMs,
    error,
    supported:
      typeof window !== "undefined" &&
      "MediaRecorder" in window &&
      typeof HTMLCanvasElement !== "undefined" &&
      "captureStream" in HTMLCanvasElement.prototype,
    start,
    stop,
  };
}
