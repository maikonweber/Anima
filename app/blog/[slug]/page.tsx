import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { BlogArticleBody } from "@/components/seo/BlogArticleBody";
import { BlogLanguageSwitch } from "@/components/seo/BlogLanguageSwitch";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbListSchema,
  blogPostingSchema,
  faqSchema,
} from "@/components/seo/schema";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { getBlogUi, blogPath, htmlLang, ogLocale } from "@/lib/seo/i18n";
import { allBlogPosts, getPostBySlug } from "@/lib/seo/posts";
import { OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";

export async function generateStaticParams() {
  const seen = new Set<string>();
  return allBlogPosts()
    .filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    })
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getRequestLocale();
  const params = await props.params;
  const ui = getBlogUi(locale);
  const post = getPostBySlug(params.slug, locale);
  if (!post) return { title: ui.notFoundTitle };

  const url = `${SITE_URL}${blogPath(locale, post.slug)}`;
  const ptUrl = `${SITE_URL}${blogPath("pt-BR", post.slug)}`;
  const enUrl = `${SITE_URL}${blogPath("en", post.slug)}`;
  const esUrl = `${SITE_URL}${blogPath("es", post.slug)}`;
  const currentOg = ogLocale(locale);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
      languages: {
        "pt-BR": ptUrl,
        en: enUrl,
        es: esUrl,
        "x-default": ptUrl,
      },
    },
    robots: { index: true, follow: true },
    keywords: [
      ...(post.keywords ?? []),
      "diário emocional",
      "acompanhamento emocional",
      "SENTIO AI",
    ],
    authors: [{ name: "MutterCorp · EmotiveCare" }],
    openGraph: {
      type: "article",
      locale: currentOg,
      alternateLocale: ["pt_BR", "en_US", "es_ES"].filter((l) => l !== currentOg),
      url,
      siteName: "EmotiveCare",
      title: `${post.title} · EmotiveCare`,
      description: post.description,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified ?? post.datePublished,
      authors: ["MutterCorp · EmotiveCare"],
      tags: post.keywords,
      images: [
        {
          url: `${SITE_URL}${OG_IMAGE_PATH}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} · EmotiveCare`,
      description: post.description,
      images: [`${SITE_URL}${OG_IMAGE_PATH}`],
    },
    other: {
      language: htmlLang(locale),
    },
  };
}

export default async function BlogSlugPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getRequestLocale();
  const params = await props.params;
  const dict = getDictionary(locale);
  const ui = getBlogUi(locale);
  const post = getPostBySlug(params.slug, locale);
  if (!post) notFound();

  const jsonLd = [
    blogPostingSchema(post, undefined, locale),
    breadcrumbListSchema([
      { name: dict.common.home, path: localizedPath(locale, "/") },
      { name: "Blog", path: blogPath(locale) },
      { name: post.title, path: blogPath(locale, post.slug) },
    ]),
    ...(post.faq?.length ? [faqSchema(post.faq)] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <MarketingChrome locale={locale}>
        <article className="max-w-3xl" lang={htmlLang(locale)}>
          <BlogLanguageSwitch locale={locale} slug={post.slug} />
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-2">
            Blog · {post.datePublished}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground/90 mb-6 leading-tight">
            {post.title}
          </h1>

          <BlogArticleBody post={post} locale={locale} />

          <p className="mt-10 text-xs text-foreground/40 leading-relaxed">
            {ui.crisisNote}
          </p>
          <p className="mt-6 text-xs text-foreground/40">
            <Link
              href={blogPath(locale)}
              prefetch={false}
              className="text-anima-violet hover:underline"
            >
              {ui.backToArticles}
            </Link>
          </p>
        </article>
      </MarketingChrome>
    </>
  );
}
