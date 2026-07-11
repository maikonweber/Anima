import type { Metadata } from "next";
import { PlansView } from "@/components/marketing/pages/PlansView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "pt-BR" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Planos para acompanhamento emocional inteligente",
  description:
    "Compare os planos Essencial, Pleno e Cuidado da EmotiveCare: volume de registros, insights SENTIO AI, histórico e compartilhamento com profissionais.",
  path: "/plans",
  locale: LOCALE,
  keywords: ["planos", "pricing saúde emocional", "benefícios digitais"],
});

export default function PlansPage() {
  const dict = getDictionary(LOCALE);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(LOCALE, "/") },
          { name: dict.nav.plans, path: localizedPath(LOCALE, "/plans") },
        ])}
      />
      <PlansView locale={LOCALE} />
    </>
  );
}
