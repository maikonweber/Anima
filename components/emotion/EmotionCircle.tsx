"use client";

import { motion } from "motion/react";

interface EmotionCircleProps {
  color: string;
  label: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-24 h-24",
} as const;

export function EmotionCircle({
  color,
  label,
  size = "md",
  pulse = false,
  className = "",
}: EmotionCircleProps) {
  return (
    <motion.div
      className={`rounded-full ${SIZE_MAP[size]} ${pulse ? "animate-emotion-pulse" : ""} ${className}`}
      style={{
        backgroundColor: color,
        opacity: 0.75,
        boxShadow: `0 0 24px -4px ${color}60`,
      }}
      whileHover={{ scale: 1.1, opacity: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      aria-label={label}
      role="img"
    />
  );
}
