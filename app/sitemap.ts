import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";
import { allBlogPosts, postLocale } from "@/lib/seo/posts";
import { blogPath } from "@/lib/seo/i18n";
import { localizedPath, type Locale } from "@/lib/i18n/config";

/**
 * URLs públicas indexáveis — alinhadas ao posicionamento SEO/GEO:
 * segundo cérebro pessoal + Clínicas (psicólogos/psiquiatras) + Cuidado.
 * Não incluir rotas autenticadas (/clinic, /dashboard, …).
 */
const MARKETING_PATHS: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/clinicas", changeFrequency: "weekly", priority: 0.96 },
  { path: "/plans", changeFrequency: "weekly", priority: 0.94 },
  { path: "/psychologists", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.86 },
  { path: "/faq", changeFrequency: "weekly", priority: 0.88 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.78 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.72 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.55 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
];

const LOCALES: Locale[] = ["pt-BR", "en", "es"];
const SITE_LAST_MOD = new Date("2026-08-03");

function languageAlternates(path: string): Record<string, string> {
  return {
    "pt-BR": `${SITE_URL}${localizedPath("pt-BR", path)}`,
    en: `${SITE_URL}${localizedPath("en", path)}`,
    es: `${SITE_URL}${localizedPath("es", path)}`,
    "x-default": `${SITE_URL}${localizedPath("pt-BR", path)}`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const p of MARKETING_PATHS) {
      routes.push({
        url: `${SITE_URL}${localizedPath(locale, p.path)}`,
        lastModified: SITE_LAST_MOD,
        changeFrequency: p.changeFrequency,
        priority:
          locale === "pt-BR"
            ? p.priority
            : Number((p.priority * 0.94).toFixed(2)),
        alternates: {
          languages: languageAlternates(p.path),
        },
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
