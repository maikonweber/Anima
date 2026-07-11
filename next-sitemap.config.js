/**
 * next-sitemap (opcional — o SEO principal usa `app/sitemap.ts`).
 * Rode manualmente apenas se usar export estático híbrido:
 * `npx next-sitemap`
 */
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://emotivecare.com.br",
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  exclude: [
    "/api/*",
    "/dashboard/*",
    "/diary/*",
    "/care/*",
    "/assinatura/*",
  ],
};
