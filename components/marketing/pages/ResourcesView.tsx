import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { getPostsByLocale } from "@/lib/seo/posts";
import { blogPath } from "@/lib/seo/i18n";

export function ResourcesView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).resources;
  const featured = getPostsByLocale(locale).slice(0, 8);

  return (
    <MarketingChrome locale={locale}>
      <article>
        <h1 className="text-3xl font-bold text-foreground/90 mb-4">{t.title}</h1>
        <p className="text-sm text-foreground/55 leading-relaxed mb-10 max-w-2xl">
          {t.intro}
        </p>

        <section aria-labelledby="recursos-blog" className="mb-12">
          <h2
            id="recursos-blog"
            className="text-xl font-semibold text-foreground/82 mb-4"
          >
            {t.articlesTitle}
          </h2>
          <ul className="space-y-4">
            {featured.map((post) => (
              <li key={post.slug}>
                <Link
                  href={blogPath(locale, post.slug)}
                  className="text-anima-violet font-medium hover:underline"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-foreground/45 mt-1 leading-relaxed">
                  {post.description}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <Link
              href={localizedPath(locale, "/blog")}
              className="text-anima-violet hover:underline"
            >
              {t.seeAllArticles}
            </Link>
          </p>
        </section>

        <section aria-labelledby="recursos-externos" className="mb-12">
          <h2
            id="recursos-externos"
            className="text-xl font-semibold text-foreground/82 mb-4"
          >
            {t.externalTitle}
          </h2>
          <ul className="space-y-4 text-sm text-foreground/55">
            {t.external.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-anima-violet font-medium hover:underline"
                >
                  {item.name}
                </a>
                <span className="text-foreground/40"> — {item.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <nav
          aria-label={t.exploreNavAria}
          className="flex flex-wrap gap-4 font-medium text-anima-violet"
        >
          <Link
            href={localizedPath(locale, "/faq")}
            className="hover:underline"
          >
            {t.linkFaq}
          </Link>
          <Link
            href={localizedPath(locale, "/psychologists")}
            className="hover:underline"
          >
            {t.linkPsychologists}
          </Link>
          <Link
            href={localizedPath(locale, "/plans")}
            className="hover:underline"
          >
            {t.linkPlans}
          </Link>
        </nav>
      </article>
    </MarketingChrome>
  );
}
