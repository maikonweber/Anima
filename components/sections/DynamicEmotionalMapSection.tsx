"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EmotionLayerMap } from "@/components/emotion/EmotionLayerMap";
import { EmotionalStatePanel } from "@/components/emotion/EmotionalStatePanel";
import { EmotionBlendCard } from "@/components/emotion/EmotionBlendCard";
import { analyzeEmotions } from "@/lib/emotion/api";
import { BASE_EMOTIONS } from "@/lib/emotion/base-emotions";
import { BLEND_DEFINITIONS } from "@/lib/emotion/blends";
import type { EmotionalAnalysis } from "@/lib/emotion/types";

const FEATURED_BLENDS = BLEND_DEFINITIONS.slice(0, 6);

export function DynamicEmotionalMapSection() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<EmotionalAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!text.trim() || isLoading) return;

      setIsLoading(true);
      setError(null);
      setAnalysis(null);

      try {
        const result = await analyzeEmotions(text.trim());
        setAnalysis(result);
      } catch {
        setError(
          "Não conseguimos ler seus sentimentos agora. Tente de novo em instantes.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [text, isLoading],
  );

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-24">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl animate-gentle-float"
          style={{ backgroundColor: "var(--anima-violet)" }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-15 blur-3xl animate-gentle-float"
          style={{
            backgroundColor: "var(--anima-lilac)",
            animationDelay: "3s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: "var(--anima-indigo)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground/90 mb-3">
            Mapa Emocional Dinâmico
          </h2>
          <p className="text-base sm:text-lg text-foreground/50 max-w-lg mx-auto leading-relaxed">
            Explore como suas emoções se conectam e descobrem novas camadas do
            que você sente.
          </p>
        </motion.div>

        {/* Check-in input */}
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto mb-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="glass-panel p-4 sm:p-5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Como você está se sentindo agora? Escreva livremente..."
              rows={3}
              className="w-full bg-transparent text-foreground/80 placeholder:text-foreground/30 text-sm sm:text-base leading-relaxed resize-none focus:outline-none"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!text.trim() || isLoading}
                className="px-5 py-2 rounded-full text-sm font-medium text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
                  boxShadow: text.trim()
                    ? "0 4px 20px -4px var(--anima-glow)"
                    : "none",
                }}
              >
                {isLoading ? "Analisando..." : "Explorar meus sentimentos"}
              </button>
            </div>
          </div>
        </motion.form>

        {/* Analysis result */}
        <AnimatePresence mode="wait">
          {(isLoading || analysis || error) && (
            <motion.div
              className="max-w-lg mx-auto mb-16"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              {error ? (
                <motion.div
                  className="glass-panel p-5 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-lg mb-2 block" aria-hidden="true">
                    🌧️
                  </span>
                  <p className="text-sm text-foreground/50">{error}</p>
                </motion.div>
              ) : (
                <EmotionalStatePanel
                  analysis={analysis}
                  isLoading={isLoading}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emotion Layer Map */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-foreground/70 mb-4 text-center">
            Matriz de Combinações Emocionais
          </h3>
          <div className="glass-panel p-4 sm:p-6 emotion-glow">
            <EmotionLayerMap />
          </div>
        </motion.div>

        {/* Featured blend cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <h3 className="text-lg font-semibold text-foreground/70 mb-6 text-center">
            Combinações Emocionais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_BLENDS.map((blend) => (
              <EmotionBlendCard
                key={`${blend.a}-${blend.b}`}
                emotionA={{
                  name: BASE_EMOTIONS[blend.a].name,
                  color: BASE_EMOTIONS[blend.a].color,
                }}
                emotionB={{
                  name: BASE_EMOTIONS[blend.b].name,
                  color: BASE_EMOTIONS[blend.b].color,
                }}
                compositeName={blend.composite.name}
                description={blend.composite.description}
                energy={blend.composite.energy}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
