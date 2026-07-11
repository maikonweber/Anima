export interface BlogFaqItem {
  question: string;
  answer: string;
}

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "h3"; id: string; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface BlogSection {
  id: string;
  heading: string;
  /** Conteúdo rico (artigos longos). */
  blocks?: BlogBlock[];
  /** Formato legado (artigos curtos). */
  paragraphs?: string[];
}

export interface BlogCta {
  heading: string;
  body: string;
  links: { href: string; label: string }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  keywords?: string[];
  /** Parágrafos de introdução (após o H1). */
  intro?: string[];
  sections: BlogSection[];
  conclusion?: string[];
  faq?: BlogFaqItem[];
  cta?: BlogCta;
  relatedSlugs?: string[];
}

export function sectionBlocks(section: BlogSection): BlogBlock[] {
  if (section.blocks?.length) return section.blocks;
  return (section.paragraphs ?? []).map((text) => ({ type: "p" as const, text }));
}

export function postToc(post: BlogPost): { id: string; label: string }[] {
  return post.sections.map((s) => ({ id: s.id, label: s.heading }));
}
