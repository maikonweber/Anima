import Link from "next/link";
import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";
import { blogPosts } from "@/lib/seo/posts";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Recursos sobre saúde emocional e IA responsável",
  description:
    "Artigos e guias da EmotiveCare sobre diário emocional, burnout, ansiedade, memória semântica e uso responsável da SENTIO AI.",
  path: "/resources",
  keywords: ["recursos de saúde mental", "kits de autocuidado", "blog EmotiveCare"],
});

const EXTERNAL = [
  {
    name: "CVV — Centro de Valorização da Vida",
    href: "https://www.cvv.org.br/",
    note: "Apoio emocional gratuito 24h (ligue 188).",
  },
  {
    name: "Ministério da Saúde — saúde mental",
    href: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental",
    note: "Informações oficiais e rede de atenção.",
  },
] as const;

export default function ResourcesPage() {
  const featured = blogPosts.slice(0, 8);

  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Início", path: "/" },
          { name: "Recursos", path: "/resources" },
        ])}
      />
      <MarketingChrome>
        <article>
          <h1 className="text-3xl font-bold text-foreground/90 mb-4">
            Recursos
          </h1>
          <p className="text-sm text-foreground/55 leading-relaxed mb-10 max-w-2xl">
            Materiais para autoconhecimento emocional e uso responsável de IA.
            A EmotiveCare é apoio complementar — em crise, priorize redes de
            urgência e profissionais de saúde mental.
          </p>

          <section aria-labelledby="recursos-blog" className="mb-12">
            <h2
              id="recursos-blog"
              className="text-xl font-semibold text-foreground/82 mb-4"
            >
              Artigos EmotiveCare
            </h2>
            <ul className="space-y-4">
              {featured.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
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
              <Link href="/blog" className="text-anima-violet hover:underline">
                Ver todos os artigos →
              </Link>
            </p>
          </section>

          <section aria-labelledby="recursos-externos" className="mb-12">
            <h2
              id="recursos-externos"
              className="text-xl font-semibold text-foreground/82 mb-4"
            >
              Apoio externo
            </h2>
            <ul className="space-y-4 text-sm text-foreground/55">
              {EXTERNAL.map((item) => (
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
            aria-label="Explore conteúdo"
            className="flex flex-wrap gap-4 font-medium text-anima-violet"
          >
            <Link href="/faq" className="hover:underline">
              FAQ institucional
            </Link>
            <Link href="/psychologists" className="hover:underline">
              Para psicólogos
            </Link>
            <Link href="/plans" className="hover:underline">
              Planos
            </Link>
          </nav>
        </article>
      </MarketingChrome>
    </>
  );
}
