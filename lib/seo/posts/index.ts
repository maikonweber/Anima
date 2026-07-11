import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import type { BlogPost } from "./types";
import { legacyPosts } from "./legacy";
import { legacyPostsEn } from "./en/legacy";
import { post as psicologiaEInovacao } from "./psicologia-e-inovacao";
import { post as plataformaCompleta } from "./plataforma-completa-para-psicologos";
import { post as profissionalizarConsultorio } from "./como-profissionalizar-seu-consultorio";
import { post as tendencias2026 } from "./tendencias-da-psicologia-em-2026";
import { post as porQueEmotiveCare } from "./por-que-utilizar-a-emotivecare";
import { post as psicologiaEInovacaoEn } from "./en/psicologia-e-inovacao";
import { post as plataformaCompletaEn } from "./en/plataforma-completa-para-psicologos";
import { post as profissionalizarConsultorioEn } from "./en/como-profissionalizar-seu-consultorio";
import { post as tendencias2026En } from "./en/tendencias-da-psicologia-em-2026";
import { post as porQueEmotiveCareEn } from "./en/por-que-utilizar-a-emotivecare";

export type {
  BlogBlock,
  BlogCta,
  BlogFaqItem,
  BlogPost,
  BlogSection,
} from "./types";
export { postToc, sectionBlocks } from "./types";

const richPostsPt: BlogPost[] = [
  psicologiaEInovacao,
  plataformaCompleta,
  profissionalizarConsultorio,
  tendencias2026,
  porQueEmotiveCare,
];

const richPostsEn: BlogPost[] = [
  psicologiaEInovacaoEn,
  plataformaCompletaEn,
  profissionalizarConsultorioEn,
  tendencias2026En,
  porQueEmotiveCareEn,
];

/** Catálogo PT (default do site). Mantido como `blogPosts` para compat. */
export const blogPostsPt: BlogPost[] = [...legacyPosts, ...richPostsPt].map(
  (post) => ({ ...post, locale: post.locale ?? "pt-BR" }),
);

export const blogPostsEn: BlogPost[] = [
  ...legacyPostsEn,
  ...richPostsEn,
].map((post) => ({ ...post, locale: post.locale ?? "en" }));

/** Alias histórico = posts em português. */
export const blogPosts = blogPostsPt;

export function postLocale(post: BlogPost): Locale {
  return post.locale ?? DEFAULT_LOCALE;
}

export function getPostsByLocale(locale: Locale): BlogPost[] {
  return locale === "en" ? blogPostsEn : blogPostsPt;
}

export function getPostBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): BlogPost | undefined {
  return getPostsByLocale(locale).find((p) => p.slug === slug);
}

export function allBlogPosts(): BlogPost[] {
  return [...blogPostsPt, ...blogPostsEn];
}
