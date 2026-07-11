import Link from "next/link";
import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Planos para acompanhamento emocional inteligente",
  description:
    "Compare os planos Essencial, Pleno e Cuidado da EmotiveCare: volume de registros, insights SENTIO AI, histórico e compartilhamento com profissionais.",
  path: "/plans",
  keywords: ["planos", "pricing saúde emocional", "benefícios digitais"],
});

const PLANS = [
  {
    name: "Essencial",
    tagline: "Para começar a se entender.",
    points: [
      "Diário de energia emocional (texto, energia 0–100, humor e tags)",
      "Análise emocional com SENTIO AI por registro",
      "Resumo semanal da jornada emocional",
    ],
  },
  {
    name: "Pleno",
    tagline: "O segundo cérebro no seu bolso.",
    points: [
      "Tudo do Essencial",
      "Assistente emocional com memória semântica do histórico",
      "Tracking de sono, estresse, socialização e burnout",
      "Compartilhamento com um profissional de confiança",
    ],
  },
  {
    name: "Cuidado",
    tagline: "Para psicólogos e acompanhamento clínico.",
    points: [
      "Modo Cuidado com convites controlados pelo paciente",
      "Dashboards em modo leitura entre sessões",
      "Contexto longitudinal para enriquecer a escuta — sem substituí-la",
    ],
  },
] as const;

export default function PlansPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Início", path: "/" },
          { name: "Planos", path: "/plans" },
        ])}
      />
      <MarketingChrome>
        <article>
          <h1 className="text-3xl font-bold text-foreground/90 mb-4">
            Planos EmotiveCare
          </h1>
          <p className="text-sm text-foreground/55 leading-relaxed mb-10 max-w-2xl">
            Escolha o nível de acompanhamento que faz sentido agora. Você sempre
            controla o que registrar, quando pedir insights da SENTIO AI e quem
            pode ver informações compartilhadas. Limites e preços atualizados
            aparecem na área autenticada, com checkout seguro.
          </p>

          <div className="space-y-8 mb-12">
            {PLANS.map((plan) => (
              <section key={plan.name} aria-labelledby={`plan-${plan.name}`}>
                <h2
                  id={`plan-${plan.name}`}
                  className="text-xl font-semibold text-foreground/82 mb-1"
                >
                  {plan.name}
                </h2>
                <p className="text-sm text-foreground/45 mb-3">{plan.tagline}</p>
                <ul className="list-disc ps-6 space-y-2 text-sm text-foreground/55">
                  {plan.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <section aria-labelledby="planos-controle" className="mb-10">
            <h2
              id="planos-controle"
              className="text-xl font-semibold text-foreground/82 mb-3"
            >
              Controle, privacidade e IA responsável
            </h2>
            <p className="text-sm text-foreground/55 leading-relaxed mb-3">
              Nenhum plano transforma a EmotiveCare em terapia ou diagnóstico
              automático. A SENTIO AI descreve padrões a partir do que você
              registra; o compartilhamento com profissionais só ocorre com o seu
              consentimento e pode ser revogado.
            </p>
            <p className="text-sm text-foreground/55 leading-relaxed">
              Dúvidas frequentes estão na{" "}
              <Link href="/faq" className="text-anima-violet hover:underline">
                FAQ
              </Link>
              . Profissionais encontram o fluxo de convites em{" "}
              <Link
                href="/psychologists"
                className="text-anima-violet hover:underline"
              >
                EmotiveCare para psicólogos
              </Link>
              .
            </p>
          </section>

          <nav
            aria-label="Ações de conta"
            className="flex flex-wrap gap-4 font-medium text-anima-violet"
          >
            <Link href="/register" className="hover:underline">
              Começar agora
            </Link>
            <Link href="/login" className="hover:underline">
              Já sou usuário · Entrar
            </Link>
            <Link href="/blog" className="hover:underline">
              Ler o blog
            </Link>
          </nav>
        </article>
      </MarketingChrome>
    </>
  );
}
