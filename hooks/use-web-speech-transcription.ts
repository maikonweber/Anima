"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  appendTeleconsultTranscriptionSegments,
  startTeleconsultTranscription,
  stopTeleconsultTranscription,
} from "@/lib/api/teleconsult";
import { ApiError } from "@anima/shared";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string; confidence: number };
  }>;
};

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionLike)
  | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useWebSpeechTranscription(orgId: string, sessionId: string) {
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPartial, setLastPartial] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const bufferRef = useRef<
    Array<{ text: string; confidence: number | null }>
  >([]);
  const flushTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const wantActive = useRef(false);

  useEffect(() => {
    setSupported(!!getSpeechRecognitionCtor());
  }, []);

  const flush = useCallback(async () => {
    const batch = bufferRef.current.splice(0, bufferRef.current.length);
    if (batch.length === 0) return;
    try {
      await appendTeleconsultTranscriptionSegments(orgId, sessionId, {
        segments: batch.map((b) => ({
          text: b.text,
          confidence: b.confidence,
          speaker: "UNKNOWN",
        })),
      });
    } catch {
      // keep going; ASR failure must not block session
    }
  }, [orgId, sessionId]);

  const stop = useCallback(async () => {
    wantActive.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (flushTimer.current) {
      clearInterval(flushTimer.current);
      flushTimer.current = null;
    }
    await flush();
    try {
      await stopTeleconsultTranscription(orgId, sessionId);
    } catch {
      // ignore
    }
    setActive(false);
    setLastPartial("");
  }, [flush, orgId, sessionId]);

  const start = useCallback(async () => {
    setError(null);
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError("Reconhecimento de fala não suportado neste navegador.");
      return;
    }
    try {
      await startTeleconsultTranscription(orgId, sessionId);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError(
          "Consentimento TELECONSULTA_TRANSCRICAO necessário para transcrever.",
        );
      } else {
        setError(err instanceof Error ? err.message : "Falha ao iniciar ASR");
      }
      return;
    }

    wantActive.current = true;
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "pt-BR";
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0]?.transcript?.trim();
        if (!transcript) continue;
        if (result.isFinal) {
          bufferRef.current.push({
            text: transcript,
            confidence: result[0]?.confidence ?? null,
          });
        } else {
          interim += transcript;
        }
      }
      setLastPartial(interim);
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted" && event.error !== "no-speech") {
        setError(`ASR: ${event.error}`);
      }
    };
    recognition.onend = () => {
      if (wantActive.current) {
        try {
          recognition.start();
        } catch {
          // ignore restart race
        }
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
    flushTimer.current = setInterval(() => {
      void flush();
    }, 4000);
    setActive(true);
  }, [flush, orgId, sessionId]);

  useEffect(() => {
    return () => {
      wantActive.current = false;
      recognitionRef.current?.stop();
      if (flushTimer.current) clearInterval(flushTimer.current);
    };
  }, []);

  return { active, supported, error, lastPartial, start, stop };
}
