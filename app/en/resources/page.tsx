import type { Metadata } from "next";
import { ResourcesView } from "@/components/marketing/pages/ResourcesView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "en" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Resources on emotional health and responsible AI",
  description:
    "EmotiveCare articles and guides on emotional journaling, burnout, anxiety, semantic memory, and responsible SENTIO AI use.",
  path: "/resources",
  locale: LOCALE,
  keywords: ["mental health resources", "self-care kits", "EmotiveCare blog"],
});

export default function EnResourcesPage() {
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
