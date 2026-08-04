import type { Metadata } from "next";
import { PsychologistsView } from "@/components/marketing/pages/PsychologistsView";
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
    title: "Cuidado — dashboard para psicólogos e psiquiatras entre sessões",
    description:
      "Plano Cuidado: psicólogos e psiquiatras acompanham dashboards emocionais em leitura quando o paciente convida. Para CRM, agenda, teleconsulta e IA clínica, use EmotiveCare Clínicas.",
    keywords: [
      "plano Cuidado",
      "dashboard para psicólogos",
      "dashboard para psiquiatras",
      "acompanhamento entre sessões",
      "psicólogo digital",
      "psiquiatra digital",
    ],
  },
  en: {
    title: "Cuidado — dashboard for psychologists and psychiatrists between sessions",
    description:
      "Cuidado plan: psychologists and psychiatrists follow read-only emotional dashboards when patients invite them. For CRM, scheduling, teleconsult, and clinical AI, use EmotiveCare Clinics.",
    keywords: [
      "Cuidado plan",
      "dashboard for psychologists",
      "dashboard for psychiatrists",
      "between-session follow-up",
    ],
  },
  es: {
    title: "Cuidado — panel para psicólogos y psiquiatras entre sesiones",
    description:
      "Plan Cuidado: psicólogos y psiquiatras siguen paneles emocionales en lectura cuando el paciente los invita. Para CRM, agenda, teleconsulta e IA clínica, usa EmotiveCare Clínicas.",
    keywords: [
      "plan Cuidado",
      "panel para psicólogos",
      "panel para psiquiatras",
      "seguimiento entre sesiones",
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  return buildMarketingMetadata({
    title: copy.title,
    description: copy.description,
    path: "/psychologists",
    locale,
    keywords: copy.keywords,
  });
}

export default async function PsychologistsPage() {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(locale, "/") },
          {
            name: dict.nav.psychologists,
            path: localizedPath(locale, "/psychologists"),
          },
        ])}
      />
      <PsychologistsView locale={locale} />
    </>
  );
}
