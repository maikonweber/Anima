import type { Metadata } from "next";
import { PsychologistsView } from "@/components/marketing/pages/PsychologistsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "pt-BR" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Psicólogos — dashboard emocional entre sessões",
  description:
    "Dashboard emocional inteligente para acompanhamento terapêutico e evolução emocional de pacientes — compartilhado apenas com consentimento.",
  path: "/psychologists",
  locale: LOCALE,
  keywords: ["psicólogo online", "pré-consulta", "dashboard longitudinal"],
});

export default function PsychologistsPage() {
  const dict = getDictionary(LOCALE);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(LOCALE, "/") },
          {
            name: dict.nav.psychologists,
            path: localizedPath(LOCALE, "/psychologists"),
          },
        ])}
      />
      <PsychologistsView locale={LOCALE} />
    </>
  );
}
