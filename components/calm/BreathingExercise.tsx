"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type {
  CalmDictionary,
  CalmPatternId,
} from "@/lib/i18n/dictionaries/calm";
import { recordCalmSession } from "./calm-sessions";

type PhaseKind = "inhale" | "hold" | "exhale";
type Phase = { kind: PhaseKind; seconds: number; scale: number };

const PATTERNS: Record<CalmPatternId, Phase[]> = {
  box: [
    { kind: "inhale", seconds: 4, scale: 1 },
    { kind: "hold", seconds: 4, scale: 1 },
    { kind: "exhale", seconds: 4, scale: 0.55 },
    { kind: "hold", seconds: 4, scale: 0.55 },
  ],
  "478": [
    { kind: "inhale", seconds: 4, scale: 1 },
    { kind: "hold", seconds: 7, scale: 1 },
    { kind: "exhale", seconds: 8, scale: 0.55 },
  ],
  coherent: [
    { kind: "inhale", seconds: 5, scale: 1 },
    { kind: "exhale", seconds: 5, scale: 0.55 },
  ],
};

const PATTERN_IDS: CalmPatternId[] = ["box", "478", "coherent"];
const DURATIONS = [1, 3, 5];

type Status = "idle" | "running" | "paused" | "done";

function formatClock(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function BreathingExercise({ t }: { t: CalmDictionary }) {
  const reduce = useReducedMotion() ?? false;
  const [patternId, setPatternId] = useState<CalmPatternId>("box");
  const [minutes, setMinutes] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const baseRef = useRef(0);

  const phases = PATTERNS[patternId];
  const cycleMs = useMemo(
    () => phases.reduce((sum, p) => sum + p.seconds * 1000, 0),
    [phases],
  );
  const totalMs = minutes * 60_000;

  useEffect(() => {
    if (status !== "running") return;
    const id = window.setInterval(() => {
      const start = startRef.current ?? Date.now();
      const next = baseRef.current + (Date.now() - start);
      if (next >= totalMs) {
        setElapsed(totalMs);
        setStatus("done");
        recordCalmSession();
        return;
      }
      setElapsed(next);
    }, 100);
    return () => window.clearInterval(id);
  }, [status, totalMs]);

  const start = () => {
    baseRef.current = 0;
    startRef.current = Date.now();
    setElapsed(0);
    setStatus("running");
  };
  const pause = () => {
    baseRef.current = elapsed;
    startRef.current = null;
    setStatus("paused");
  };
  const resume = () => {
    startRef.current = Date.now();
    setStatus("running");
  };
  const reset = () => {
    baseRef.current = 0;
    startRef.current = null;
    setElapsed(0);
    setStatus("idle");
  };

  // Fase atual derivada do tempo decorrido.
  const inCycle = elapsed % cycleMs;
  let acc = 0;
  let phaseIndex = 0;
  for (let i = 0; i < phases.length; i++) {
    const len = phases[i].seconds * 1000;
    if (inCycle < acc + len) {
      phaseIndex = i;
      break;
    }
    acc += len;
  }
  const phase = phases[phaseIndex];
  const phaseRemaining = Math.ceil((acc + phase.seconds * 1000 - inCycle) / 1000);
  const cycleNumber = Math.floor(elapsed / cycleMs) + 1;
  const active = status === "running" || status === "paused";
  const circleScale = active ? phase.scale : status === "done" ? 0.8 : 0.55;
  const progress = Math.min(1, elapsed / totalMs);

  const lockedChoice = active;

  return (
    <div className="space-y-6">
      <fieldset className="space-y-2" disabled={lockedChoice}>
        <legend className="sr-only">{t.tabs.breathing}</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {PATTERN_IDS.map((id) => {
            const selected = id === patternId;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setPatternId(id);
                  reset();
                }}
                className={`text-left rounded-2xl border px-4 py-3 transition-colors disabled:opacity-60 ${
                  selected
                    ? "border-anima-violet/50 bg-anima-violet/[0.08]"
                    : "border-foreground/[0.08] hover:border-foreground/20"
                }`}
              >
                <span className="block text-sm font-semibold text-foreground/85">
                  {t.patterns[id].name}
                </span>
                <span className="block text-xs text-foreground/50 mt-1 leading-snug">
                  {t.patterns[id].description}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-foreground/45">{t.duration}</span>
          {DURATIONS.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={m === minutes}
              onClick={() => {
                setMinutes(m);
                reset();
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors disabled:opacity-60 ${
                m === minutes
                  ? "border-anima-violet/50 bg-anima-violet/[0.1] text-anima-violet"
                  : "border-foreground/[0.1] text-foreground/60 hover:border-foreground/25"
              }`}
            >
              {t.minutes(m)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="glass-panel p-6 sm:p-8 flex flex-col items-center">
        <div
          className="relative flex items-center justify-center w-56 h-56 sm:w-64 sm:h-64"
          aria-hidden="true"
        >
          <div className="absolute inset-0 rounded-full border border-anima-violet/15" />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, var(--anima-lilac), var(--anima-violet) 60%, var(--anima-indigo))",
              opacity: 0.85,
            }}
            initial={false}
            animate={{ scale: reduce ? 0.8 : circleScale }}
            transition={{
              duration:
                reduce || !active || status === "paused"
                  ? 0.3
                  : phase.kind === "hold"
                    ? 0.2
                    : phase.seconds,
              ease: "easeInOut",
            }}
          />
          <div className="relative text-center text-white drop-shadow">
            {active ? (
              <>
                <div className="text-xl font-semibold">{t.phases[phase.kind]}</div>
                <div className="text-4xl font-bold tabular-nums mt-1">
                  {phaseRemaining}
                </div>
              </>
            ) : status === "done" ? (
              <div className="text-lg font-semibold px-6">{t.done}</div>
            ) : (
              <div className="text-lg font-semibold">{t.minutes(minutes)}</div>
            )}
          </div>
        </div>

        {/* Leitores de tela: anuncia só a troca de fase. */}
        <p className="sr-only" aria-live="polite">
          {active ? t.phases[phase.kind] : status === "done" ? t.done : ""}
        </p>

        <div className="w-full max-w-xs mt-6">
          <div
            className="h-1.5 rounded-full bg-foreground/[0.08] overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <div
              className="h-full rounded-full bg-anima-violet transition-[width] duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-foreground/45 mt-2 tabular-nums">
            <span>{active ? t.cycle(cycleNumber) : "\u00a0"}</span>
            <span>
              {formatClock(totalMs - elapsed)} {t.remaining}
            </span>
          </div>
        </div>

        {status === "done" && (
          <p className="text-sm text-foreground/55 mt-4 text-center">
            {t.doneHint}
          </p>
        )}
        {reduce && (
          <p className="text-xs text-foreground/40 mt-3 text-center">
            {t.reducedMotionHint}
          </p>
        )}

        <div className="flex gap-3 mt-6">
          {status === "idle" && (
            <PrimaryButton onClick={start}>{t.start}</PrimaryButton>
          )}
          {status === "running" && (
            <PrimaryButton onClick={pause}>{t.pause}</PrimaryButton>
          )}
          {status === "paused" && (
            <PrimaryButton onClick={resume}>{t.resume}</PrimaryButton>
          )}
          {status === "done" && (
            <PrimaryButton onClick={start}>{t.reset}</PrimaryButton>
          )}
          {(status === "running" || status === "paused") && (
            <button
              type="button"
              onClick={reset}
              className="px-5 py-2.5 rounded-full text-sm font-medium border border-foreground/[0.12] text-foreground/65 hover:border-foreground/25"
            >
              {t.reset}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[var(--anima-glow)] disabled:opacity-50"
      style={{
        background:
          "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
      }}
    >
      {children}
    </button>
  );
}
