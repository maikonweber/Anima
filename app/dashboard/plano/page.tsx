"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Select } from "@/components/ui/Select";
import { useMyCarePlan } from "@/hooks/use-care-plans";
import { useMyOrganizations } from "@/hooks/use-organizations";
import { useLocale } from "@/lib/i18n/locale-provider";
import { getProductDictionary } from "@/lib/i18n/product-dictionary";
import { ApiError } from "@anima/shared";

export default function PatientCarePlanPage() {
  const { locale } = useLocale();
  const t = getProductDictionary(locale);
  const {
    data: orgs,
    isLoading: orgsLoading,
    error: orgsError,
    refetch: refetchOrgs,
  } = useMyOrganizations();

  const patientOrgs = useMemo(
    () => (orgs ?? []).filter((item) => item.membership.role === "PATIENT"),
    [orgs],
  );

  const [orgId, setOrgId] = useState("");

  useEffect(() => {
    if (!orgId && patientOrgs.length > 0) {
      setOrgId(patientOrgs[0].organization.id);
    }
  }, [orgId, patientOrgs]);

  const { data, isLoading, error, refetch } = useMyCarePlan(orgId);

  if (orgsLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="h-40 rounded-2xl bg-foreground/[0.06] animate-pulse" />
      </div>
    );
  }

  if (orgsError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ErrorMessage
          message="Não foi possível carregar suas clínicas."
          onRetry={() => refetchOrgs()}
        />
      </div>
    );
  }

  if (patientOrgs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-foreground/90 mb-2">
          {t.pages.carePlanTitle}
        </h1>
        <p className="text-sm text-foreground/45">
          Você precisa estar vinculado a uma clínica como paciente.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          {t.pages.carePlanTitle}
        </h1>
        <p className="text-sm text-foreground/40 mb-6">
          Atividades e orientações liberadas pelo seu profissional
        </p>

        <div className="mb-6">
          <Select
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            aria-label="Clínica"
          >
            {patientOrgs.map((item) => (
              <option key={item.organization.id} value={item.organization.id}>
                {item.organization.name}
              </option>
            ))}
          </Select>
        </div>

        {error && (
          <ErrorMessage
            message={
              error instanceof ApiError
                ? error.message
                : "Não foi possível carregar o plano."
            }
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="h-40 rounded-2xl bg-foreground/[0.06] animate-pulse" />
        )}

        {!isLoading && !error && (
          <div className="space-y-6">
            {!data?.plan ? (
              <div className="glass-panel p-8 text-center text-sm text-foreground/45">
                Ainda não há um plano ativo liberado para você.
              </div>
            ) : (
              <>
                <div className="glass-panel p-5">
                  <p className="text-sm font-medium text-foreground/80">
                    {data.plan.title}
                  </p>
                  {data.plan.summary && (
                    <p className="text-xs text-foreground/50 mt-2 leading-relaxed">
                      {data.plan.summary}
                    </p>
                  )}
                </div>

                <section>
                  <h2 className="text-sm font-semibold text-foreground/60 mb-3">
                    Atividades e orientações
                  </h2>
                  {data.items.length === 0 ? (
                    <p className="text-xs text-foreground/40">
                      Nenhum item liberado ainda.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {data.items.map((item) => (
                        <li key={item.id} className="glass-panel p-4">
                          <p className="text-sm text-foreground/80">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-xs text-foreground/45 mt-1">
                              {item.description}
                            </p>
                          )}
                          <p className="text-[11px] text-foreground/35 mt-2">
                            {item.kind} · {item.status}
                            {item.dueOn ? ` · até ${item.dueOn}` : ""}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            )}

            <section>
              <h2 className="text-sm font-semibold text-foreground/60 mb-3">
                Próximas sessões
              </h2>
              {(data?.upcomingSessions ?? []).length === 0 ? (
                <p className="text-xs text-foreground/40">
                  Nenhuma sessão agendada nos próximos 30 dias.
                </p>
              ) : (
                <ul className="space-y-2">
                  {(data?.upcomingSessions ?? []).map((session) => (
                    <li
                      key={session.id}
                      className="glass-panel p-3 flex justify-between gap-3 text-sm"
                    >
                      <span className="text-foreground/70">
                        {new Date(session.startsAt).toLocaleString("pt-BR")}
                      </span>
                      <span className="text-xs text-foreground/40">
                        {session.modality} · {session.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </motion.div>
    </div>
  );
}
