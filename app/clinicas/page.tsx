import type { Metadata } from "next";
import { ClinicsView } from "@/components/marketing/pages/ClinicsView";
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
    title:
      "Clínicas — CRM, teleconsulta e IA para psicólogos e psiquiatras",
    description:
      "EmotiveCare Clínicas: funcionalidades clínicas com IA revisável — CRM, agenda, teleconsulta, prontuário, consentimentos, lembretes, plano de cuidado e sínteses SENTIO AI. Feito para psicólogos, psiquiatras e equipes.",
    keywords: [
      "EmotiveCare Clínicas",
      "software para psicólogos",
      "software para psiquiatras",
      "CRM clínica psicologia",
      "IA clínica saúde mental",
      "teleconsulta psiquiatria",
      "prontuário eletrônico psicologia",
      "síntese clínica IA",
    ],
  },
  en: {
    title: "Clinics — CRM, teleconsult, and AI for psychologists and psychiatrists",
    description:
      "EmotiveCare Clinics: clinical features with reviewable AI — patient CRM, scheduling, teleconsult, notes, consents, reminders, care plans, and SENTIO AI syntheses. Built for psychologists, psychiatrists, and care teams.",
    keywords: [
      "EmotiveCare Clinics",
      "software for psychologists",
      "software for psychiatrists",
      "psychology clinic CRM",
      "clinical AI mental health",
    ],
  },
  es: {
    title: "Clínicas — CRM, teleconsulta e IA para psicólogos y psiquiatras",
    description:
      "EmotiveCare Clínicas: funciones clínicas con IA revisable — CRM, agenda, teleconsulta, historial, consentimientos, recordatorios, plan de cuidado y síntesis SENTIO AI. Hecho para psicólogos, psiquiatras y equipos.",
    keywords: [
      "EmotiveCare Clínicas",
      "software para psicólogos",
      "software para psiquiatras",
      "CRM clínica de psicología",
      "IA clínica salud mental",
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = COPY[locale];
  return buildMarketingMetadata({
    title: copy.title,
    description: copy.description,
    path: "/clinicas",
    locale,
    keywords: copy.keywords,
  });
}

export default async function ClinicasPage() {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(locale, "/") },
          {
            name: dict.nav.clinics,
            path: localizedPath(locale, "/clinicas"),
          },
        ])}
      />
      <ClinicsView locale={locale} />
    </>
  );
}
