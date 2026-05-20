"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ApiError } from "@/lib/api-client";
import { useSharedDashboard } from "@/hooks/use-care";
import { WeekSummaryChart } from "@/components/diary/WeekSummaryChart";
import { SharedDiaryList } from "@/components/care/SharedDiaryList";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function SharedPatientDashboardPage({
  params,
}: {
  params: Promise<{ ownerUserId: string }>;
}) {
  const { ownerUserId } = use(params);
  const { data, isLoading, error, refetch } = useSharedDashboard(ownerUserId);
  const forbidden = error instanceof ApiError && error.status === 403;

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href="/care/patients"
        className="text-sm text-anima-violet hover:text-anima-lilac transition-colors mb-6 inline-block"
      >
        ← Voltar para pacientes
      </Link>

      {isLoading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-8 w-48 rounded-lg bg-foreground/[0.06]" />
          <div className="h-24 rounded-2xl bg-foreground/[0.06]" />
          <div className="h-40 rounded-2xl bg-foreground/[0.06]" />
        </div>
      )}

      {error && (
        <ErrorMessage
          message={
            forbidden
              ? error.message
              : "Não foi possível carregar o dashboard compartilhado."
          }
          onRetry={() => refetch()}
        />
      )}

      {data && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <span className="inline-block text-[10px] font-medium px-2.5 py-1 rounded-full border bg-anima-violet/10 text-anima-violet border-anima-violet/25 mb-3">
              Visualização compartilhada
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
              Dashboard de {data.owner.nome}
            </h1>
            <p className="text-sm text-foreground/40">
              Resumo semanal e registros (somente leitura)
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-sm font-semibold text-foreground/70 mb-4">
              Resumo da semana
            </h2>
            {data.weekSummary.quantidadeRegistros === 0 ? (
              <div className="glass-panel p-8 text-center">
                <p className="text-sm text-foreground/50">
                  Sem registros nesta semana.
                </p>
              </div>
            ) : (
              <WeekSummaryChart summary={data.weekSummary} />
            )}
          </section>

          <section>
            <h2 className="text-sm font-semibold text-foreground/70 mb-4">
              Registros do diário
            </h2>
            <SharedDiaryList entries={data.diaryEntries} />
          </section>
        </motion.div>
      )}
    </div>
  );
}
