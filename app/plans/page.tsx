import type { Metadata } from "next";
import { PlansView } from "@/components/marketing/pages/PlansView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "pt-BR" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Planos — segundo cérebro pessoal, Cuidado e Clínicas",
  description:
    "Essencial e Pleno: EmotiveCare como segundo cérebro emocional pessoal (Pleno R$ 9,99/mês). Cuidado para psicólogos e psiquiatras no app. Operação completa em EmotiveCare Clínicas.",
  path: "/plans",
  locale: LOCALE,
  keywords: [
    "plano Pleno EmotiveCare",
    "segundo cérebro emocional preço",
    "plano Cuidado psicólogo",
    "planos clínica saúde mental",
  ],
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
