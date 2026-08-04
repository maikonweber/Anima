import type { Metadata } from "next";
import { ClinicsView } from "@/components/marketing/pages/ClinicsView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "en" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Clinics — CRM, teleconsult, and AI for psychologists and psychiatrists",
  description:
    "EmotiveCare Clinics: clinical features with reviewable AI — patient CRM, scheduling, teleconsult, notes, consents, reminders, care plans, and SENTIO AI syntheses. Built for psychologists, psychiatrists, and care teams.",
  path: "/clinicas",
  locale: LOCALE,
  keywords: [
    "EmotiveCare Clinics",
    "software for psychologists",
    "software for psychiatrists",
    "psychology clinic CRM",
    "clinical AI mental health",
    "psychiatry teleconsult",
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
