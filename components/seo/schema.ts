import { SITE_URL } from "@/lib/seo/site";
import type { BlogPost } from "@/lib/seo/posts";
import type { FaqEntry } from "@/lib/seo/faq";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const APP_ID = `${SITE_URL}/#software-app`;
const CLINICS_ID = `${SITE_URL}/#software-clinics`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "MutterCorp",
    alternateName: ["EmotiveCare", "EmotiveCare Clínicas"],
    url: SITE_URL,
    slogan:
      "Segundo cérebro emocional para pessoas; operação clínica com IA responsável para psicólogos e psiquiatras.",
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
    knowsLanguage: ["pt-BR", "en"],
    areaServed: { "@type": "Country", name: "Brasil" },
    description:
      "MutterCorp desenvolve a EmotiveCare: app pessoal de segundo cérebro emocional com SENTIO AI, plano Cuidado para profissionais convidados, e EmotiveCare Clínicas (CRM, agenda, teleconsulta, prontuário e sínteses de IA revisáveis) para psicólogos, psiquiatras e equipes clínicas.",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "EmotiveCare",
    description:
      "EmotiveCare é o segundo cérebro emocional para uso pessoal e a suíte EmotiveCare Clínicas para psicólogos e psiquiatras: CRM, agenda, teleconsulta, prontuário e IA clínica com revisão humana.",
    publisher: { "@id": ORG_ID },
    inLanguage: ["pt-BR", "en"],
  };
}

/** App da pessoa — segundo cérebro emocional. */
export function softwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: "EmotiveCare",
    applicationCategory: "HealthApplication",
    applicationSubCategory: "Emotional journaling and personal knowledge",
    operatingSystem: "Web",
    inLanguage: ["pt-BR", "en"],
    url: SITE_URL,
    creator: { "@id": ORG_ID },
    audience: {
      "@type": "Audience",
      audienceType:
        "Pessoas que querem autoconhecimento emocional e um segundo cérebro pessoal com memória semântica",
    },
    featureList: [
      "Segundo cérebro emocional com memória semântica do histórico",
      "Diário de energia emocional (texto, energia 0–100, humor e tags)",
      "SENTIO AI: reflexões e padrões sem diagnóstico automático",
      "Assistente emocional com guardrails e limite de interações",
      "Tracking de sono, estresse, socialização e burnout (Pleno)",
      "Compartilhamento seguro do dashboard com 1 profissional (Pleno)",
      "Plano Cuidado: dashboards em leitura para psicólogos e psiquiatras convidados",
    ],
    offers: [
      {
        "@type": "Offer",
        name: "Essencial",
        price: "0",
        priceCurrency: "BRL",
        description: "Diário e SENTIO AI com limites mensais — grátis para começar",
      },
      {
        "@type": "Offer",
        name: "Pleno",
        price: "9.99",
        priceCurrency: "BRL",
        description:
          "Segundo cérebro completo: diário/IA ilimitados, até 500 interações do assistente/mês e 1 vínculo profissional",
      },
    ],
    screenshot: `${SITE_URL}/logo.png`,
    description:
      "EmotiveCare para uso pessoal: segundo cérebro emocional que lembra por significado, conecta padrões ao longo do tempo e devolve reflexões com SENTIO AI — sem substituir terapia.",
  };
}

/** Produto B2B — Clínicas para psicólogos e psiquiatras. */
export function clinicsSoftwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": CLINICS_ID,
    name: "EmotiveCare Clínicas",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Clinical practice management for mental health",
    operatingSystem: "Web",
    inLanguage: ["pt-BR", "en"],
    url: `${SITE_URL}/clinicas`,
    creator: { "@id": ORG_ID },
    isRelatedTo: { "@id": APP_ID },
    audience: {
      "@type": "Audience",
      audienceType:
        "Psicólogos, psiquiatras, clínicas multi-profissional e equipes de saúde mental",
    },
    featureList: [
      "CRM de pacientes com funil e contatos por organização",
      "Agenda, disponibilidade e remarcação de sessões",
      "Teleconsulta autenticada com consentimento TELECONSULTA",
      "Prontuário: notas clínicas com assinatura e adendo",
      "Consentimentos granulares por finalidade (LGPD)",
      "Lembretes e plano de cuidado liberados ao paciente",
      "Sínteses SENTIO AI revisáveis antes de entrar no prontuário",
      "Alertas clínicos com revisão humana",
      "Base de conhecimento clínico curada (RAG)",
      "Papéis, auditoria e multi-tenant",
    ],
    description:
      "EmotiveCare Clínicas é o produto B2B para psicólogos e psiquiatras: CRM, agenda, teleconsulta, prontuário, consentimentos e funcionalidades de IA clínica com revisão humana — separado do diário pessoal do paciente.",
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
    name: "EmotiveCare — segundo cérebro emocional e Clínicas para profissionais",
    description:
      "Informações sobre o app pessoal de segundo cérebro emocional e sobre EmotiveCare Clínicas para psicólogos e psiquiatras. Não substitui avaliação, diagnóstico ou tratamento clínico.",
    about: [
      {
        "@type": "Thing",
        name: "Segundo cérebro emocional",
        description:
          "Uso pessoal da EmotiveCare: diário com memória semântica e SENTIO AI.",
      },
      {
        "@type": "Thing",
        name: "EmotiveCare Clínicas",
        description:
          "Suíte operacional com IA assistiva para psicólogos e psiquiatras.",
      },
    ],
    isPartOf: { "@type": "WebSite", "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "pt-BR",
    lastReviewed: "2026-08-03",
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
  locale: "pt-BR" | "en" = "pt-BR",
) {
  const path = locale === "en" ? `/en/blog/${post.slug}` : `/blog/${post.slug}`;
  const url = `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    url,
    inLanguage: locale === "en" ? "en" : "pt-BR",
    author: { "@type": "Organization", name: authorName },
    publisher: { "@id": ORG_ID },
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
