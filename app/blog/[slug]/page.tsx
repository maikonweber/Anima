import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema, blogPostingSchema } from "@/components/seo/schema";
import { blogPosts } from "@/lib/seo/posts";
import { SITE_URL } from "@/lib/seo/site";

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = blogPosts.find((item) => item.slug === params.slug);
  if (!post) return { title: "Artigo não encontrado" };

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    keywords: [
      ...(post.keywords ?? []),
      "diário emocional",
      "acompanhamento emocional",
      "SENTIO AI",
    ],
    authors: [{ name: "MutterCorp · EmotiveCare" }],
    openGraph: {
      type: "article",
      locale: "pt_BR",
      url,
      publishedTime: post.datePublished,
      authors: ["MutterCorp · EmotiveCare"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogSlugPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = blogPosts.find((item) => item.slug === params.slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[blogPostingSchema(post), breadcrumbListSchema([
          { name: "Início", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: "Artigo atual", path: `/blog/${post.slug}` },
        ])]}
      />
      <MarketingChrome>
        <article>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-2">
            Blog · {post.datePublished}
          </p>
          <h1 className="text-3xl font-bold text-foreground/90 mb-6">{post.title}</h1>
          <p className="text-lg text-foreground/60 italic mb-8 leading-relaxed">
            {post.description}
          </p>
          <div className="space-y-4 text-sm text-foreground/55 leading-relaxed">
            <p>
              A EmotiveCare combina registros conscientes da linha do tempo emocional,
              dashboards terapêuticos compartilhados sob permissão paciente-profissional
              e sínteses da SENTIO AI sempre descritivas — nunca prometendo cura garantida nem
              diagnóstico automático por IA.
            </p>
            <p>
              Se você enfrenta sofrimento persistente ou ideação de automutilação procure
              imediatamente serviços de emergência especializados e profissionais de saúde
              mentais próximos a você.
            </p>
          </div>
          <p className="mt-12 text-xs text-foreground/40">
            <Link href="/blog" prefetch={false} className="text-anima-violet hover:underline">
              Voltar aos artigos
            </Link>
          </p>
        </article>
      </MarketingChrome>
    </>
  );
}
