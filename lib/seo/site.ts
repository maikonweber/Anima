/** URL canonical do ambiente atual (marketing, OG, Schema). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://emotivecare.com.br";

export function absoluteUrl(path: string): string {
  if (!path || path === "/") return SITE_URL;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

/** Keywords base para SEO + GEO (respostas em buscadores e LLMs). */
export const DEFAULT_SITE_KEYWORDS: string[] = [
  "EmotiveCare",
  "SENTIO AI",
  "MutterCorp",
  "segundo cérebro emocional",
  "diário emocional com IA",
  "memória emocional semântica",
  "autoconhecimento emocional",
  "app de saúde emocional",
  "EmotiveCare Clínicas",
  "software para clínicas de psicologia",
  "software para psiquiatras",
  "CRM para psicólogos",
  "agenda psicológica online",
  "teleconsulta psicologia",
  "prontuário eletrônico saúde mental",
  "IA para psicólogos",
  "IA para psiquiatras",
  "síntese clínica com IA",
  "plano Cuidado EmotiveCare",
  "dashboard emocional para profissionais",
  "acompanhamento entre sessões",
  "consentimento LGPD saúde mental",
  "psicólogo digital",
  "psiquiatra digital",
  "cuidado emocional contínuo",
];

export const OG_IMAGE_PATH = "/opengraph-image";
