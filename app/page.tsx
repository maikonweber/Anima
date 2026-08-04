import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { localizedPath, ogLocale } from "@/lib/i18n/config";
import { DEFAULT_SITE_KEYWORDS, OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = `${SITE_URL}${localizedPath(locale, "/")}`;

  return {
    title:
      locale === "en"
        ? "Emotional second brain and Clinics for psychologists and psychiatrists"
        : locale === "es"
          ? "Segundo cerebro emocional y Clínicas para psicólogos y psiquiatras"
          : "Segundo cérebro emocional e Clínicas para psicólogos e psiquiatras",
    description:
      "EmotiveCare: segundo cérebro emocional com SENTIO AI. EmotiveCare Clínicas: CRM, agenda, teleconsulta e IA clínica revisável.",
    alternates: {
      canonical,
      languages: {
        "pt-BR": `${SITE_URL}/`,
        en: `${SITE_URL}/en`,
        es: `${SITE_URL}/es`,
        "x-default": `${SITE_URL}/`,
      },
    },
    keywords: [
      ...DEFAULT_SITE_KEYWORDS,
      "segundo cérebro pessoal",
      "software psicologia",
    ],
    openGraph: {
      url: canonical,
      locale: ogLocale(locale),
      alternateLocale: ["pt_BR", "en_US", "es_ES"].filter(
        (l) => l !== ogLocale(locale),
      ),
      images: [
        {
          url: `${SITE_URL}${OG_IMAGE_PATH}`,
          width: 1200,
          height: 630,
          alt: "EmotiveCare",
        },
      ],
      type: "website",
    },
  };
}

export default async function Home() {
  const locale = await getRequestLocale();
  return <HomePage locale={locale} />;
}
