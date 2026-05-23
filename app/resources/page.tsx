import Link from "next/link";
import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { DEFAULT_SITE_KEYWORDS, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Recursos sobre saúde emocional e IA responsável",
  description:
    "Guia rápido de recursos externos e internos da EmotiveCare para autoconhecimento, burnout, ansiedade e wellness emocional.",
  alternates: { canonical: `${SITE_URL}/resources` },
  keywords: [...DEFAULT_SITE_KEYWORDS, "recursos de saúde mental", "kits de autocuidado"],
};

export default function ResourcesPage() {
  return (
    <>
      <JsonLd data={breadcrumbListSchema([
        { name: "Início", path: "/" },
        { name: "Recursos", path: "/resources" },
      ])} />
      <MarketingChrome>
        <article>
          <h1 className="text-3xl font-bold text-foreground/90 mb-6">Recursos</h1>
          <p className="text-sm text-foreground/55 leading-relaxed mb-10">
            Conteúdo editorial em construção. Enquanto isso, reforçamos as melhores
            práticas de registro emocional: escreva com frequência gentil para si,
            procure profissionais em momentos delicados e use a tecnologia apenas como
            apoio consciente.
          </p>
          <nav aria-label="Explore conteúdo" className="space-y-3 text-anima-violet font-medium">
            <p>
              <Link href="/blog" className="hover:underline">
                Ir para artigos preparados para IA search
              </Link>
            </p>
            <p>
              <Link href="/faq" className="hover:underline">
                Esclarecer dúvidas na FAQ institucional
              </Link>
            </p>
          </nav>
        </article>
      </MarketingChrome>
    </>
  );
}
