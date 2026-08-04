import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { TermsView } from "@/components/terms/TermsView";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const COPY: Record<
  Locale,
  { title: string; description: string; keywords: string[] }
> = {
  "pt-BR": {
    title: "Termos de uso institucional",
    description:
      "Termos institucionais resumindo limites de uso clínico, responsabilidades do usuário e da empresa MutterCorp pela EmotiveCare.",
    keywords: ["termos de uso", "responsabilidade"],
  },
  en: {
    title: "Institutional terms of use",
    description:
      "Institutional terms summarizing clinical-use limits and user and MutterCorp responsibilities for EmotiveCare.",
    keywords: ["terms of use", "responsibility"],
  },
  es: {
    title: "Términos de uso institucionales",
    description:
      "Términos institucionales que resumen los límites de uso clínico y las responsabilidades del usuario y de MutterCorp por EmotiveCare.",
    keywords: ["términos de uso", "responsabilidad"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  return buildMarketingMetadata({
    title: copy.title,
    description: copy.description,
    path: "/terms",
    locale,
    keywords: copy.keywords,
  });
}

export default async function TermsPage() {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(locale, "/") },
          { name: dict.footer.terms, path: localizedPath(locale, "/terms") },
        ])}
      />
      <MarketingChrome locale={locale}>
        <TermsView locale={locale} />
      </MarketingChrome>
    </>
  );
}
