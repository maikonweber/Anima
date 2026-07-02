import Link from "next/link";
import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Psicólogos — dashboard emocional entre sessões",
  description:
    "Dashboard emocional inteligente para acompanhamento terapêutico e evolução emocional de pacientes — compartilhado apenas com consentimento.",
  path: "/psychologists",
  keywords: ["psicólogo online", "pré-consulta", "dashboard longitudinal"],
});

export default function PsychologistsPage() {
  return (
    <>
      <JsonLd data={breadcrumbListSchema([
        { name: "Início", path: "/" },
        { name: "Psicólogos", path: "/psychologists" },
      ])} />
      <MarketingChrome>
        <article>
          <h1 className="text-3xl font-bold text-foreground/90 mb-6">
            EmotiveCare para profissionais
          </h1>
          <p className="text-sm text-foreground/55 leading-relaxed mb-6">
            A EmotiveCare oferece dashboards em modo leitura, alertas estruturais sobre
            padrões e sugestões pré-consulta que aceleram contextualização quando o
            paciente convida você conscientemente para acompanhar a jornada.
          </p>
          <section aria-labelledby="para-quem-prof" className="mb-10">
            <h2 id="para-quem-prof" className="text-xl font-semibold text-foreground/82 mb-3">
              Ideal para...
            </h2>
            <ul className="list-disc ps-6 text-sm text-foreground/55 space-y-2">
              <li>Profissionais de psicologia em atendimento continuado;</li>
              <li>Mentores/as de saúde emocional com protocolos escritos claros;</li>
              <li>Equipes de clínicas com necessidade moderada de acompanhamento digital.</li>
            </ul>
          </section>
          <nav aria-label="Fluxo profissional" className="flex flex-wrap gap-4 font-medium text-anima-violet">
            <Link href="/register" className="hover:underline">
              Começar agora como profissional
            </Link>
            <Link href="/plans" className="hover:underline">
              Ler planos
            </Link>
          </nav>
        </article>
      </MarketingChrome>
    </>
  );
}
