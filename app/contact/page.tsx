import type { Metadata } from "next";
import { ContactView } from "@/components/marketing/pages/ContactView";
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
    title: "Contato com o time da EmotiveCare",
    description:
      "Canais oficiais de contato MutterCorp e EmotiveCare para suporte, parcerias e imprensa.",
    keywords: ["contato", "suporte EmotiveCare"],
  },
  en: {
    title: "Contact the EmotiveCare team",
    description:
      "Official MutterCorp and EmotiveCare contact channels for support, partnerships, and press.",
    keywords: ["contact", "EmotiveCare support"],
  },
  es: {
    title: "Contacto con el equipo de EmotiveCare",
    description:
      "Canales oficiales de contacto de MutterCorp y EmotiveCare para soporte, alianzas y prensa.",
    keywords: ["contacto", "soporte EmotiveCare"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  return buildMarketingMetadata({
    title: copy.title,
    description: copy.description,
    path: "/contact",
    locale,
    keywords: copy.keywords,
  });
}

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(locale, "/") },
          { name: dict.nav.contact, path: localizedPath(locale, "/contact") },
        ])}
      />
      <ContactView locale={locale} />
    </>
  );
}
