"use client";

import { motion } from "motion/react";

interface EmotionEnergyBarProps {
  energy: number;
  color: string;
  label?: string;
  className?: string;
}

export function EmotionEnergyBar({
  energy,
  color,
  label,
  className = "",
}: EmotionEnergyBarProps) {
  const clamped = Math.max(0, Math.min(100, energy));

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-foreground/60">
            {label}
          </span>
          <span className="text-xs font-semibold tabular-nums text-foreground/80">
            {clamped}%
          </span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-foreground/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 12px ${color}40`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}
