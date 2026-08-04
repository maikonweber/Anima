import type { Metadata } from "next";
import { FaqView } from "@/components/marketing/pages/FaqView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema, faqSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getFaqEntries } from "@/lib/seo/faq";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const COPY: Record<
  Locale,
  { title: string; description: string; keywords: string[] }
> = {
  "pt-BR": {
    title: "FAQ — segundo cérebro, Clínicas, psicólogos e psiquiatras",
    description:
      "Perguntas frequentes: EmotiveCare como segundo cérebro pessoal, plano Cuidado, EmotiveCare Clínicas, SENTIO AI, psicólogos, psiquiatras, consentimento e LGPD.",
    keywords: [
      "FAQ EmotiveCare",
      "segundo cérebro emocional FAQ",
      "Clínicas psicologia FAQ",
      "IA psiquiatras",
    ],
  },
  en: {
    title: "FAQ — EmotiveCare and SENTIO AI",
    description:
      "Clear answers on emotional follow-up, sharing with psychologists, privacy, and responsible use of SENTIO AI.",
    keywords: [
      "EmotiveCare FAQ",
      "emotional second brain FAQ",
      "psychology clinics FAQ",
    ],
  },
  es: {
    title: "FAQ — EmotiveCare y SENTIO AI",
    description:
      "Respuestas claras sobre seguimiento emocional, compartición con psicólogos, privacidad y uso responsable de SENTIO AI.",
    keywords: [
      "FAQ EmotiveCare",
      "segundo cerebro emocional FAQ",
      "clínicas de psicología FAQ",
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  return buildMarketingMetadata({
    title: copy.title,
    description: copy.description,
    path: "/faq",
    locale,
    keywords: copy.keywords,
  });
}

export default async function FaqPage() {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);
  const entries = getFaqEntries(locale);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: dict.common.home, path: localizedPath(locale, "/") },
            { name: dict.nav.faq, path: localizedPath(locale, "/faq") },
          ]),
          faqSchema(entries),
        ]}
      />
      <FaqView locale={locale} />
    </>
  );
}
