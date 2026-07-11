import type { Metadata } from "next";
import { AboutView } from "@/components/marketing/pages/AboutView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "pt-BR" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Sobre a EmotiveCare e a tecnologia SENTIO AI",
  description:
    "Conheça a missão por trás da EmotiveCare, da MutterCorp e do motor contextual SENTIO AI para bem-estar emocional longitudinal.",
  path: "/about",
  locale: LOCALE,
  keywords: ["bem-estar digital", "MutterCorp", "história da empresa"],
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
