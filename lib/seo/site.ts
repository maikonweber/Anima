/** URL canonical do ambiente atual (marketing, OG, Schema). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.emotivecare.com.br";

export function absoluteUrl(path: string): string {
  if (!path || path === "/") return SITE_URL;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export const DEFAULT_SITE_KEYWORDS: string[] = [
  "Anima",
  "segundo cérebro emocional",
  "diário emocional com IA",
  "diário de energia emocional",
  "MutterCorp",
  "diário emocional",
  "acompanhamento emocional",
  "saúde emocional",
  "IA emocional",
  "inteligência emocional",
  "memória emocional",
  "psicologia",
  "terapia online",
  "autoconhecimento",
  "wellness emocional",
  "burnout",
  "ansiedade",
  "cuidado emocional",
];

export const OG_IMAGE_PATH = "/opengraph-image";
