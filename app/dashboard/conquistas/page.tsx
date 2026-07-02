"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAchievements } from "@/hooks/use-insights";
import { AchievementsGrid } from "@/components/insights/AchievementsGrid";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function AchievementsPage() {
  const reduce = useReducedMotion() ?? false;
  const { data, isLoading, error, refetch } = useAchievements();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        className="mb-6"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.5 }}
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
              Conquistas
            </h1>
            <p className="text-sm text-foreground/40">
              Marcos da sua jornada de autocuidado
            </p>
          </div>
          {data && (
            <span className="rounded-full border border-anima-violet/20 bg-anima-violet/[0.06] px-3 py-1.5 text-sm font-medium text-anima-violet tabular-nums">
              {data.resumo.desbloqueadas}/{data.resumo.total} desbloqueadas
            </span>
          )}
        </div>
      </motion.div>

      {error && (
        <ErrorMessage
          message="Não foi possível carregar suas conquistas."
          onRetry={() => refetch()}
        />
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-foreground/[0.06] animate-pulse"
            />
          ))}
        </div>
      )}

      {data && !isLoading && !error && (
        data.achievements.length === 0 ? (
          <div className="glass-panel p-10 text-center">
            <p className="text-sm text-foreground/50">
              Suas conquistas aparecerão aqui conforme você registra momentos.
            </p>
          </div>
        ) : (
          <AchievementsGrid achievements={data.achievements} />
        )
      )}
    </div>
  );
}
