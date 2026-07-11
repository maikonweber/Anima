import Link from "next/link";
import type { BlogBlock, BlogPost } from "@/lib/seo/posts/types";
import { postToc, sectionBlocks } from "@/lib/seo/posts/types";
import { blogPosts } from "@/lib/seo/posts";

/** Links markdown leves: [rótulo](/caminho) ou [rótulo](https://...). */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return <span key={i}>{part}</span>;
        const [, label, href] = m;
        const external = href.startsWith("http");
        if (external) {
          return (
            <a
              key={i}
              href={href}
              className="text-anima-violet hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
          );
        }
        return (
          <Link key={i} href={href} className="text-anima-violet hover:underline">
            {label}
          </Link>
        );
      })}
    </>
  );
}

function Blocks({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-4 text-sm text-foreground/55 leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return (
            <p key={i}>
              <RichText text={block.text} />
            </p>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="list-disc ps-6 space-y-2">
              {block.items.map((item) => (
                <li key={item.slice(0, 40)}>
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={i} className="list-decimal ps-6 space-y-2">
              {block.items.map((item) => (
                <li key={item.slice(0, 40)}>
                  <RichText text={item} />
                </li>
              ))}
            </ol>
          );
        }
        if (block.type === "h3") {
          return (
            <h3
              key={block.id}
              id={block.id}
              className="text-base font-semibold text-foreground/78 pt-2 scroll-mt-24"
            >
              {block.text}
            </h3>
          );
        }
        return (
          <div key={i} className="overflow-x-auto rounded-lg border border-foreground/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-foreground/[0.03]">
                <tr>
                  {block.headers.map((h) => (
                    <th key={h} className="px-3 py-2 font-semibold text-foreground/70">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri} className="border-t border-foreground/10">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 align-top">
                        <RichText text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export function BlogArticleBody({ post }: { post: BlogPost }) {
  const toc = postToc(post);
  const related = (post.relatedSlugs ?? [])
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <>
      {post.intro?.length ? (
        <div className="space-y-4 text-sm text-foreground/55 leading-relaxed mb-10">
          {post.intro.map((p) => (
            <p key={p.slice(0, 48)}>
              <RichText text={p} />
            </p>
          ))}
        </div>
      ) : (
        <p className="text-lg text-foreground/60 italic mb-10 leading-relaxed">
          {post.description}
        </p>
      )}

      {toc.length > 2 ? (
        <nav
          aria-label="Sumário do artigo"
          className="mb-12 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/40 mb-3">
            Neste artigo
          </p>
          <ol className="space-y-2 text-sm">
            {toc.map((item, idx) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-anima-violet hover:underline"
                >
                  {idx + 1}. {item.label}
                </a>
              </li>
            ))}
            {post.faq?.length ? (
              <li>
                <a href="#faq" className="text-anima-violet hover:underline">
                  {toc.length + 1}. Perguntas frequentes
                </a>
              </li>
            ) : null}
          </ol>
        </nav>
      ) : null}

      <div className="space-y-12">
        {post.sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id}>
            <h2
              id={section.id}
              className="text-xl font-semibold text-foreground/82 mb-4 scroll-mt-24"
            >
              {section.heading}
            </h2>
            <Blocks blocks={sectionBlocks(section)} />
          </section>
        ))}
      </div>

      {post.conclusion?.length ? (
        <section className="mt-12" aria-labelledby="conclusao">
          <h2
            id="conclusao"
            className="text-xl font-semibold text-foreground/82 mb-4 scroll-mt-24"
          >
            Conclusão
          </h2>
          <div className="space-y-4 text-sm text-foreground/55 leading-relaxed">
            {post.conclusion.map((p) => (
              <p key={p.slice(0, 48)}>
                <RichText text={p} />
              </p>
            ))}
          </div>
        </section>
      ) : null}

      {post.faq && post.faq.length > 0 ? (
        <section className="mt-12" aria-labelledby="faq">
          <h2
            id="faq"
            className="text-xl font-semibold text-foreground/82 mb-4 scroll-mt-24"
          >
            Perguntas frequentes
          </h2>
          <dl className="space-y-5">
            {post.faq.map((item) => (
              <div key={item.question}>
                <dt className="text-sm font-semibold text-foreground/75 mb-1">
                  {item.question}
                </dt>
                <dd className="text-sm text-foreground/55 leading-relaxed">
                  <RichText text={item.answer} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {post.cta ? (
        <aside className="mt-12 rounded-xl border border-anima-violet/25 bg-anima-violet/[0.06] p-6">
          <h2 className="text-lg font-semibold text-foreground/85 mb-2">
            {post.cta.heading}
          </h2>
          <p className="text-sm text-foreground/55 leading-relaxed mb-4">
            <RichText text={post.cta.body} />
          </p>
          <nav className="flex flex-wrap gap-4 text-sm font-medium text-anima-violet">
            {post.cta.links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
      ) : null}

      {related.length > 0 ? (
        <nav aria-label="Artigos relacionados" className="mt-10">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/40 mb-3">
            Continue lendo
          </p>
          <ul className="space-y-2 text-sm">
            {related.map((r) =>
              r ? (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="text-anima-violet hover:underline"
                  >
                    {r.title}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </nav>
      ) : null}
    </>
  );
}
