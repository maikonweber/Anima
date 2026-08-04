import type { Metadata } from "next";
import { AboutView } from "@/components/marketing/pages/AboutView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const COPY: Record<
  Locale,
  { title: string; description: string; keywords: string[] }
> = {
  "pt-BR": {
    title: "Sobre — segundo cérebro emocional e Clínicas com IA",
    description:
      "A EmotiveCare (MutterCorp) une segundo cérebro emocional pessoal com SENTIO AI e EmotiveCare Clínicas para psicólogos e psiquiatras: CRM, teleconsulta e IA clínica revisável.",
    keywords: [
      "MutterCorp EmotiveCare",
      "SENTIO AI",
      "segundo cérebro emocional",
      "IA para psicólogos",
    ],
  },
  en: {
    title: "About EmotiveCare and SENTIO AI",
    description:
      "Learn about EmotiveCare’s mission, MutterCorp, and the SENTIO AI contextual engine for longitudinal emotional well-being.",
    keywords: ["digital well-being", "MutterCorp", "company story"],
  },
  es: {
    title: "Acerca de EmotiveCare y SENTIO AI",
    description:
      "Conoce la misión de EmotiveCare, MutterCorp y el motor contextual SENTIO AI para el bienestar emocional longitudinal.",
    keywords: [
      "bienestar digital",
      "MutterCorp",
      "historia de la empresa",
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  return buildMarketingMetadata({
    title: copy.title,
    description: copy.description,
    path: "/about",
    locale,
    keywords: copy.keywords,
  });
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(locale, "/") },
          { name: dict.nav.about, path: localizedPath(locale, "/about") },
        ])}
      />
      <AboutView locale={locale} />
    </>
  );
}
