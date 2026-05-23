# SEO — EmotiveCare (Next.js App Router)

- **Dominio configurável**: defina `NEXT_PUBLIC_SITE_URL` (veja `env.example`) antes do deploy para canônicos corretos, Open Graph absoluto e `app/sitemap.ts`.
- **Sitemap**: gerado dinamicamente em `/sitemap.xml` via `app/sitemap.ts` (prioritário sobre `next-sitemap` estático).
- **Robôs públicos**: `public/robots.txt` lista `Disallow` para áreas autenticadas e aponta o sitemap hospedado.
- **Structured data**: scripts JSON-LD em `components/seo/*` (`Organization`, `WebSite`, `SoftwareApplication`, `MedicalWebPage` na home, `FAQPage` em `/faq`, `BlogPosting` + breadcrumbs em `/blog/[slug]`).
- **Manifest PWA-lite**: `/manifest.webmanifest` via `app/manifest.ts`.
- **Preview social**: `/opengraph-image` (PNG dinâmica) referenciada pela metadata global; Twitter em `large card`.
- **Biblioteca instalada**: `next-seo` está no projeto caso queira componentes cliente em cenários pontuais; o padrão adotado é a **Metadata API** nativa (recomendação atual do App Router).

Para regenerar algo com **`next-sitemap`**, há `next-sitemap.config.js` (sem gancho automático na build para não conflitar com `app/sitemap.ts`).

## Analytics e observabilidade (Vercel)

- **`@vercel/analytics`**: componente `<Analytics />` em `app/layout.tsx` — **Web Analytics** no painel Vercel (visitas, páginas, origem básica). Ative **Analytics** no projeto em [Vercel Dashboard → Settings → Analytics](https://vercel.com/docs/analytics) (plano conforme sua conta).
- **`@vercel/speed-insights`**: componente `<SpeedInsights />` — **Speed Insights** (Core Web Vitals / INP no ambiente de produção na Vercel).

Em `localhost` os scripts costumam não enviar dados; em **Preview** e **Production** na Vercel os dados aparecem após tráfego real.
