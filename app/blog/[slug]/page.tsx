import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbListSchema,
  blogPostingSchema,
  faqSchema,
} from "@/components/seo/schema";
import { blogPosts } from "@/lib/seo/posts";
import { OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";

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
      siteName: "EmotiveCare",
      title: `${post.title} · EmotiveCare`,
      description: post.description,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified ?? post.datePublished,
      authors: ["MutterCorp · EmotiveCare"],
      tags: post.keywords,
      images: [
        {
          url: `${SITE_URL}${OG_IMAGE_PATH}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} · EmotiveCare`,
      description: post.description,
      images: [`${SITE_URL}${OG_IMAGE_PATH}`],
    },
  };
}

export default async function BlogSlugPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = blogPosts.find((item) => item.slug === params.slug);
  if (!post) notFound();

  const jsonLd = [
    blogPostingSchema(post),
    breadcrumbListSchema([
      { name: "Início", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    ...(post.faq?.length ? [faqSchema(post.faq)] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <MarketingChrome>
        <article>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 mb-2">
            Blog · {post.datePublished}
          </p>
          <h1 className="text-3xl font-bold text-foreground/90 mb-6">
            {post.title}
          </h1>
          <p className="text-lg text-foreground/60 italic mb-10 leading-relaxed">
            {post.description}
          </p>

          <div className="space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold text-foreground/82 mb-3">
                  {section.heading}
                </h2>
                <div className="space-y-4 text-sm text-foreground/55 leading-relaxed">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {post.faq && post.faq.length > 0 ? (
            <section className="mt-12" aria-labelledby="post-faq">
              <h2
                id="post-faq"
                className="text-xl font-semibold text-foreground/82 mb-4"
              >
                Perguntas rápidas
              </h2>
              <dl className="space-y-4">
                {post.faq.map((item) => (
                  <div key={item.question}>
                    <dt className="text-sm font-semibold text-foreground/75 mb-1">
                      {item.question}
                    </dt>
                    <dd className="text-sm text-foreground/55 leading-relaxed">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <nav
            aria-label="Próximos passos"
            className="mt-12 flex flex-wrap gap-4 text-sm font-medium text-anima-violet"
          >
            <Link href="/plans" className="hover:underline">
              Ver planos
            </Link>
            <Link href="/psychologists" className="hover:underline">
              Para psicólogos
            </Link>
            <Link href="/faq" className="hover:underline">
              FAQ
            </Link>
            <Link href="/register" className="hover:underline">
              Começar grátis
            </Link>
          </nav>

          <p className="mt-10 text-xs text-foreground/40 leading-relaxed">
            Se você enfrenta sofrimento persistente ou ideação de automutilação,
            procure imediatamente serviços de emergência e profissionais de saúde
            mental próximos a você.
          </p>
          <p className="mt-6 text-xs text-foreground/40">
            <Link
              href="/blog"
              prefetch={false}
              className="text-anima-violet hover:underline"
            >
              Voltar aos artigos
            </Link>
          </p>
        </article>
      </MarketingChrome>
    </>
  );
}
