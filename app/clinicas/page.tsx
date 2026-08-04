import type { Metadata } from "next";
import { ClinicsView } from "@/components/marketing/pages/ClinicsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "pt-BR" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title:
    "Clínicas — CRM, teleconsulta e IA para psicólogos e psiquiatras",
  description:
    "EmotiveCare Clínicas: funcionalidades clínicas com IA revisável — CRM, agenda, teleconsulta, prontuário, consentimentos, lembretes, plano de cuidado e sínteses SENTIO AI. Feito para psicólogos, psiquiatras e equipes.",
  path: "/clinicas",
  locale: LOCALE,
  keywords: [
    "EmotiveCare Clínicas",
    "software para psicólogos",
    "software para psiquiatras",
    "CRM clínica psicologia",
    "IA clínica saúde mental",
    "teleconsulta psiquiatria",
    "prontuário eletrônico psicologia",
    "síntese clínica IA",
  ],
});

export default function ClinicasPage() {
  const dict = getDictionary(LOCALE);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(LOCALE, "/") },
          {
            name: dict.nav.clinics,
            path: localizedPath(LOCALE, "/clinicas"),
          },
        ])}
      />
      <ClinicsView locale={LOCALE} />
    </>
  );
}
