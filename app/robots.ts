import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * robots.txt dinâmico — aponta sitemap canônico e bloqueia apps autenticados.
 * Áreas públicas (/, /clinicas, /plans, /psychologists, /faq, /blog…) ficam indexáveis.
 */
const DISALLOW = [
  "/api/",
  "/dashboard/",
  "/diary/",
  "/care/",
  "/clinic/",
  "/teleconsulta/",
  "/assinatura/",
  "/assistente/",
  "/suporte/",
  "/org-invite",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/aguardando-verificacao",
  "/care-invite",
  "/admin/",
  "/settings/",
  "/auth/",
  "/private/",
  "/checkout/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/clinicas", "/plans", "/psychologists", "/faq", "/about", "/blog"],
        disallow: DISALLOW,
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/clinicas", "/plans", "/psychologists", "/faq", "/about", "/blog"],
        disallow: DISALLOW,
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/clinicas", "/plans", "/psychologists", "/faq", "/about", "/blog"],
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
