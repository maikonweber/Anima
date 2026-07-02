import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * robots.txt dinâmico (App Router) — usa `NEXT_PUBLIC_SITE_URL` para host e
 * sitemap corretos em cada ambiente. Bloqueia áreas autenticadas/transacionais.
 */
const DISALLOW = [
  "/api/",
  "/dashboard/",
  "/diary/",
  "/care/",
  "/assinatura/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/aguardando-verificacao",
  "/care-invite",
  "/assistente",
  // Rotas reservadas (checklist de segurança)
  "/admin/",
  "/settings/",
  "/auth/",
  "/private/",
  "/checkout/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: DISALLOW,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
