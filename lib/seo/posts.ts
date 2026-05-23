export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  keywords?: string[];
}

/** Conteúdo editorial inicial (blog SEO-ready — expandir com CMS quando houver). */
export const blogPosts: BlogPost[] = [
  {
    slug: "bem-vindo-a-emotivecare",
    title:
      "Bem-vindo à EmotiveCare: acompanhamento emocional contínuo com SENTIO AI",
    description:
      "Entenda como unir registros diários inteligentes, memória emocional e dashboards terapêuticos em uma única rotina ética.",
    datePublished: "2026-05-01",
    keywords: ["EmotiveCare", "SENTIO AI", "bem-estar"],
  },
  {
    slug: "como-profissionais-usam-dashboard-terapeutico",
    title: "Como psicólogos usam o dashboard entre sessões (sem substituir a escuta clínica)",
    description:
      "Contexto longitudinal, pré-consulta inteligente e compartilhamento controlado pelo paciente.",
    datePublished: "2026-05-08",
    keywords: ["psicologia digital", "acompanhamento longitudinal"],
  },
];
