import type { Metadata } from "next";
import { ClinicsView } from "@/components/marketing/pages/ClinicsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "pt-BR" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "EmotiveCare Clínicas — CRM, agenda e teleconsulta",
  description:
    "Produto B2B separado do app do paciente: CRM de pacientes, agenda, teleconsulta, prontuário, consentimentos, lembretes, plano de cuidado e sínteses revisáveis.",
  path: "/clinicas",
  locale: LOCALE,
  keywords: [
    "software para clínicas",
    "CRM psicológico",
    "agenda teleconsulta",
    "prontuário consentimento",
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
