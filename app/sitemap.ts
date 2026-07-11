import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";
import { blogPosts } from "@/lib/seo/posts";

const PUBLIC_MARKETING_ROUTES = [
  { route: "/", changeFrequency: "weekly" as const, priority: 1 },
  { route: "/about", changeFrequency: "monthly" as const, priority: 0.85 },
  { route: "/plans", changeFrequency: "weekly" as const, priority: 0.92 },
  { route: "/faq", changeFrequency: "weekly" as const, priority: 0.82 },
  { route: "/resources", changeFrequency: "monthly" as const, priority: 0.72 },
  { route: "/psychologists", changeFrequency: "monthly" as const, priority: 0.82 },
  { route: "/contact", changeFrequency: "yearly" as const, priority: 0.6 },
  { route: "/privacy", changeFrequency: "yearly" as const, priority: 0.45 },
  { route: "/terms", changeFrequency: "yearly" as const, priority: 0.45 },
  { route: "/blog", changeFrequency: "weekly" as const, priority: 0.76 },
];

/** lastmod das rotas institucionais — atualizado a cada deploy. */
const SITE_LAST_MOD = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = PUBLIC_MARKETING_ROUTES.map((p) => ({
    url: `${SITE_URL}${p.route}`,
    lastModified: SITE_LAST_MOD,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  for (const post of blogPosts) {
    routes.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.dateModified ?? post.datePublished),
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  return routes;
}
