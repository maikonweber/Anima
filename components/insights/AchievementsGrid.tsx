"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Achievement } from "@/types/insights";

export function AchievementsGrid({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const reduce = useReducedMotion() ?? false;

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {achievements.map((a, i) => (
        <motion.li
          key={a.codigo}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.35,
            delay: reduce ? 0 : Math.min(i * 0.04, 0.4),
          }}
        >
          <AchievementCard achievement={a} />
        </motion.li>
      ))}
    </ul>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const { titulo, descricao, desbloqueado, progresso } = achievement;
  const pct = Math.max(0, Math.min(100, progresso.percentual));

  return (
    <div
      className={`h-full rounded-2xl border p-4 transition-colors ${
        desbloqueado
          ? "border-anima-violet/25 bg-gradient-to-br from-anima-violet/[0.08] to-anima-lilac/[0.05]"
          : "border-foreground/[0.07] bg-foreground/[0.02]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            desbloqueado
              ? "bg-anima-violet/15 text-anima-violet"
              : "bg-foreground/[0.05] text-foreground/30"
          }`}
          aria-hidden
        >
          {desbloqueado ? <TrophyIcon /> : <LockIcon />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm font-semibold ${
                desbloqueado ? "text-foreground/85" : "text-foreground/55"
              }`}
            >
              {titulo}
            </h3>
            {desbloqueado && (
              <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                Concluída
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs leading-snug text-foreground/45">
            {descricao}
          </p>
        </div>
      </div>

      {!desbloqueado && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-foreground/40">
            <span>Progresso</span>
            <span className="tabular-nums">
              {progresso.atual}/{progresso.meta}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-foreground/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-anima-violet to-anima-lilac transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 21h8m-4-4v4m-5-17h10v3a5 5 0 0 1-10 0V4Zm10 1h2.5a1.5 1.5 0 0 1 0 5H17m-10 0H4.5a1.5 1.5 0 0 1 0-5H7"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 10V8a6 6 0 1 1 12 0v2m-13 0h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}
