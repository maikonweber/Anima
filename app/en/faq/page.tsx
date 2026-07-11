import type { Metadata } from "next";
import { FaqView } from "@/components/marketing/pages/FaqView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema, faqSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { getFaqEntries } from "@/lib/seo/faq";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "en" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "FAQ — EmotiveCare and SENTIO AI",
  description:
    "Clear answers on emotional follow-up, sharing with psychologists, privacy, and responsible use of SENTIO AI.",
  path: "/faq",
  locale: LOCALE,
  keywords: ["frequently asked questions"],
});

export default function EnFaqPage() {
  const dict = getDictionary(LOCALE);
  const entries = getFaqEntries(LOCALE);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: dict.common.home, path: localizedPath(LOCALE, "/") },
            { name: dict.nav.faq, path: localizedPath(LOCALE, "/faq") },
          ]),
          faqSchema(entries),
        ]}
      />
      <FaqView locale={LOCALE} />
    </>
  );
}
