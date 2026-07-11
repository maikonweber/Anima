import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";
import { DEFAULT_SITE_KEYWORDS, OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Seu segundo cérebro emocional",
  description:
    "A EmotiveCare é um diário de energia emocional com IA que lembra por você: entende o que você sente, conecta seus padrões ao longo do tempo e devolve reflexões personalizadas. Comece grátis.",
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
    "segundo cérebro emocional",
    "diário emocional com IA",
    "diário de energia emocional",
    "memória emocional",
  ],
  openGraph: {
    url: SITE_URL,
    title: "EmotiveCare · Seu segundo cérebro emocional",
    description:
      "Um diário de energia emocional com IA que entende o que você escreve, conecta seus padrões e devolve reflexões feitas para a sua história. Ele sente com você e lembra por você.",
    images: [
      {
        url: `${SITE_URL}${OG_IMAGE_PATH}`,
        width: 1200,
        height: 630,
        alt: "EmotiveCare — seu segundo cérebro emocional",
      },
    ],
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "EmotiveCare · Seu segundo cérebro emocional",
    description:
      "Diário de energia emocional com IA que lembra por você e conecta seus padrões ao longo do tempo.",
  },
};

export default function Home() {
  return <HomePage locale="pt-BR" />;
}
