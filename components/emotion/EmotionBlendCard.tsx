"use client";

import { motion } from "motion/react";
import { EmotionBlend } from "./EmotionBlend";
import { EmotionEnergyBar } from "./EmotionEnergyBar";
import { mixColors } from "@/lib/emotion/utils";

interface EmotionBlendCardProps {
  emotionA: { name: string; color: string };
  emotionB: { name: string; color: string };
  compositeName: string;
  description: string;
  energy: number;
  className?: string;
}

export function EmotionBlendCard({
  emotionA,
  emotionB,
  compositeName,
  description,
  energy,
  className = "",
}: EmotionBlendCardProps) {
  const blendColor = mixColors(emotionA.color, emotionB.color);

  return (
    <motion.div
      className={`glass-panel p-6 flex flex-col items-center gap-4 emotion-glow ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <EmotionBlend
        colorA={emotionA.color}
        colorB={emotionB.color}
        labelA={emotionA.name}
        labelB={emotionB.name}
        size="md"
      />

      <div className="text-center space-y-1">
        <div className="text-[10px] font-medium tracking-wide uppercase text-foreground/40">
          {emotionA.name} + {emotionB.name}
        </div>
        <h3 className="text-lg font-semibold text-foreground/90">
          {compositeName}
        </h3>
        <p className="text-sm leading-relaxed text-foreground/55 max-w-[240px]">
          {description}
        </p>
      </div>

      <EmotionEnergyBar
        energy={energy}
        color={blendColor}
        label="Energia emocional"
        className="w-full"
      />
    </motion.div>
  );
}
