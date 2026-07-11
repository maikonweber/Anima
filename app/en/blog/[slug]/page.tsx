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
import { getBlogUi, blogPath, htmlLang, ogLocale } from "@/lib/seo/i18n";
import { getPostBySlug, getPostsByLocale } from "@/lib/seo/posts";
import { OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";

const LOCALE = "en" as const;

export async function generateStaticParams() {
  return getPostsByLocale(LOCALE).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const ui = getBlogUi(LOCALE);
  const post = getPostBySlug(params.slug, LOCALE);
  if (!post) return { title: ui.notFoundTitle };

  const url = `${SITE_URL}${blogPath(LOCALE, post.slug)}`;
  const ptUrl = `${SITE_URL}${blogPath("pt-BR", post.slug)}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
      languages: {
        "pt-BR": ptUrl,
        en: url,
        "x-default": ptUrl,
      },
    },
    robots: { index: true, follow: true },
    keywords: [
      ...(post.keywords ?? []),
      "emotional diary",
      "emotional follow-up",
      "SENTIO AI",
    ],
    authors: [{ name: "MutterCorp · EmotiveCare" }],
    openGraph: {
      type: "article",
      locale: ogLocale(LOCALE),
      alternateLocale: ["pt_BR"],
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
      language: htmlLang(LOCALE),
    },
  };
}

export default async function EnBlogSlugPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const ui = getBlogUi(LOCALE);
  const post = getPostBySlug(params.slug, LOCALE);
  if (!post) notFound();

  const jsonLd = [
    blogPostingSchema(post, undefined, LOCALE),
    breadcrumbListSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: blogPath(LOCALE) },
      { name: post.title, path: blogPath(LOCALE, post.slug) },
    ]),
    ...(post.faq?.length ? [faqSchema(post.faq)] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <MarketingChrome>
        <article className="max-w-3xl" lang={htmlLang(LOCALE)}>
          <BlogLanguageSwitch locale={LOCALE} slug={post.slug} />
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-2">
            Blog · {post.datePublished}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground/90 mb-6 leading-tight">
            {post.title}
          </h1>

          <BlogArticleBody post={post} locale={LOCALE} />

          <p className="mt-10 text-xs text-foreground/40 leading-relaxed">
            {ui.crisisNote}
          </p>
          <p className="mt-6 text-xs text-foreground/40">
            <Link
              href={blogPath(LOCALE)}
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
