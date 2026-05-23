import Link from "next/link";
import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { blogPosts } from "@/lib/seo/posts";
import { DEFAULT_SITE_KEYWORDS, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Blog — bem-estar emocional assistido pela SENTIO AI",
  description:
    "Artigos sintéticos pensados para leitura humana e para motores semânticos: autoconhecimento, burnout e acompanhamento longitudinal ético.",
  alternates: { canonical: `${SITE_URL}/blog` },
  keywords: [...DEFAULT_SITE_KEYWORDS, "blog saúde emocional", "IA contextual"],
};

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbListSchema([
        { name: "Início", path: "/" },
        { name: "Blog", path: "/blog" },
      ])} />
      <MarketingChrome>
        <article>
          <h1 className="text-3xl font-bold text-foreground/90 mb-6">Blog EmotiveCare</h1>
          <p className="text-sm text-foreground/55 mb-10 leading-relaxed">
            Materiais atualizados com foco em respostas diretas sobre autoconhecimento,
            burnout, ansiedade leve relatada pelo usuário e integração paciente-profissional.
          </p>
          <ul className="space-y-6">
            {blogPosts.map((post) => (
              <li key={post.slug} className="border-b border-foreground/[0.06] pb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-2">
                  {post.datePublished}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-lg font-semibold text-anima-violet hover:underline block mb-2"
                  prefetch={false}
                >
                  {post.title}
                </Link>
                <p className="text-sm text-foreground/55 leading-relaxed">
                  {post.description}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </MarketingChrome>
    </>
  );
}
