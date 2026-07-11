import type { Metadata } from "next";
import { PlansView } from "@/components/marketing/pages/PlansView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "en" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Plans for intelligent emotional follow-up",
  description:
    "Compare EmotiveCare Essential, Full, and Care plans: diary volume, SENTIO AI insights, history, and sharing with professionals.",
  path: "/plans",
  locale: LOCALE,
  keywords: ["plans", "emotional health pricing", "digital benefits"],
});

export default function EnPlansPage() {
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
