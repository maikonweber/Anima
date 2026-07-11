import type { Metadata } from "next";
import { PsychologistsView } from "@/components/marketing/pages/PsychologistsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "en" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Psychologists — emotional dashboard between sessions",
  description:
    "Intelligent emotional dashboards for therapeutic follow-up and patient progress — shared only with consent.",
  path: "/psychologists",
  locale: LOCALE,
  keywords: ["online psychologist", "pre-session", "longitudinal dashboard"],
});

export default function EnPsychologistsPage() {
  const dict = getDictionary(LOCALE);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(LOCALE, "/") },
          {
            name: dict.nav.psychologists,
            path: localizedPath(LOCALE, "/psychologists"),
          },
        ])}
      />
      <PsychologistsView locale={LOCALE} />
    </>
  );
}
