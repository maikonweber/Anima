import type { Metadata } from "next";
import { ResourcesView } from "@/components/marketing/pages/ResourcesView";
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
    title: "Recursos sobre saúde emocional e IA responsável",
    description:
      "Artigos e guias da EmotiveCare sobre diário emocional, burnout, ansiedade, memória semântica e uso responsável da SENTIO AI.",
    keywords: ["recursos de saúde mental", "kits de autocuidado", "blog EmotiveCare"],
  },
  en: {
    title: "Resources on emotional health and responsible AI",
    description:
      "EmotiveCare articles and guides on emotional journaling, burnout, anxiety, semantic memory, and responsible SENTIO AI use.",
    keywords: ["mental health resources", "self-care kits", "EmotiveCare blog"],
  },
  es: {
    title: "Recursos sobre salud emocional e IA responsable",
    description:
      "Artículos y guías de EmotiveCare sobre diario emocional, burnout, ansiedad, memoria semántica y uso responsable de SENTIO AI.",
    keywords: ["recursos de salud mental", "kits de autocuidado", "blog EmotiveCare"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  return buildMarketingMetadata({
    title: copy.title,
    description: copy.description,
    path: "/resources",
    locale,
    keywords: copy.keywords,
  });
}

export default async function ResourcesPage() {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(locale, "/") },
          { name: dict.footer.resources, path: localizedPath(locale, "/resources") },
        ])}
      />
      <ResourcesView locale={locale} />
    </>
  );
}
