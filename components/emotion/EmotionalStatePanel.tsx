"use client";

import { AnimatePresence, motion } from "motion/react";
import type { EmotionalAnalysis } from "@/lib/emotion/types";
import { BASE_EMOTIONS } from "@/lib/emotion/base-emotions";
import { EmotionCircle } from "./EmotionCircle";
import { EmotionBlendCard } from "./EmotionBlendCard";
import { EmotionInsightCard } from "./EmotionInsightCard";

interface EmotionalStatePanelProps {
  analysis: EmotionalAnalysis | null;
  isLoading?: boolean;
}

export function EmotionalStatePanel({
  analysis,
  isLoading = false,
}: EmotionalStatePanelProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="flex items-center gap-2">
          <div
            className="w-12 h-12 rounded-full animate-emotion-pulse"
            style={{ backgroundColor: "#B8A4E8", opacity: 0.5 }}
          />
          <div
            className="-ml-4 w-12 h-12 rounded-full animate-emotion-pulse"
            style={{
              backgroundColor: "#7EB8DA",
              opacity: 0.5,
              animationDelay: "0.5s",
            }}
          />
        </div>
        <p className="text-sm text-foreground/40 animate-pulse">
          Analisando seus sentimentos...
        </p>
      </div>
    );
  }

  if (!analysis) return null;

  const baseEmotionIds = analysis.baseEmotions.map((e) => e.id);
  const primaryPair =
    baseEmotionIds.length >= 2
      ? [BASE_EMOTIONS[baseEmotionIds[0]], BASE_EMOTIONS[baseEmotionIds[1]]]
      : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={analysis.composite.blendKey}
        className="flex flex-col items-center gap-6 w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
      >
        {/* Detected base emotions */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium tracking-wide uppercase text-foreground/40">
            Emoções detectadas
          </span>
          <div className="flex gap-3 flex-wrap justify-center">
            {analysis.baseEmotions.map((be) => {
              const emotion = BASE_EMOTIONS[be.id];
              return (
                <div
                  key={be.id}
                  className="flex items-center gap-2 glass-panel px-3 py-1.5"
                  style={{ borderRadius: "9999px" }}
                >
                  <EmotionCircle
                    color={emotion.color}
                    label={emotion.name}
                    size="sm"
                    className="!w-5 !h-5"
                  />
                  <span className="text-sm font-medium text-foreground/70">
                    {emotion.icon} {emotion.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Composite blend card */}
        {primaryPair ? (
          <EmotionBlendCard
            emotionA={{ name: primaryPair[0].name, color: primaryPair[0].color }}
            emotionB={{ name: primaryPair[1].name, color: primaryPair[1].color }}
            compositeName={analysis.composite.name}
            description={analysis.composite.description}
            energy={analysis.composite.energy}
            className="w-full max-w-sm"
          />
        ) : (
          <div className="glass-panel p-6 text-center w-full max-w-sm">
            <EmotionCircle
              color={BASE_EMOTIONS[baseEmotionIds[0]].color}
              label={analysis.composite.name}
              size="lg"
              className="mx-auto mb-3"
            />
            <h3 className="text-lg font-semibold text-foreground/90">
              {analysis.composite.name}
            </h3>
            <p className="text-sm text-foreground/55 mt-1">
              {analysis.composite.description}
            </p>
          </div>
        )}

        {/* Insight */}
        {analysis.insight && (
          <EmotionInsightCard
            insight={analysis.insight}
            className="w-full max-w-sm"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
