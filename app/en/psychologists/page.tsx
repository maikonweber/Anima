import type { Metadata } from "next";
import { PsychologistsView } from "@/components/marketing/pages/PsychologistsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "en" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Cuidado — dashboard for psychologists and psychiatrists between sessions",
  description:
    "Cuidado plan: psychologists and psychiatrists follow read-only emotional dashboards when patients invite them. For CRM, scheduling, teleconsult, and clinical AI, use EmotiveCare Clinics.",
  path: "/psychologists",
  locale: LOCALE,
  keywords: [
    "Cuidado plan",
    "dashboard for psychologists",
    "dashboard for psychiatrists",
    "between-session follow-up",
  ],
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
