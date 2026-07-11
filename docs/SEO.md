# SEO — EmotiveCare (Next.js App Router)

**Domínio canônico:** `https://emotivecare.com.br` (apex, sem `www`).

- **Variável de ambiente**: defina `NEXT_PUBLIC_SITE_URL=https://emotivecare.com.br` no deploy (veja `env.example`). Sem isso, canônicos, Open Graph e `app/sitemap.ts` podem divergir do host real.
- **www → apex**: redirect permanente em `next.config.ts` (`www.emotivecare.com.br` → apex). Confirme também no painel Vercel Domains que o redirect é **301**.
- **Sitemap**: gerado dinamicamente em `/sitemap.xml` via `app/sitemap.ts` (prioritário sobre `next-sitemap` estático). `lastmod` das rotas institucionais usa a data do build; posts usam `dateModified` / `datePublished`.
- **Robôs públicos**: `/robots.txt` via `app/robots.ts` — `host` e `sitemap` derivados de `SITE_URL`; `Disallow` para áreas autenticadas/transacionais.
- **Metadata de marketing**: helper `buildMarketingMetadata` em `lib/seo/page-metadata.ts`.
- **Structured data**: JSON-LD em `components/seo/*` (`Organization`, `WebSite`, `SoftwareApplication`, `MedicalWebPage` na home, `FAQPage` em `/faq` e home, `BlogPosting` + breadcrumbs em `/blog/[slug]`).
- **FAQ única**: `lib/seo/faq.ts` alimenta a home e `/faq`.
- **Blog / i18n**: PT na raiz (`/blog`, `/about`, …); EN sob `/en/...`. Dicionários em `lib/i18n/`. `hreflang` PT↔EN nas páginas de marketing. Sitemap inclui ambos os idiomas.
- **Redirect de marketing**: `/planos` → `/plans` (permanente).
- **Manifest PWA-lite**: `/manifest.webmanifest` via `app/manifest.ts`.
- **Preview social**: `/opengraph-image` (PNG dinâmica); Twitter `summary_large_image`.
- **Biblioteca**: `next-seo` está instalada para casos pontuais; o padrão é a **Metadata API** nativa do App Router.

Para regenerar algo com **`next-sitemap`**, há `next-sitemap.config.js` (sem gancho automático na build para não conflitar com `app/sitemap.ts`).

## Analytics e observabilidade (Vercel)

- **`@vercel/analytics`**: `<Analytics />` em `app/layout.tsx`.
- **`@vercel/speed-insights`**: `<SpeedInsights />` — Core Web Vitals em produção.

Em `localhost` os scripts costumam não enviar dados; em **Preview** e **Production** na Vercel os dados aparecem após tráfego real.

## Checklist pós-deploy (Search Console)

1. Propriedade do domínio: `emotivecare.com.br` (apex).
2. Enviar sitemap: `https://emotivecare.com.br/sitemap.xml`.
3. URL Inspection: home, `/faq`, `/plans`, um post do blog.
4. Confirmar que canônicos e `og:url` usam o apex (não `www`).
5. Validar preview social (WhatsApp / LinkedIn / X) com a OG absoluta no apex.
6. Se LCP sofrer, otimizar `public/logo.png` (~1.3 MB).
