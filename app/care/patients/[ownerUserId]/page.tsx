"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ApiError } from "@/lib/api-client";
import {
  hasIntelligentReportContent,
  hasLongTermPatternContent,
  hasPreConsultContent,
} from "@/lib/care/normalize-shared-dashboard";
import { useSharedDashboard } from "@/hooks/use-care";
import { WeekSummaryChart } from "@/components/diary/WeekSummaryChart";
import { SharedDiaryList } from "@/components/care/SharedDiaryList";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { UpgradeBadge } from "@/components/subscription/UpgradeBadge";
import { useSubscription } from "@/providers/subscription-provider";

export default function SharedPatientDashboardPage({
  params,
}: {
  params: Promise<{ ownerUserId: string }>;
}) {
  const { ownerUserId } = use(params);
  const { canViewSharedDashboard } = useSubscription();
  const { data, isLoading, error, refetch } = useSharedDashboard(ownerUserId);
  const forbidden = error instanceof ApiError && error.status === 403;
  const paymentRequired =
    error instanceof ApiError && error.status === 402;

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

      {!canViewSharedDashboard && !isLoading && !error && (
        <div className="glass-panel p-6 text-center">
          <p className="text-sm text-foreground/50 mb-4">
            Visualizar dashboards de pacientes requer o plano Cuidado.
          </p>
          <UpgradeBadge planName="Cuidado" href="/assinatura?plan=cuidado" />
        </div>
      )}

      {error && (
        <div className="glass-panel p-6">
          <ErrorMessage
            message={
              paymentRequired && error.planLimit?.code === "PLAN_LIMIT_OWNER_SHARE"
                ? "O paciente precisa assinar o plano Pleno para compartilhar o dashboard."
                : forbidden
                  ? error.message
                  : paymentRequired
                    ? error.message
                    : "Não foi possível carregar o dashboard compartilhado."
            }
            onRetry={paymentRequired ? undefined : () => refetch()}
          />
          {paymentRequired && (
            <Link
              href="/assinatura?plan=cuidado"
              className="block mt-4 text-center text-sm text-anima-violet"
            >
              Ver plano Cuidado →
            </Link>
          )}
        </div>
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

          {data.alerts && data.alerts.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold text-foreground/70 mb-4">
                Alertas sutis
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {data.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="glass-panel p-5 border border-foreground/[0.08]"
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="text-sm font-semibold text-foreground/80">
                        {alert.title}
                      </p>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-[0.25em] px-2 py-1 rounded-full ${
                          alert.severity === "high"
                            ? "bg-rose-500/10 text-rose-500 border border-rose-500/15"
                            : alert.severity === "medium"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/15"
                            : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/15"
                        }`}
                      >
                        {alert.severity ?? "info"}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.therapyTimeline && data.therapyTimeline.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold text-foreground/70 mb-4">
                Timeline terapêutica
              </h2>
              <div className="glass-panel p-5">
                <ol className="space-y-4">
                  {data.therapyTimeline.map((event) => (
                    <li key={event.id} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-foreground/35">
                          {formatShortDate(event.date)}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">
                          Evento
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground/80">
                        {event.title}
                      </p>
                      <p className="text-sm text-foreground/60 leading-relaxed">
                        {event.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {hasLongTermPatternContent(data.longTermPatterns) && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold text-foreground/70 mb-4">
                Padrões de longo prazo
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {data.longTermPatterns!.map((pattern) => (
                  <div key={pattern.id} className="glass-panel p-5">
                    <p className="text-sm font-semibold text-foreground/80 mb-2">
                      {pattern.title}
                    </p>
                    {pattern.theme && (
                      <p className="text-xs text-foreground/40 uppercase tracking-[0.2em] mb-3">
                        {pattern.theme}
                      </p>
                    )}
                    {pattern.description && (
                      <p className="text-sm text-foreground/60 leading-relaxed">
                        {pattern.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {(hasPreConsultContent(data.preConsultSummary) ||
            hasIntelligentReportContent(data.intelligentReport)) && (
            <section className="grid gap-4 lg:grid-cols-2 mb-10">
              {hasPreConsultContent(data.preConsultSummary) && (
                <div className="glass-panel p-5">
                  <h2 className="text-sm font-semibold text-foreground/70 mb-3">
                    Pré-consulta
                  </h2>
                  {data.preConsultSummary!.subtitle && (
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-3">
                      {data.preConsultSummary!.subtitle}
                    </p>
                  )}
                  <ul className="space-y-3">
                    {data.preConsultSummary!.points.map((point, index) => (
                      <li key={index} className="text-sm text-foreground/60">
                        • {point}
                      </li>
                    ))}
                  </ul>
                  {data.preConsultSummary!.note && (
                    <p className="mt-4 text-sm text-foreground/50">
                      {data.preConsultSummary!.note}
                    </p>
                  )}
                </div>
              )}

              {hasIntelligentReportContent(data.intelligentReport) && (
                <div className="glass-panel p-5">
                  <h2 className="text-sm font-semibold text-foreground/70 mb-3">
                    Relatório inteligente
                  </h2>
                  {data.intelligentReport!.risks &&
                    data.intelligentReport!.risks.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-2">
                        Riscos e sinais
                      </p>
                      <ul className="space-y-2 text-sm text-foreground/60">
                        {data.intelligentReport!.risks.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.intelligentReport!.progressHighlights &&
                    data.intelligentReport!.progressHighlights.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-2">
                        Progresso
                      </p>
                      <ul className="space-y-2 text-sm text-foreground/60">
                        {data.intelligentReport!.progressHighlights.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.intelligentReport!.recommendations &&
                    data.intelligentReport!.recommendations.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-2">
                        Recomendações suaves
                      </p>
                      <ul className="space-y-2 text-sm text-foreground/60">
                        {data.intelligentReport!.recommendations.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.intelligentReport!.patternsDetected &&
                    data.intelligentReport!.patternsDetected.length > 0 && (
                    <div className="text-sm text-foreground/60">
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-2">
                        Padrões detectados</p>
                      <ul className="space-y-2">
                        {data.intelligentReport!.patternsDetected.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

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

function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
