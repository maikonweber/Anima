import Link from "next/link";
import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { DEFAULT_SITE_KEYWORDS, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Planos para acompanhamento emocional inteligente",
  description:
    "Conheça os planos da EmotiveCare para acompanhamento emocional inteligente.",
  alternates: { canonical: `${SITE_URL}/plans` },
  keywords: [...DEFAULT_SITE_KEYWORDS, "planos", "pricing saúde emocional", "benefícios digitais"],
};

export default function PlansPage() {
  return (
    <>
      <JsonLd data={breadcrumbListSchema([
        { name: "Início", path: "/" },
        { name: "Planos", path: "/plans" },
      ])} />
      <MarketingChrome>
        <article>
          <h1 className="text-3xl font-bold text-foreground/90 mb-6">Planos</h1>
          <p className="text-sm text-foreground/55 leading-relaxed mb-8">
            Os planos{" "}
            <strong className="text-foreground/75 font-semibold">Essencial</strong>
            ,{" "}
            <strong className="text-foreground/75 font-semibold">Pleno</strong>{" "}
            e{" "}
            <strong className="text-foreground/75 font-semibold">Cuidado</strong>{" "}
            combinam diferentes volumes de registros mensais, insights SENTIO AI,
            tempo de histórico disponível e compartilhamento com profissionais.
            Ao entrar na aplicação, você encontra os limites atualizados e checkout
            seguro via provedor oficial.
          </p>
          <section aria-labelledby="planos-ai" className="mb-8">
            <h2 id="planos-ai" className="text-xl font-semibold text-foreground/82 mb-3">
              Pergunta frequente sobre planos &amp; IA
            </h2>
            <p className="text-sm text-foreground/55 leading-relaxed">
              Você sempre controla quando rodar novos insights, quem pode ver suas
              informações compartilhadas e até quando manter registros públicos apenas
              para você mesmo.
            </p>
          </section>
          <nav aria-label="Ações de conta" className="flex flex-wrap gap-4 font-medium text-anima-violet">
            <Link href="/register" className="hover:underline">
              Começar agora
            </Link>
            <Link href="/login" className="hover:underline">
              Já sou usuário · Entrar
            </Link>
            <Link href="/faq" className="hover:underline">
              Ver FAQs
            </Link>
          </nav>
          <p className="mt-10 text-xs text-foreground/40 leading-relaxed">
            Usuários autenticados acessam a área oficial de cobrança e mudanças de plano dentro do app.
          </p>
        </article>
      </MarketingChrome>
    </>
  );
}
