"use client";

import { motion } from "motion/react";
import { EmotionCircle } from "./EmotionCircle";
import { mixColors } from "@/lib/emotion/utils";

interface EmotionBlendProps {
  colorA: string;
  colorB: string;
  labelA: string;
  labelB: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

export function EmotionBlend({
  colorA,
  colorB,
  labelA,
  labelB,
  size = "md",
  pulse = false,
  className = "",
}: EmotionBlendProps) {
  const blendColor = mixColors(colorA, colorB);

  return (
    <motion.div
      className={`relative flex items-center ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      aria-label={`Combinação de ${labelA} e ${labelB}`}
    >
      <EmotionCircle color={colorA} label={labelA} size={size} pulse={pulse} />
      <div className="-ml-5 relative z-10">
        <EmotionCircle
          color={colorB}
          label={labelB}
          size={size}
          pulse={pulse}
        />
      </div>
      {/* Center blend glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "40%",
          height: "40%",
          left: "30%",
          top: "30%",
          backgroundColor: blendColor,
          opacity: 0.5,
          filter: "blur(8px)",
        }}
      />
    </motion.div>
  );
}
