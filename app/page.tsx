import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";
import { DEFAULT_SITE_KEYWORDS, OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title:
    "Segundo cérebro emocional e Clínicas para psicólogos e psiquiatras",
  description:
    "EmotiveCare para uso pessoal: segundo cérebro emocional com SENTIO AI, diário e memória semântica. EmotiveCare Clínicas: CRM, agenda, teleconsulta, prontuário e IA clínica revisável para psicólogos e psiquiatras. Comece grátis.",
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: {
      "pt-BR": `${SITE_URL}/`,
      en: `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/`,
    },
  },
  keywords: [
    ...DEFAULT_SITE_KEYWORDS,
    "segundo cérebro pessoal",
    "funcionalidades clínicas IA",
    "software psicologia",
    "software psiquiatria",
  ],
  openGraph: {
    url: SITE_URL,
    title:
      "EmotiveCare — segundo cérebro emocional · Clínicas com IA para saúde mental",
    description:
      "App pessoal que lembra por significado. Clínicas com CRM, teleconsulta e sínteses de IA para psicólogos e psiquiatras.",
    images: [
      {
        url: `${SITE_URL}${OG_IMAGE_PATH}`,
        width: 1200,
        height: 630,
        alt: "EmotiveCare — segundo cérebro e Clínicas",
      },
    ],
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "EmotiveCare — segundo cérebro emocional e Clínicas",
    description:
      "Uso pessoal como segundo cérebro; funcionalidades clínicas e IA para psicólogos e psiquiatras.",
  },
};

export default function Home() {
  return <HomePage locale="pt-BR" />;
}
