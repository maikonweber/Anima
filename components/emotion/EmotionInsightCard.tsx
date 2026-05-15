"use client";

import { motion } from "motion/react";

interface EmotionInsightCardProps {
  insight: string;
  className?: string;
}

export function EmotionInsightCard({
  insight,
  className = "",
}: EmotionInsightCardProps) {
  return (
    <motion.div
      className={`glass-panel p-5 ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">
          💡
        </span>
        <div>
          <h4 className="text-sm font-semibold text-foreground/80 mb-1">
            Reflexão
          </h4>
          <p className="text-sm leading-relaxed text-foreground/60 italic">
            {insight}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
