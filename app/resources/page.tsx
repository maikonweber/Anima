import type { Metadata } from "next";
import { ResourcesView } from "@/components/marketing/pages/ResourcesView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "pt-BR" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Recursos sobre saúde emocional e IA responsável",
  description:
    "Artigos e guias da EmotiveCare sobre diário emocional, burnout, ansiedade, memória semântica e uso responsável da SENTIO AI.",
  path: "/resources",
  locale: LOCALE,
  keywords: ["recursos de saúde mental", "kits de autocuidado", "blog EmotiveCare"],
});

export default function ResourcesPage() {
  const dict = getDictionary(LOCALE);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(LOCALE, "/") },
          { name: dict.footer.resources, path: localizedPath(LOCALE, "/resources") },
        ])}
      />
      <ResourcesView locale={LOCALE} />
    </>
  );
}
