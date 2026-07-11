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
    alternateName: "EmotiveCare",
    url: SITE_URL,
    slogan: "Seu segundo cérebro emocional — cuidado contínuo com IA responsável.",
    brand: {
      "@type": "Brand",
      name: "EmotiveCare",
      logo: `${SITE_URL}/logo.png`,
    },
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    knowsLanguage: ["pt-BR"],
    areaServed: { "@type": "Country", name: "Brasil" },
    description:
      "Ecossistema de produtos de cuidado emocional digital, incluindo a plataforma EmotiveCare e a tecnologia SENTIO AI.",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "EmotiveCare",
    description:
      "Diário de energia emocional com IA que lembra por você: entende o que você sente, conecta padrões ao longo do tempo e devolve reflexões personalizadas.",
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
    name: "EmotiveCare",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    inLanguage: "pt-BR",
    creator: {
      "@id": ORG_ID,
    },
    audience: {
      "@type": "Audience",
      audienceType:
        "Pessoas em busca de autoconhecimento emocional e profissionais de psicologia",
    },
    featureList: [
      "Diário de energia emocional (energia 0–100, humor, ansiedade e emoções)",
      "Análise emocional com SENTIO AI",
      "Segundo cérebro emocional com busca semântica no histórico",
      "Assistente emocional com guardrails e sugestão de ajuda profissional",
      "Resumo semanal da jornada emocional",
      "Dashboards compartilháveis com profissionais sob consentimento",
    ],
    screenshot: `${SITE_URL}/logo.png`,
    description:
      "Plataforma de acompanhamento emocional contínuo com SENTIO AI: diário inteligente, linha do tempo emocional, insights e dashboards compartilháveis sob consentimento — por MutterCorp.",
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
    name: "EmotiveCare — Plataforma de cuidado emocional contínuo",
    description:
      "Informações institucionais sobre aplicação voltada ao autoconhecimento e apoio emocional. Não substitui avaliação, diagnóstico ou tratamento clínico.",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    publisher: {
      "@id": ORG_ID,
    },
    inLanguage: "pt-BR",
    lastReviewed: "2026-07-10",
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
  authorName = "EmotiveCare · MutterCorp",
) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
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
