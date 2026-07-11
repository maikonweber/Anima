import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { TermsView } from "@/components/terms/TermsView";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "en" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Institutional terms of use",
  description:
    "Institutional terms summarizing clinical-use limits and user and MutterCorp responsibilities for EmotiveCare.",
  path: "/terms",
  locale: LOCALE,
  keywords: ["terms of use", "responsibility"],
});

export default function EnTermsPage() {
  const dict = getDictionary(LOCALE);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(LOCALE, "/") },
          { name: dict.footer.terms, path: localizedPath(LOCALE, "/terms") },
        ])}
      />
      <MarketingChrome locale={LOCALE}>
        <TermsView locale={LOCALE} />
      </MarketingChrome>
    </>
  );
}
