import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Contato com o time da EmotiveCare",
  description:
    "Canais oficiais de contato MutterCorp e EmotiveCare para suporte, parcerias e imprensa.",
  path: "/contact",
  keywords: ["contato", "suporte EmotiveCare"],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbListSchema([
        { name: "Início", path: "/" },
        { name: "Contato", path: "/contact" },
      ])} />
      <MarketingChrome>
        <article>
          <h1 className="text-3xl font-bold text-foreground/90 mb-6">Contato</h1>
          <p className="text-sm text-foreground/55 mb-10 leading-relaxed">
            Você já pode iniciar usando o formulário dentro do próprio aplicativo após criar conta.
            Para parcerias, imprensa e privacidade, utilize os endereços oficiais configurados pela
            MutterCorp.
          </p>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-foreground/78">Empresa titular</dt>
              <dd className="text-foreground/55">MutterCorp — infraestrutura EmotiveCare &amp; SENTIO AI.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground/78">Suporte segurança</dt>
              <dd className="text-foreground/55">
                Veja arquivo público{" "}
                <code className="text-[11px] text-anima-violet">/.well-known/security.txt</code>
              </dd>
            </div>
          </dl>
          <address className="mt-12 not-italic text-xs text-foreground/40">
            Esta página apenas consolida contatos institucionais; não há coleta nesta rota.
          </address>
        </article>
      </MarketingChrome>
    </>
  );
}
