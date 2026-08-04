"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CrisisResourcesList } from "@/components/crisis/CrisisResourcesList";
import { useCrisisResources } from "@/hooks/use-crisis-resources";
import { useMyOrganizations } from "@/hooks/use-organizations";
import { useLocale } from "@/lib/i18n/locale-provider";
import { getProductDictionary } from "@/lib/i18n/product-dictionary";

export default function PatientCrisisResourcesPage() {
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

  const resources = useCrisisResources(orgId, {}, !!orgId);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          {t.pages.crisisTitle}
        </h1>
        <p className="text-sm text-foreground/40 mb-6">
          Canais de apoio da sua clínica e redes públicas. Não é atendimento de
          emergência.
        </p>

        {orgsLoading && (
          <div className="h-24 rounded-2xl bg-foreground/[0.06] animate-pulse" />
        )}
        {orgsError && (
          <ErrorMessage
            message={
              orgsError instanceof Error
                ? orgsError.message
                : "Falha ao carregar clínicas."
            }
            onRetry={() => refetchOrgs()}
          />
        )}

        {!orgsLoading && patientOrgs.length === 0 && (
          <div className="glass-panel p-5 space-y-3">
            <p className="text-sm text-foreground/55">
              Você ainda não está vinculado a uma clínica. Enquanto isso, use os
              canais públicos:
            </p>
            <CrisisResourcesList
              disclaimer="Esta plataforma não é serviço de emergência. Em risco à vida, ligue 192 (SAMU) ou vá ao pronto-socorro."
              resources={[
                {
                  id: null,
                  title: "CVV — Centro de Valorização da Vida",
                  phone: "188",
                  url: "https://www.cvv.org.br/",
                  note: "Apoio emocional gratuito 24h.",
                  sortOrder: 0,
                  enabled: true,
                  source: "PLATFORM",
                },
                {
                  id: null,
                  title: "SAMU",
                  phone: "192",
                  url: null,
                  note: "Emergências médicas.",
                  sortOrder: 1,
                  enabled: true,
                  source: "PLATFORM",
                },
              ]}
            />
          </div>
        )}

        {patientOrgs.length > 1 && (
          <label className="block mb-4">
            <span className="text-xs text-foreground/40">Clínica</span>
            <select
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-foreground/[0.08] bg-transparent px-3 py-2 text-sm"
            >
              {patientOrgs.map((item) => (
                <option key={item.organization.id} value={item.organization.id}>
                  {item.organization.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {orgId && resources.isLoading && (
          <div className="h-28 rounded-2xl bg-foreground/[0.06] animate-pulse" />
        )}
        {orgId && resources.error && (
          <ErrorMessage
            message={
              resources.error instanceof Error
                ? resources.error.message
                : "Falha ao carregar recursos."
            }
            onRetry={() => resources.refetch()}
          />
        )}
        {orgId && resources.data && (
          <CrisisResourcesList
            disclaimer={resources.data.disclaimer}
            resources={resources.data.resources}
          />
        )}
      </motion.div>
    </div>
  );
}
