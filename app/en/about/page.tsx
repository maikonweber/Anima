import type { Metadata } from "next";
import { AboutView } from "@/components/marketing/pages/AboutView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "en" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "About EmotiveCare and SENTIO AI",
  description:
    "Learn about EmotiveCare’s mission, MutterCorp, and the SENTIO AI contextual engine for longitudinal emotional well-being.",
  path: "/about",
  locale: LOCALE,
  keywords: ["digital well-being", "MutterCorp", "company story"],
});

export default function EnAboutPage() {
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
