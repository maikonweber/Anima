import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";
import { DEFAULT_SITE_KEYWORDS, OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "EmotiveCare — pessoas, Cuidado e Clínicas",
  description:
    "Segundo cérebro emocional no app (Essencial/Pleno), plano Cuidado entre sessões e EmotiveCare Clínicas para CRM, agenda e teleconsulta. Comece grátis.",
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
    "emotivecare clínicas",
    "segundo cérebro emocional",
    "plano pleno",
    "plano cuidado",
    "teleconsulta clínica",
  ],
  openGraph: {
    url: SITE_URL,
    title: "EmotiveCare — memória emocional e operação clínica",
    description:
      "App da pessoa com SENTIO AI, plano Cuidado para profissionais e EmotiveCare Clínicas para a operação da clínica.",
    images: [
      {
        url: `${SITE_URL}${OG_IMAGE_PATH}`,
        width: 1200,
        height: 630,
        alt: "EmotiveCare — pessoas e clínicas",
      },
    ],
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "EmotiveCare — pessoas, Cuidado e Clínicas",
    description:
      "Segundo cérebro emocional, acompanhamento entre sessões e suíte B2B para clínicas.",
  },
};

export default function Home() {
  return <HomePage locale="pt-BR" />;
}
