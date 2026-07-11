import type { Metadata } from "next";
import { PrivacyView } from "@/components/marketing/pages/PrivacyView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "pt-BR" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Privacidade e tratamento de dados",
  description:
    "Visão institucional do compromisso com privacidade, consentimento para compartilhamento entre pacientes e profissionais, e papel da SENTIO AI.",
  path: "/privacy",
  locale: LOCALE,
  keywords: ["privacidade", "LGPD", "HIPAA mindset"],
});

export default function PrivacyPage() {
  const dict = getDictionary(LOCALE);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(LOCALE, "/") },
          { name: dict.footer.privacy, path: localizedPath(LOCALE, "/privacy") },
        ])}
      />
      <PrivacyView locale={LOCALE} />
    </>
  );
}
