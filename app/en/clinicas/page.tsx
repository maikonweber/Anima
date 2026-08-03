import type { Metadata } from "next";
import { ClinicsView } from "@/components/marketing/pages/ClinicsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "en" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "EmotiveCare Clinics — CRM, scheduling, teleconsult",
  description:
    "B2B product separate from the patient app: patient CRM, agenda, teleconsult, clinical notes, consents, reminders, care plans, and human-reviewed AI syntheses.",
  path: "/clinicas",
  locale: LOCALE,
  keywords: [
    "clinic software",
    "psychology CRM",
    "teleconsult scheduling",
    "clinical consent",
  ],
});

export default function ClinicsEnPage() {
  const dict = getDictionary(LOCALE);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(LOCALE, "/") },
          {
            name: dict.nav.clinics,
            path: localizedPath(LOCALE, "/clinicas"),
          },
        ])}
      />
      <ClinicsView locale={LOCALE} />
    </>
  );
}
