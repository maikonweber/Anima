"use client";

import { useState } from "react";
import type { CalmDictionary } from "@/lib/i18n/dictionaries/calm";
import { recordCalmSession } from "./calm-sessions";
import { PrimaryButton } from "./BreathingExercise";

/** Aterramento 5-4-3-2-1. Anotações ficam só em memória (nunca enviadas). */
export function GroundingExercise({ t }: { t: CalmDictionary }) {
  const steps = t.grounding.steps;
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState<string[]>(() => steps.map(() => ""));
  const done = index >= steps.length;

  if (done) {
    return (
      <div className="glass-panel p-6 sm:p-8 text-center space-y-3">
        <p className="text-xl font-semibold text-foreground/85">
          {t.grounding.doneTitle}
        </p>
        <p className="text-sm text-foreground/55">{t.grounding.doneHint}</p>
        <div className="pt-2">
          <PrimaryButton
            onClick={() => {
              setNotes(steps.map(() => ""));
              setIndex(0);
            }}
          >
            {t.grounding.restart}
          </PrimaryButton>
        </div>
      </div>
    );
  }

  const step = steps[index];
  const isLast = index === steps.length - 1;
  const inputId = `grounding-step-${index}`;

  return (
    <div className="space-y-4">
      <p className="text-sm text-foreground/55">{t.grounding.intro}</p>
      <ol className="flex gap-2" aria-label={t.grounding.stepOf(index + 1, steps.length)}>
        {steps.map((s, i) => (
          <li
            key={s.count}
            aria-current={i === index ? "step" : undefined}
            className={`flex-1 h-1.5 rounded-full ${
              i <= index ? "bg-anima-violet" : "bg-foreground/[0.08]"
            }`}
          />
        ))}
      </ol>
      <div className="glass-panel p-6 sm:p-8">
        <p className="text-xs uppercase tracking-wide text-foreground/40">
          {t.grounding.stepOf(index + 1, steps.length)}
        </p>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-5xl font-bold text-anima-violet tabular-nums">
            {step.count}
          </span>
          <span className="text-lg font-semibold text-foreground/80">
            {step.sense}
          </span>
        </div>
        <label htmlFor={inputId} className="block text-base text-foreground/75 mt-3">
          {step.prompt}
        </label>
        <textarea
          id={inputId}
          rows={3}
          value={notes[index]}
          onChange={(e) =>
            setNotes((prev) => prev.map((n, i) => (i === index ? e.target.value : n)))
          }
          placeholder={t.grounding.placeholder}
          autoComplete="off"
          className="mt-4 w-full rounded-xl border border-foreground/[0.1] bg-transparent px-3 py-2 text-sm text-foreground/80 placeholder:text-foreground/35 focus:outline-none focus:ring-2 focus:ring-anima-violet/40"
        />
        <p className="text-xs text-foreground/35 mt-2">{t.grounding.privacy}</p>
        <div className="flex justify-between gap-3 mt-6">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="px-5 py-2.5 rounded-full text-sm font-medium border border-foreground/[0.12] text-foreground/65 hover:border-foreground/25 disabled:opacity-40"
          >
            {t.grounding.previous}
          </button>
          <PrimaryButton
            onClick={() => {
              if (isLast) recordCalmSession();
              setIndex((i) => i + 1);
            }}
          >
            {isLast ? t.grounding.finish : t.grounding.next}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
