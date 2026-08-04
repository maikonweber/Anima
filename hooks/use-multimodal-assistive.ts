"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { postTeleconsultMultimodalAggregate } from "@/lib/api/teleconsult";
import { ApiError } from "@anima/shared";

export const MULTIMODAL_CLIENT_MODEL_VERSION = "assistive-v1.0";

const SAMPLE_MS = 250;
const FLUSH_MS = 12_000;
const ENERGY_SPEAK_THRESHOLD = 0.08;
const LONG_PAUSE_MS = 1500;

type Props = {
  orgId: string;
  sessionId: string;
  mediaStream: MediaStream | null;
  videoEl: HTMLVideoElement | null;
  muted: boolean;
  videoOff: boolean;
  enabled: boolean;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/**
 * RF-064 — captura leve no client (Web Audio + canvas) e envia JSON agregado.
 * Sem frames brutos, sem face-ID.
 */
export function useMultimodalAssistive({
  orgId,
  sessionId,
  mediaStream,
  videoEl,
  muted,
  videoOff,
  enabled,
}: Props) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSentAt, setLastSentAt] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const sampleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const windowStartRef = useRef<Date>(new Date());
  const prevFrameRef = useRef<Float32Array | null>(null);

  const accumRef = useRef({
    energySum: 0,
    energyPeak: 0,
    samples: 0,
    speakingSamples: 0,
    pauseSamples: 0,
    longPauseCount: 0,
    silenceMs: 0,
    facePresenceSum: 0,
    motionSum: 0,
    visionSamples: 0,
  });

  const resetAccum = useCallback(() => {
    accumRef.current = {
      energySum: 0,
      energyPeak: 0,
      samples: 0,
      speakingSamples: 0,
      pauseSamples: 0,
      longPauseCount: 0,
      silenceMs: 0,
      facePresenceSum: 0,
      motionSum: 0,
      visionSamples: 0,
    };
    windowStartRef.current = new Date();
    prevFrameRef.current = null;
  }, []);

  const sampleVoice = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const buf = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(buf);
    let sumSq = 0;
    for (let i = 0; i < buf.length; i++) {
      const v = (buf[i]! - 128) / 128;
      sumSq += v * v;
    }
    const rms = Math.sqrt(sumSq / buf.length);
    const energy = clamp01(rms * 3.5);
    const a = accumRef.current;
    a.energySum += energy;
    a.energyPeak = Math.max(a.energyPeak, energy);
    a.samples += 1;
    if (energy >= ENERGY_SPEAK_THRESHOLD) {
      a.speakingSamples += 1;
      if (a.silenceMs >= LONG_PAUSE_MS) a.longPauseCount += 1;
      a.silenceMs = 0;
    } else {
      a.pauseSamples += 1;
      a.silenceMs += SAMPLE_MS;
    }
  }, []);

  const sampleVision = useCallback(() => {
    const video = videoEl;
    if (!video || video.readyState < 2 || video.videoWidth === 0) return;
    const w = 48;
    const h = 36;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);
    const luma = new Float32Array(w * h);
    let bright = 0;
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const y = (0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!) / 255;
      luma[p] = y;
      if (y > 0.12) bright += 1;
    }
    const presence = bright / luma.length;
    let motion = 0;
    const prev = prevFrameRef.current;
    if (prev && prev.length === luma.length) {
      let diff = 0;
      for (let i = 0; i < luma.length; i++) {
        diff += Math.abs(luma[i]! - prev[i]!);
      }
      motion = clamp01(diff / luma.length / 0.25);
    }
    prevFrameRef.current = luma;
    const a = accumRef.current;
    a.facePresenceSum += presence;
    a.motionSum += motion;
    a.visionSamples += 1;
  }, [videoEl]);

  const flush = useCallback(async () => {
    const a = accumRef.current;
    if (a.samples < 4 && a.visionSamples < 2) return;
    const n = Math.max(a.samples, 1);
    const vn = Math.max(a.visionSamples, 1);
    const windowEndedAt = new Date();
    const payload = {
      voice:
        a.samples > 0
          ? {
              avgEnergy: clamp01(a.energySum / n),
              peakEnergy: clamp01(a.energyPeak),
              pauseRatio: clamp01(a.pauseSamples / n),
              speakingRatio: clamp01(a.speakingSamples / n),
              longPauseCount: a.longPauseCount,
            }
          : undefined,
      vision:
        a.visionSamples > 0
          ? {
              facePresenceRatio: clamp01(a.facePresenceSum / vn),
              motionScore: clamp01(a.motionSum / vn),
              sampleCount: a.visionSamples,
            }
          : undefined,
      meta: {
        muted,
        videoOff,
        source: "local" as const,
      },
    };
    if (!payload.voice && !payload.vision) return;
    try {
      await postTeleconsultMultimodalAggregate(orgId, sessionId, {
        clientModelVersion: MULTIMODAL_CLIENT_MODEL_VERSION,
        windowStartedAt: windowStartRef.current.toISOString(),
        windowEndedAt: windowEndedAt.toISOString(),
        payload,
      });
      setLastSentAt(windowEndedAt.toISOString());
      setError(null);
      resetAccum();
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Falha ao enviar sinais assistivos";
      setError(msg);
    }
  }, [muted, orgId, resetAccum, sessionId, videoOff]);

  const stop = useCallback(async () => {
    if (sampleTimerRef.current) {
      clearInterval(sampleTimerRef.current);
      sampleTimerRef.current = null;
    }
    if (flushTimerRef.current) {
      clearInterval(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    analyserRef.current = null;
    if (audioCtxRef.current) {
      void audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (active) {
      await flush();
    }
    setActive(false);
  }, [active, flush]);

  const start = useCallback(async () => {
    setError(null);
    if (!mediaStream) {
      setError("Mídia local indisponível");
      return;
    }
    if (sampleTimerRef.current) return;
    resetAccum();
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      const source = ctx.createMediaStreamSource(mediaStream);
      source.connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch {
      // Áudio opcional — visão ainda pode rodar.
    }

    sampleTimerRef.current = setInterval(() => {
      sampleVoice();
      if (!videoOff) sampleVision();
    }, SAMPLE_MS);
    flushTimerRef.current = setInterval(() => {
      void flush();
    }, FLUSH_MS);
    setActive(true);
  }, [flush, mediaStream, resetAccum, sampleVision, sampleVoice, videoOff]);

  useEffect(() => {
    if (!enabled && active) {
      void stop();
    }
  }, [enabled, active, stop]);

  useEffect(() => {
    return () => {
      void stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cleanup on unmount only
  }, []);

  return {
    active,
    error,
    lastSentAt,
    start,
    stop,
    supported: typeof window !== "undefined" && !!window.AudioContext,
  };
}
