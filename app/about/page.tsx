import type { Metadata } from "next";
import { AboutView } from "@/components/marketing/pages/AboutView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "pt-BR" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Sobre — segundo cérebro emocional e Clínicas com IA",
  description:
    "A EmotiveCare (MutterCorp) une segundo cérebro emocional pessoal com SENTIO AI e EmotiveCare Clínicas para psicólogos e psiquiatras: CRM, teleconsulta e IA clínica revisável.",
  path: "/about",
  locale: LOCALE,
  keywords: [
    "MutterCorp EmotiveCare",
    "SENTIO AI",
    "segundo cérebro emocional",
    "IA para psicólogos",
  ],
});

export default function AboutPage() {
  const dict = getDictionary(LOCALE);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(LOCALE, "/") },
          { name: dict.nav.about, path: localizedPath(LOCALE, "/about") },
        ])}
      />
      <AboutView locale={LOCALE} />
    </>
  );
}
