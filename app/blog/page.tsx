import Link from "next/link";
import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { BlogLanguageSwitch } from "@/components/seo/BlogLanguageSwitch";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { blogPath, getBlogUi, htmlLang } from "@/lib/seo/i18n";
import { getPostsByLocale } from "@/lib/seo/posts";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";
import { SITE_URL } from "@/lib/seo/site";

const COPY: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  "pt-BR": {
    title: "Blog — bem-estar emocional assistido pela SENTIO AI",
    description:
      "Artigos sintéticos pensados para leitura humana e para motores semânticos: autoconhecimento, burnout e acompanhamento longitudinal ético.",
    keywords: ["blog saúde emocional", "IA contextual"],
  },
  en: {
    title: "Blog — emotional well-being with SENTIO AI",
    description:
      "Articles written for people and search engines: self-awareness, burnout, and ethical longitudinal follow-up.",
    keywords: ["emotional health blog", "contextual AI", "EmotiveCare", "SENTIO AI"],
  },
  es: {
    title: "Blog — bienestar emocional con SENTIO AI",
    description:
      "Artículos pensados para personas y motores de búsqueda: autoconocimiento, burnout y seguimiento longitudinal ético.",
    keywords: ["blog salud emocional", "IA contextual", "EmotiveCare", "SENTIO AI"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  const meta = buildMarketingMetadata({
    title: copy.title,
    description: copy.description,
    path: "/blog",
    locale,
    keywords: copy.keywords,
  });

  return {
    ...meta,
    alternates: {
      canonical: `${SITE_URL}${blogPath(locale)}`,
      languages: {
        "pt-BR": `${SITE_URL}${blogPath("pt-BR")}`,
        en: `${SITE_URL}${blogPath("en")}`,
        es: `${SITE_URL}${blogPath("es")}`,
        "x-default": `${SITE_URL}${blogPath("pt-BR")}`,
      },
    },
  };
}

export default async function BlogIndexPage() {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);
  const ui = getBlogUi(locale);
  const posts = getPostsByLocale(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(locale, "/") },
          { name: "Blog", path: blogPath(locale) },
        ])}
      />
      <MarketingChrome locale={locale}>
        <article lang={htmlLang(locale)}>
          <BlogLanguageSwitch locale={locale} />
          <h1 className="text-3xl font-bold text-foreground/90 mb-6">
            {ui.indexTitle}
          </h1>
          <p className="text-sm text-foreground/55 mb-10 leading-relaxed">
            {ui.indexIntro}
          </p>
          <ul className="space-y-6">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="border-b border-foreground/[0.06] pb-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-2">
                  {post.datePublished}
                </p>
                <Link
                  href={blogPath(locale, post.slug)}
                  className="text-lg font-semibold text-anima-violet hover:underline block mb-2"
                  prefetch={false}
                >
                  {post.title}
                </Link>
                <p className="text-sm text-foreground/55 leading-relaxed">
                  {post.description}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </MarketingChrome>
    </>
  );
}
