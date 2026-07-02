import type { Metadata } from "next";
import {
  DEFAULT_SITE_KEYWORDS,
  OG_IMAGE_PATH,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo/site";

const OG_IMAGE_ABSOLUTE = `${SITE_URL}${OG_IMAGE_PATH}`;
const BRAND = "EmotiveCare";

export interface MarketingMetadataInput {
  /** Título único da página (sem o sufixo da marca — o template global cuida disso). */
  title: string;
  description: string;
  /** Caminho relativo à raiz, ex.: "/about". */
  path: string;
  /** Palavras-chave específicas da página (somadas às padrão do site). */
  keywords?: string[];
  ogType?: "website" | "article";
}

/**
 * Gera metadata consistente para páginas públicas de marketing:
 * canônico absoluto, keywords combinadas e preview social (Open Graph + Twitter)
 * exclusivo por página — evitando que todas compartilhem o mesmo título social.
 */
export function buildMarketingMetadata({
  title,
  description,
  path,
  keywords = [],
  ogType = "website",
}: MarketingMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const socialTitle = `${title} · ${BRAND}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    keywords: [...DEFAULT_SITE_KEYWORDS, ...keywords],
    openGraph: {
      type: ogType,
      locale: "pt_BR",
      url: canonical,
      siteName: BRAND,
      title: socialTitle,
      description,
      images: [
        {
          url: OG_IMAGE_ABSOLUTE,
          width: 1200,
          height: 630,
          alt: `${BRAND} · SENTIO AI`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE_ABSOLUTE],
    },
  };
}
