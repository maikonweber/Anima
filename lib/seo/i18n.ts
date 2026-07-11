import type { Locale } from "@/lib/i18n/config";
import {
  DEFAULT_LOCALE,
  LOCALES,
  htmlLang,
  isLocale,
  ogLocale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export {
  DEFAULT_LOCALE,
  LOCALES,
  htmlLang,
  isLocale,
  ogLocale,
};
export type { Locale };

export function blogPath(locale: Locale, slug?: string): string {
  const base = locale === "en" ? "/en/blog" : "/blog";
  return slug ? `${base}/${slug}` : base;
}

export function alternateBlogPath(locale: Locale, slug?: string): string {
  return blogPath(locale === "en" ? "pt-BR" : "en", slug);
}

export type BlogUiCopy = {
  tocLabel: string;
  inThisArticle: string;
  faq: string;
  conclusion: string;
  keepReading: string;
  backToArticles: string;
  crisisNote: string;
  languageLabel: string;
  indexTitle: string;
  indexIntro: string;
  notFoundTitle: string;
};

export function getBlogUi(locale: Locale): BlogUiCopy {
  return getDictionary(locale).blog;
}
