import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";
import { allBlogPosts, postLocale } from "@/lib/seo/posts";
import { blogPath } from "@/lib/seo/i18n";
import { localizedPath, type Locale } from "@/lib/i18n/config";

const MARKETING_PATHS: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.85 },
  { path: "/plans", changeFrequency: "weekly", priority: 0.92 },
  { path: "/faq", changeFrequency: "weekly", priority: 0.82 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.72 },
  { path: "/psychologists", changeFrequency: "monthly", priority: 0.82 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.45 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.45 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.76 },
  { path: "/login", changeFrequency: "yearly", priority: 0.4 },
  { path: "/register", changeFrequency: "yearly", priority: 0.55 },
];

const LOCALES: Locale[] = ["pt-BR", "en"];
const SITE_LAST_MOD = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const p of MARKETING_PATHS) {
      routes.push({
        url: `${SITE_URL}${localizedPath(locale, p.path)}`,
        lastModified: SITE_LAST_MOD,
        changeFrequency: p.changeFrequency,
        priority: locale === "en" ? p.priority * 0.92 : p.priority,
      });
    }
  }

  for (const post of allBlogPosts()) {
    const locale = postLocale(post);
    routes.push({
      url: `${SITE_URL}${blogPath(locale, post.slug)}`,
      lastModified: new Date(post.dateModified ?? post.datePublished),
      changeFrequency: "monthly",
      priority: locale === "en" ? 0.6 : 0.65,
    });
  }

  return routes;
}
