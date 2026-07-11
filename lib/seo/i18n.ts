export const LOCALES = ["pt-BR", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt-BR";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

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

const blogUi: Record<Locale, BlogUiCopy> = {
  "pt-BR": {
    tocLabel: "Sumário do artigo",
    inThisArticle: "Neste artigo",
    faq: "Perguntas frequentes",
    conclusion: "Conclusão",
    keepReading: "Continue lendo",
    backToArticles: "Voltar aos artigos",
    crisisNote:
      "Se você enfrenta sofrimento persistente ou ideação de automutilação, procure imediatamente serviços de emergência e profissionais de saúde mental próximos a você.",
    languageLabel: "Idioma",
    indexTitle: "Blog EmotiveCare",
    indexIntro:
      "Materiais atualizados com foco em respostas diretas sobre autoconhecimento, burnout, ansiedade leve relatada pelo usuário e integração paciente-profissional.",
    notFoundTitle: "Artigo não encontrado",
  },
  en: {
    tocLabel: "Article outline",
    inThisArticle: "In this article",
    faq: "Frequently asked questions",
    conclusion: "Conclusion",
    keepReading: "Keep reading",
    backToArticles: "Back to articles",
    crisisNote:
      "If you are experiencing persistent distress or thoughts of self-harm, seek emergency services and mental health professionals near you immediately.",
    languageLabel: "Language",
    indexTitle: "EmotiveCare Blog",
    indexIntro:
      "Updated articles with direct answers on self-awareness, burnout, user-reported mild anxiety, and ethical patient–professional follow-up.",
    notFoundTitle: "Article not found",
  },
};

export function getBlogUi(locale: Locale): BlogUiCopy {
  return blogUi[locale];
}

export function ogLocale(locale: Locale): string {
  return locale === "en" ? "en_US" : "pt_BR";
}

export function htmlLang(locale: Locale): string {
  return locale === "en" ? "en" : "pt-BR";
}
