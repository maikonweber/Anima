import type { Metadata } from "next";
import { FaqView } from "@/components/marketing/pages/FaqView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema, faqSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { getFaqEntries } from "@/lib/seo/faq";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "pt-BR" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "FAQ — segundo cérebro, Clínicas, psicólogos e psiquiatras",
  description:
    "Perguntas frequentes: EmotiveCare como segundo cérebro pessoal, plano Cuidado, EmotiveCare Clínicas, SENTIO AI, psicólogos, psiquiatras, consentimento e LGPD.",
  path: "/faq",
  locale: LOCALE,
  keywords: [
    "FAQ EmotiveCare",
    "segundo cérebro emocional FAQ",
    "Clínicas psicologia FAQ",
    "IA psiquiatras",
  ],
});

export default function FaqPage() {
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
