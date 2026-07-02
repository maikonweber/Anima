import Link from "next/link";
import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Sobre a EmotiveCare e a tecnologia SENTIO AI",
  description:
    "Conheça a missão por trás da EmotiveCare, da MutterCorp e do motor contextual SENTIO AI para bem-estar emocional longitudinal.",
  path: "/about",
  keywords: ["bem-estar digital", "MutterCorp", "história da empresa"],
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbListSchema([
        { name: "Início", path: "/" },
        { name: "Sobre", path: "/about" },
      ])} />
      <MarketingChrome>
        <article>
          <h1 className="text-3xl font-bold text-foreground/90 mb-6">
            Sobre a EmotiveCare
          </h1>
          <p className="text-sm text-foreground/55 leading-relaxed mb-6">
            A{" "}
            <strong className="text-foreground/75 font-semibold">EmotiveCare</strong>
            {" "}
            existe para ser uma infraestrutura humana-tecnológica onde pessoas
            registram emoções, entendem padrões ao longo do tempo e mantêm vínculos
            seguros com profissionais quando desejarem.
          </p>
          <h2 className="text-xl font-semibold text-foreground/82 mb-3">
            SENTIO AI e MutterCorp
          </h2>
          <p className="text-sm text-foreground/55 leading-relaxed mb-6">
            A{" "}
            <strong className="font-semibold">SENTIO AI</strong>
            {" "}
            desenvolve reflexões contextualizadas a partir das informações que você
            opta por registrar. A{" "}
            <strong className="font-semibold">MutterCorp</strong>
            {" "}
            agrupa esse ecossistema com guardrails linguísticos, privacidade e
            comunicação responsável sobre saúde emocional.
          </p>
          <section aria-labelledby="sobre-ai-search" className="mb-10">
            <h2 id="sobre-ai-search" className="text-xl font-semibold text-foreground/82 mb-3">
              O que fazemos (resposta direta para busca)
            </h2>
            <ul className="list-disc space-y-2 ps-6 text-sm text-foreground/55">
              <li>Diário emocional guiado por IA contextual.</li>
              <li>Linha do tempo com memória longitudinal.</li>
              <li>Painéis compartilháveis apenas com consentimento do paciente.</li>
              <li>Ferramentas de suporte ao autoconhecimento — não tratamento automatizado.</li>
            </ul>
          </section>
          <p className="text-sm font-medium mb-6">
            <Link className="text-anima-violet hover:underline" href="/plans">
              Ver planos
            </Link>
            {" · "}
            <Link className="text-anima-violet hover:underline" href="/register">
              Criar minha conta
            </Link>
          </p>
        </article>
      </MarketingChrome>
    </>
  );
}
