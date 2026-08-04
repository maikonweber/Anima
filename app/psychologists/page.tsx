import type { Metadata } from "next";
import { PsychologistsView } from "@/components/marketing/pages/PsychologistsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "pt-BR" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Cuidado — dashboard para psicólogos e psiquiatras entre sessões",
  description:
    "Plano Cuidado: psicólogos e psiquiatras acompanham dashboards emocionais em leitura quando o paciente convida. Para CRM, agenda, teleconsulta e IA clínica, use EmotiveCare Clínicas.",
  path: "/psychologists",
  locale: LOCALE,
  keywords: [
    "plano Cuidado",
    "dashboard para psicólogos",
    "dashboard para psiquiatras",
    "acompanhamento entre sessões",
    "psicólogo digital",
    "psiquiatra digital",
  ],
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
