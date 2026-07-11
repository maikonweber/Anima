import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import {
  DEFAULT_LOCALE,
  alternatePath,
  htmlLang,
  localizedPath,
  ogLocale,
} from "@/lib/i18n/config";
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
  /** Caminho relativo sem prefixo de idioma, ex.: "/about". */
  path: string;
  locale?: Locale;
  /** Palavras-chave específicas da página (somadas às padrão do site). */
  keywords?: string[];
  ogType?: "website" | "article";
}

/**
 * Gera metadata consistente para páginas públicas de marketing:
 * canônico absoluto, hreflang PT↔EN, keywords e preview social.
 */
export function buildMarketingMetadata({
  title,
  description,
  path,
  locale = DEFAULT_LOCALE,
  keywords = [],
  ogType = "website",
}: MarketingMetadataInput): Metadata {
  const localized = localizedPath(locale, path);
  const canonical = absoluteUrl(localized);
  const socialTitle = `${title} · ${BRAND}`;
  const ptUrl = absoluteUrl(localizedPath("pt-BR", path));
  const enUrl = absoluteUrl(localizedPath("en", path));

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "pt-BR": ptUrl,
        en: enUrl,
        "x-default": ptUrl,
      },
    },
    robots: { index: true, follow: true },
    keywords: [...DEFAULT_SITE_KEYWORDS, ...keywords],
    openGraph: {
      type: ogType,
      locale: ogLocale(locale),
      alternateLocale: [locale === "en" ? "pt_BR" : "en_US"],
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
    other: {
      language: htmlLang(locale),
    },
  };
}

/** @deprecated use alternatePath from lib/i18n/config */
export function marketingAlternatePath(locale: Locale, path: string): string {
  return alternatePath(locale, path);
}
