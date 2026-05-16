"use client";

import { motion } from "motion/react";
import { EmotionLayerMap } from "@/components/emotion/EmotionLayerMap";
import { EmotionBlendCard } from "@/components/emotion/EmotionBlendCard";
import { BASE_EMOTIONS } from "@/lib/emotion/base-emotions";
import { BLEND_DEFINITIONS } from "@/lib/emotion/blends";

export default function MapaEmocionalPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-2">
          Mapa Emocional
        </h1>
        <p className="text-sm text-foreground/40 mb-8">
          Explore todas as combinações emocionais e descubra como seus
          sentimentos se conectam.
        </p>
      </motion.div>

      <motion.div
        className="glass-panel p-4 sm:p-6 emotion-glow mb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <EmotionLayerMap />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-foreground/60 mb-4">
          Todas as combinações
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BLEND_DEFINITIONS.map((blend) => (
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
