import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { DEFAULT_SITE_KEYWORDS, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Termos de uso institucional",
  description:
    "Termos institucionais resumindo limites de uso clínico, responsabilidades do usuário e da empresa MutterCorp pela EmotiveCare.",
  alternates: { canonical: `${SITE_URL}/terms` },
  keywords: [...DEFAULT_SITE_KEYWORDS, "termos de uso", "responsabilidade"],
};

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbListSchema([
        { name: "Início", path: "/" },
        { name: "Termos", path: "/terms" },
      ])} />
      <MarketingChrome>
        <article className="space-y-6 text-sm text-foreground/55 leading-relaxed">
          <h1 className="text-3xl font-bold text-foreground/90">
            Termos de uso — visão inicial
          </h1>
          <p>
            O objetivo desses termos prévios é alinhar expectativas: a EmotiveCare é um
            software de apoio a rotinas conscientes — não garante tratamento automatizado nem
            resultados médicos garantidos fora dos canais especializados.
          </p>
          <section aria-labelledby="terms-permitido">
            <h2 id="terms-permitido" className="text-lg font-semibold text-foreground/82 mb-3">
              Uso permitido
            </h2>
            <ul className="list-disc ps-6 space-y-2">
              <li>Registrar emoções pessoais e metadados de bem-estar subjetivos;</li>
              <li>Analisar padrões com IA como suporte reflexivo sob consentimento próprio;</li>
              <li>Compartilhar visões sintetizadas com profissionais de confiança via convites.</li>
            </ul>
          </section>
          <address className="not-italic text-xs text-foreground/40 mt-12">
            Uma política jurídica completa será publicada com versionamento assim que disponível pela MutterCorp.
          </address>
        </article>
      </MarketingChrome>
    </>
  );
}
