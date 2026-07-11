import Link from "next/link";
import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { BlogLanguageSwitch } from "@/components/seo/BlogLanguageSwitch";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { blogPath, getBlogUi, htmlLang } from "@/lib/seo/i18n";
import { getPostsByLocale } from "@/lib/seo/posts";
import { OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";

const LOCALE = "en" as const;

const title = "Blog — emotional well-being with SENTIO AI";
const description =
  "Articles written for people and search engines: self-awareness, burnout, and ethical longitudinal follow-up.";
const canonical = `${SITE_URL}/en/blog`;
const ogImage = `${SITE_URL}${OG_IMAGE_PATH}`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
    languages: {
      "pt-BR": `${SITE_URL}/blog`,
      en: canonical,
      "x-default": `${SITE_URL}/blog`,
    },
  },
  robots: { index: true, follow: true },
  keywords: ["emotional health blog", "contextual AI", "EmotiveCare", "SENTIO AI"],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["pt_BR"],
    url: canonical,
    siteName: "EmotiveCare",
    title: `${title} · EmotiveCare`,
    description,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "EmotiveCare · SENTIO AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · EmotiveCare`,
    description,
    images: [ogImage],
  },
};

export default function EnBlogIndexPage() {
  const ui = getBlogUi(LOCALE);
  const posts = getPostsByLocale(LOCALE);

  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: blogPath(LOCALE) },
        ])}
      />
      <MarketingChrome>
        <article lang={htmlLang(LOCALE)}>
          <BlogLanguageSwitch locale={LOCALE} />
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
                  href={blogPath(LOCALE, post.slug)}
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
