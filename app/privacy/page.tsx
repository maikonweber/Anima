import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { DEFAULT_SITE_KEYWORDS, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Privacidade e tratamento de dados",
  description:
    "Visão institucional do compromisso com privacidade, consentimento para compartilhamento entre pacientes e profissionais, e papel da SENTIO AI.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [...DEFAULT_SITE_KEYWORDS, "privacidade", "LGPD", "HIPAA mindset"],
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbListSchema([
        { name: "Início", path: "/" },
        { name: "Privacidade", path: "/privacy" },
      ])} />
      <MarketingChrome>
        <article className="prose-marketing space-y-5 text-sm text-foreground/55 leading-relaxed">
          <h1 className="text-3xl font-bold text-foreground/90">Privacidade</h1>
          <p>
            A EmotiveCare centraliza registros delicados sobre emoções, energia relatada,
            marcações médicas cotidianas (como hábitos) e texto livre opcionalmente
            compartilhado com prestadores quando autorizado pelo paciente.
          </p>
          <section aria-labelledby="p-dados-minimos">
            <h2 id="p-dados-minimos" className="text-lg font-semibold text-foreground/82 mb-3">
              Dados sob seu controle
            </h2>
            <p>
              Você decide o nível de detalhes, etiquetas ou metadados. Profissionais
              convidados enxergam apenas o combinado através de convites e podem ver
              acesso pausado ou revogado imediatamente.
            </p>
          </section>
          <section aria-labelledby="p-ia">
            <h2 id="p-ia" className="text-lg font-semibold text-foreground/82 mb-3">
              SENTIO AI</h2>
            <p>
              Os insights automatizados partem apenas do que você já escolheu alimentar
              sistemicamente dentro do app — sem diagnóstico prometendo cura automatizada,
              apenas reflexões contextualizadas.
            </p>
          </section>
          <address className="not-italic text-xs text-foreground/40 mt-12">
            Documentação contratual detalhada pode ser atualizada assim que o time jurídico publicar políticas versionadas.
          </address>
        </article>
      </MarketingChrome>
    </>
  );
}
