import { SITE_URL } from "@/lib/seo/site";
import type { BlogPost } from "@/lib/seo/posts";
import type { FaqEntry } from "@/lib/seo/faq";

const ORG_ID = `${SITE_URL}/#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "MutterCorp",
    url: SITE_URL,
    brand: {
      "@type": "Brand",
      name: "Anima",
      logo: `${SITE_URL}/logo.png`,
    },
    logo: `${SITE_URL}/logo.png`,
    description:
      "Ecossistema de produtos de cuidado emocional digital, incluindo o Anima — o diário de energia emocional com IA e segundo cérebro emocional.",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Anima",
    publisher: {
      "@id": ORG_ID,
    },
    inLanguage: "pt-BR",
  };
}

export function softwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Anima",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    creator: {
      "@id": ORG_ID,
    },
    screenshot: `${SITE_URL}/logo.png`,
    description:
      "Anima — diário de energia emocional com IA e segundo cérebro emocional: análise emocional, memória semântica do seu histórico, resumo semanal e assistente emocional seguro. Por MutterCorp.",
  };
}

/** Página inicial: contexto bem-estar/YMYL com linguagem factual (não é consulta médica). */
export function medicalHomePageSchema(path = "/") {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${url}#medical-home`,
    url,
    name: "Anima — Seu segundo cérebro emocional",
    description:
      "Informações institucionais sobre o Anima, um diário de energia emocional com IA voltado ao autoconhecimento e apoio emocional. Não substitui avaliação, diagnóstico ou tratamento clínico.",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    publisher: {
      "@id": ORG_ID,
    },
    inLanguage: "pt-BR",
    lastReviewed: "2026-05-22",
  };
}

export function faqSchema(entries: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: e.answer,
      },
    })),
  };
}

export function blogPostingSchema(
  post: BlogPost,
  authorName = "Anima · MutterCorp",
) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    url,
    inLanguage: "pt-BR",
    author: { "@type": "Organization", name: authorName },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbListSchema(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
