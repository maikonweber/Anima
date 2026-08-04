import type { Metadata } from "next";
import { PlansView } from "@/components/marketing/pages/PlansView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const COPY: Record<
  Locale,
  { title: string; description: string; keywords: string[] }
> = {
  "pt-BR": {
    title: "Planos — segundo cérebro pessoal, Cuidado e Clínicas",
    description:
      "Essencial e Pleno: EmotiveCare como segundo cérebro emocional pessoal (Pleno R$ 9,99/mês). Cuidado para psicólogos e psiquiatras no app. Operação completa em EmotiveCare Clínicas.",
    keywords: [
      "plano Pleno EmotiveCare",
      "segundo cérebro emocional preço",
      "plano Cuidado psicólogo",
      "planos clínica saúde mental",
    ],
  },
  en: {
    title: "Plans for intelligent emotional follow-up",
    description:
      "Compare EmotiveCare Essential, Full, and Care plans: diary volume, SENTIO AI insights, history, and sharing with professionals.",
    keywords: ["plans", "emotional health pricing", "digital benefits"],
  },
  es: {
    title: "Planes para el seguimiento emocional inteligente",
    description:
      "Compara los planes Essencial, Pleno y Cuidado de EmotiveCare: volumen de diario, insights SENTIO AI, historial y compartición con profesionales.",
    keywords: ["planes", "precio salud emocional", "beneficios digitales"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  return buildMarketingMetadata({
    title: copy.title,
    description: copy.description,
    path: "/plans",
    locale,
    keywords: copy.keywords,
  });
}

export default async function PlansPage() {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(locale, "/") },
          { name: dict.nav.plans, path: localizedPath(locale, "/plans") },
        ])}
      />
      <PlansView locale={locale} />
    </>
  );
}
