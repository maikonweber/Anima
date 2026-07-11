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
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Início", path: "/" },
          { name: "Psicólogos", path: "/psychologists" },
        ])}
      />
      <MarketingChrome>
        <article>
          <h1 className="text-3xl font-bold text-foreground/90 mb-6">
            EmotiveCare para profissionais
          </h1>
          <p className="text-sm text-foreground/55 leading-relaxed mb-6">
            Entre sessões, o contexto emocional do paciente costuma se perder.
            Com o{" "}
            <strong className="text-foreground/75 font-semibold">
              Modo Cuidado
            </strong>
            , a EmotiveCare oferece dashboards em modo leitura, tendências de
            energia e resumos estruturados — somente quando o paciente convida
            você conscientemente.
          </p>

          <section aria-labelledby="como-funciona-prof" className="mb-10">
            <h2
              id="como-funciona-prof"
              className="text-xl font-semibold text-foreground/82 mb-3"
            >
              Como funciona na prática
            </h2>
            <ol className="list-decimal ps-6 space-y-2 text-sm text-foreground/55">
              <li>O paciente registra emoções e energia no diário.</li>
              <li>Ele envia um convite seguro para o profissional.</li>
              <li>
                Você acompanha a evolução em painéis dedicados (somente leitura).
              </li>
              <li>
                O paciente pode pausar ou revogar o acesso a qualquer momento.
              </li>
            </ol>
          </section>

          <section aria-labelledby="para-quem-prof" className="mb-10">
            <h2
              id="para-quem-prof"
              className="text-xl font-semibold text-foreground/82 mb-3"
            >
              Ideal para
            </h2>
            <ul className="list-disc ps-6 text-sm text-foreground/55 space-y-2">
              <li>Psicólogos(as) em atendimento continuado;</li>
              <li>
                Profissionais que querem enriquecer a pré-consulta com contexto
                longitudinal;
              </li>
              <li>
                Clínicas que precisam de acompanhamento digital moderado, com
                consentimento explícito.
              </li>
            </ul>
          </section>

          <section aria-labelledby="limites-eticos" className="mb-10">
            <h2
              id="limites-eticos"
              className="text-xl font-semibold text-foreground/82 mb-3"
            >
              Limites éticos
            </h2>
            <p className="text-sm text-foreground/55 leading-relaxed">
              A SENTIO AI sintetiza o que o paciente registrou; a interpretação
              clínica continua sendo sua. A plataforma não diagnostica, não
              prescreve e não substitui a escuta. Leia também o artigo{" "}
              <Link
                href="/blog/como-profissionais-usam-dashboard-terapeutico"
                className="text-anima-violet hover:underline"
              >
                Como psicólogos usam o dashboard entre sessões
              </Link>
              .
            </p>
          </section>

          <nav
            aria-label="Fluxo profissional"
            className="flex flex-wrap gap-4 font-medium text-anima-violet"
          >
            <Link href="/register" className="hover:underline">
              Começar como profissional
            </Link>
            <Link href="/plans" className="hover:underline">
              Ver plano Cuidado
            </Link>
            <Link href="/faq" className="hover:underline">
              FAQ
            </Link>
          </nav>
        </article>
      </MarketingChrome>
    </>
  );
}
