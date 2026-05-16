"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/auth/AuthContext";
import { EmotionalStatePanel } from "@/components/emotion/EmotionalStatePanel";
import { EmotionBlendCard } from "@/components/emotion/EmotionBlendCard";
import { EmotionCircle } from "@/components/emotion/EmotionCircle";
import { analyzeEmotions } from "@/lib/emotion/api";
import { BASE_EMOTIONS, BASE_EMOTION_IDS } from "@/lib/emotion/base-emotions";
import { BLEND_DEFINITIONS } from "@/lib/emotion/blends";
import type { EmotionalAnalysis } from "@/lib/emotion/types";

const FEATURED_BLENDS = BLEND_DEFINITIONS.slice(0, 6);

export default function DashboardHome() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<EmotionalAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const greeting = getGreeting();

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
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-10 blur-3xl animate-gentle-float"
          style={{ backgroundColor: "var(--anima-violet)" }}
        />
        <div
          className="absolute bottom-0 -left-24 w-64 h-64 rounded-full opacity-8 blur-3xl animate-gentle-float"
          style={{ backgroundColor: "var(--anima-lilac)", animationDelay: "3s" }}
        />
      </div>

      {/* Greeting */}
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          {greeting}, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-foreground/40">
          Como você está se sentindo hoje?
        </p>
      </motion.div>

      {/* Quick emotion selector */}
      <motion.div
        className="relative mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex gap-2.5 flex-wrap">
          {BASE_EMOTION_IDS.map((id) => {
            const emo = BASE_EMOTIONS[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  setText((prev) =>
                    prev
                      ? `${prev}, me sinto com ${emo.name.toLowerCase()}`
                      : `Estou sentindo ${emo.name.toLowerCase()}`,
                  )
                }
                className="flex items-center gap-2 glass-panel px-3 py-2 hover:scale-105 transition-transform duration-200 cursor-pointer"
                style={{ borderRadius: "9999px" }}
              >
                <EmotionCircle
                  color={emo.color}
                  label={emo.name}
                  size="sm"
                  className="!w-4 !h-4"
                />
                <span className="text-xs font-medium text-foreground/60">
                  {emo.icon} {emo.name}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Check-in input */}
      <motion.form
        onSubmit={handleSubmit}
        className="relative mb-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="glass-panel p-5 emotion-glow">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Descreva como você se sente agora... Pode ser uma palavra, uma frase ou um desabafo."
            rows={3}
            className="w-full bg-transparent text-foreground/80 placeholder:text-foreground/25 text-sm leading-relaxed resize-none focus:outline-none"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-[10px] text-foreground/20">
              {text.length > 0 ? `${text.length} caracteres` : ""}
            </span>
            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className="px-5 py-2 rounded-full text-sm font-medium text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
                boxShadow: text.trim()
                  ? "0 4px 20px -4px var(--anima-glow)"
                  : "none",
              }}
            >
              {isLoading ? "Analisando..." : "Explorar sentimentos"}
            </button>
          </div>
        </div>
      </motion.form>

      {/* Result */}
      <AnimatePresence mode="wait">
        {(isLoading || analysis || error) && (
          <motion.div
            className="relative mb-10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            {error ? (
              <div className="glass-panel p-5 text-center">
                <span className="text-lg block mb-2" aria-hidden="true">
                  🌧️
                </span>
                <p className="text-sm text-foreground/50">{error}</p>
              </div>
            ) : (
              <EmotionalStatePanel
                analysis={analysis}
                isLoading={isLoading}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured blend cards */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-base font-semibold text-foreground/60 mb-4">
          Descubra combinações emocionais
        </h2>
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
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}
