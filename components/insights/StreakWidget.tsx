"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useStreak } from "@/hooks/use-insights";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { StreakAlertType } from "@/types/insights";

const ALERT_TONE: Record<
  StreakAlertType,
  { ring: string; text: string; dot: string }
> = {
  PARABENS: {
    ring: "border-emerald-400/25 bg-emerald-500/[0.07]",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  MANTER_STREAK: {
    ring: "border-anima-violet/25 bg-anima-violet/[0.07]",
    text: "text-anima-violet",
    dot: "bg-anima-violet",
  },
  RETOMAR: {
    ring: "border-amber-400/30 bg-amber-500/[0.08]",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  COMECAR: {
    ring: "border-anima-lilac/30 bg-anima-lilac/[0.08]",
    text: "text-anima-violet dark:text-anima-lilac",
    dot: "bg-anima-lilac",
  },
};

function pluralDias(n: number) {
  return n === 1 ? "dia" : "dias";
}

export function StreakWidget() {
  const reduce = useReducedMotion() ?? false;
  const { data, isLoading, error, refetch } = useStreak();

  if (isLoading) {
    return (
      <div className="h-28 rounded-2xl bg-foreground/[0.06] animate-pulse" />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message="Não foi possível carregar sua sequência."
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) return null;

  const { streakAtual, maiorStreak, registrosNoMes, alerta } = data;
  const tone = ALERT_TONE[alerta.tipo];
  const showCta = alerta.tipo !== "PARABENS";

  return (
    <motion.section
      aria-label="Sua sequência de registros"
      className="glass-panel p-5 sm:p-6"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.5 }}
    >
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 via-rose-400/15 to-anima-violet/20 ring-1 ring-amber-300/25 dark:ring-amber-500/20">
          <FlameIcon animated={!reduce && data.registrouHoje} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold leading-none text-foreground/90 tabular-nums sm:text-4xl">
              {streakAtual}
            </span>
            <span className="pb-0.5 text-sm text-foreground/45">
              {pluralDias(streakAtual)} seguidos
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-foreground/45 sm:text-xs">
            <span>
              Recorde:{" "}
              <strong className="font-semibold text-foreground/70 tabular-nums">
                {maiorStreak}
              </strong>{" "}
              {pluralDias(maiorStreak)}
            </span>
            <span>
              Este mês:{" "}
              <strong className="font-semibold text-foreground/70 tabular-nums">
                {registrosNoMes}
              </strong>
            </span>
          </div>
        </div>
      </div>

      <div
        className={`mt-4 flex flex-col gap-3 rounded-xl border px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between ${tone.ring}`}
        role="status"
      >
        <p className={`flex items-start gap-2 text-sm leading-snug ${tone.text}`}>
          <span
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`}
            aria-hidden
          />
          {alerta.mensagem}
        </p>
        {showCta && (
          <Link
            href="/diary/new"
            className="shrink-0 self-start rounded-full px-4 py-2 text-center text-xs font-semibold text-white transition-all hover:shadow-lg hover:shadow-[var(--anima-glow)] sm:self-auto"
            style={{
              background:
                "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
            }}
          >
            Registrar agora
          </Link>
        )}
      </div>
    </motion.section>
  );
}

function FlameIcon({ animated }: { animated: boolean }) {
  return (
    <motion.svg
      className="h-8 w-8 text-amber-500 dark:text-amber-400"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      animate={animated ? { scale: [1, 1.08, 1] } : undefined}
      transition={
        animated
          ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    >
      <path d="M12 2c.5 3-1.5 4.5-3 6.5C7.5 10.5 6.5 12 6.5 14a5.5 5.5 0 0 0 11 0c0-2-1-3.8-2.3-5.2-.4 1-1.1 1.7-2 2 .5-2.2-.3-4.8-1.2-6.8Zm0 17a3 3 0 0 1-3-3c0-1.2.7-2.2 1.5-3 .1 1 .8 1.7 1.6 2 .8-.3 1.2-1 1.3-2 .7.8 1.1 1.8 1.1 3a3 3 0 0 1-2.5 3Z" />
    </motion.svg>
  );
}
