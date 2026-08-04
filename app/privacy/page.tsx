import type { Metadata } from "next";
import { PrivacyView } from "@/components/marketing/pages/PrivacyView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const COPY: Record<
  Locale,
  { title: string; description: string; keywords: string[] }
> = {
  "pt-BR": {
    title: "Privacidade e tratamento de dados",
    description:
      "Visão institucional do compromisso com privacidade, consentimento para compartilhamento entre pacientes e profissionais, e papel da SENTIO AI.",
    keywords: ["privacidade", "LGPD", "HIPAA mindset"],
  },
  en: {
    title: "Privacy and data handling",
    description:
      "Our institutional commitment to privacy, consent for patient–professional sharing, and the role of SENTIO AI.",
    keywords: ["privacy", "LGPD", "HIPAA mindset"],
  },
  es: {
    title: "Privacidad y tratamiento de datos",
    description:
      "Compromiso institucional con la privacidad, el consentimiento para compartir entre pacientes y profesionales, y el rol de SENTIO AI.",
    keywords: ["privacidad", "LGPD", "mentalidad HIPAA"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  return buildMarketingMetadata({
    title: copy.title,
    description: copy.description,
    path: "/privacy",
    locale,
    keywords: copy.keywords,
  });
}

export default async function PrivacyPage() {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(locale, "/") },
          { name: dict.footer.privacy, path: localizedPath(locale, "/privacy") },
        ])}
      />
      <PrivacyView locale={locale} />
    </>
  );
}
