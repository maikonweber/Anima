"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { BreathingExercise } from "@/components/calm/BreathingExercise";
import { GroundingExercise } from "@/components/calm/GroundingExercise";
import { useCalmSessionsThisWeek } from "@/components/calm/calm-sessions";
import { useLocale } from "@/lib/i18n/locale-provider";
import { getCalmDictionary } from "@/lib/i18n/dictionaries/calm";

type Tab = "breathing" | "grounding";

export default function GuidedPausePage() {
  const { locale, localizedHref } = useLocale();
  const t = getCalmDictionary(locale);
  const [tab, setTab] = useState<Tab>("breathing");
  const weekCount = useCalmSessionsThisWeek();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          {t.title}
        </h1>
        <p className="text-sm text-foreground/45 mb-2">{t.subtitle}</p>
        {weekCount > 0 && (
          <p className="text-xs font-medium text-anima-violet mb-4">
            {t.sessionsWeek(weekCount)}
          </p>
        )}

        <div
          role="tablist"
          aria-label={t.title}
          className="inline-flex rounded-full border border-foreground/[0.08] p-1 my-4"
        >
          {(["breathing", "grounding"] as const).map((id) => (
            <button
              key={id}
              role="tab"
              id={`calm-tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`calm-panel-${id}`}
              type="button"
              onClick={() => setTab(id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-anima-violet text-white"
                  : "text-foreground/60 hover:text-foreground/85"
              }`}
            >
              {t.tabs[id]}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`calm-panel-${tab}`}
          aria-labelledby={`calm-tab-${tab}`}
        >
          {tab === "breathing" ? (
            <BreathingExercise t={t} />
          ) : (
            <GroundingExercise t={t} />
          )}
        </div>

        <div className="mt-8 glass-panel p-5">
          <p className="text-sm font-semibold text-foreground/75 mb-3">
            {t.afterTitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={localizedHref("/diary/new")}
              className="text-sm font-medium text-anima-violet hover:text-anima-lilac transition-colors"
            >
              {t.logMoment} →
            </Link>
            <Link
              href={localizedHref("/dashboard/recursos")}
              className="text-sm font-medium text-foreground/55 hover:text-foreground/80 transition-colors"
            >
              {t.crisisLink} →
            </Link>
          </div>
        </div>

        <p className="text-xs text-foreground/35 mt-6">{t.disclaimer}</p>
      </motion.div>
    </div>
  );
}
