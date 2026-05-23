"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useAuth } from "@/providers/auth-provider";
import { useWeekSummary } from "@/hooks/use-diary";
import { WeekSummaryChart } from "@/components/diary/WeekSummaryChart";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";

export default function DashboardHome() {
  const { user } = useAuth();
  const { data: summary, isLoading, error, refetch } = useWeekSummary();
  const greeting = getGreeting();

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-10 blur-3xl animate-gentle-float"
          style={{ backgroundColor: "var(--anima-violet)" }}
        />
      </div>

      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          {greeting}, {user?.nome?.split(" ")[0]}
        </h1>
        <p className="text-sm text-foreground/40 mb-6">
          Seu panorama emocional desta semana
        </p>

        <Link
          href="/diary/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[var(--anima-glow)]"
          style={{
            background:
              "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
          }}
        >
          + Novo momento
        </Link>
      </motion.div>

      {error && (
        <div className="relative mb-6">
          <ErrorMessage
            message="Não foi possível carregar o resumo semanal."
            onRetry={() => refetch()}
          />
        </div>
      )}

      {isLoading && (
        <div className="relative space-y-3 animate-pulse">
          <div className="h-24 rounded-2xl bg-foreground/[0.06]" />
          <DashboardSkeletonExtra />
        </div>
      )}

      {summary && !isLoading && (
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <WeekSummaryChart summary={summary} />
        </motion.div>
      )}

      {!isLoading && !error && summary?.quantidadeRegistros === 0 && (
        <motion.div
          className="relative glass-panel p-8 text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm text-foreground/50 mb-4">
            Você ainda não registrou momentos esta semana. Como está se sentindo hoje?
          </p>
          <Link href="/diary/new">
            <Button>Registrar primeiro momento</Button>
          </Link>
        </motion.div>
      )}

      <motion.div
        className="relative mt-10 flex gap-3 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link
          href="/diary"
          className="text-sm text-anima-violet hover:text-anima-lilac transition-colors"
        >
          Ver linha do tempo completa →
        </Link>
      </motion.div>
    </div>
  );
}

function DashboardSkeletonExtra() {
  return (
    <>
      <div className="h-24 rounded-2xl bg-foreground/[0.06]" />
      <div className="h-40 rounded-2xl bg-foreground/[0.06]" />
    </>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}
