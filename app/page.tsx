import Link from "next/link";
import type { Metadata } from "next";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, medicalHomePageSchema } from "@/components/seo/schema";
import { faqEntries } from "@/lib/seo/faq";
import { DEFAULT_SITE_KEYWORDS, OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";

const HERO_TAGLINE =
  "Seu segundo cérebro emocional. Ele sente com você e lembra por você.";

export const metadata: Metadata = {
  title: "Seu segundo cérebro emocional",
  description:
    "A EmotiveCare é um diário de energia emocional com IA que lembra por você: entende o que você sente, conecta seus padrões ao longo do tempo e devolve reflexões personalizadas. Comece grátis.",
  alternates: { canonical: `${SITE_URL}/` },
  keywords: [
    ...DEFAULT_SITE_KEYWORDS,
    "segundo cérebro emocional",
    "diário emocional com IA",
    "diário de energia emocional",
    "memória emocional",
  ],
  openGraph: {
    url: SITE_URL,
    title: "EmotiveCare · Seu segundo cérebro emocional",
    description:
      "Um diário de energia emocional com IA que entende o que você escreve, conecta seus padrões e devolve reflexões feitas para a sua história. Ele sente com você e lembra por você.",
    images: [
      {
        url: `${SITE_URL}${OG_IMAGE_PATH}`,
        width: 1200,
        height: 630,
        alt: "EmotiveCare — seu segundo cérebro emocional",
      },
    ],
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "EmotiveCare · Seu segundo cérebro emocional",
    description:
      "Diário de energia emocional com IA que lembra por você e conecta seus padrões ao longo do tempo.",
  },
};

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Registre seu momento",
    text: "Escreva livremente e marque sua energia (0–100), humor, ansiedade e as emoções que está sentindo agora.",
  },
  {
    step: "2",
    title: "A IA entende",
    text: "Cada registro é analisado: a energia calculada, as emoções detectadas, a emoção oculta e a necessidade por trás do momento.",
  },
  {
    step: "3",
    title: "O segundo cérebro conecta",
    text: "Usando memória semântica, a EmotiveCare busca em todo o seu histórico os registros parecidos com o que você vive agora — mesmo os de semanas atrás.",
  },
  {
    step: "4",
    title: "Você recebe reflexões e ações",
    text: "Um resumo empático e uma ação de regulação concreta, sempre baseados na sua própria trajetória emocional.",
  },
] as const;

const FEATURES = [
  {
    title: "Diário de energia emocional",
    description:
      "Texto livre + nível de energia (0–100), humor, ansiedade, intensidade emocional e tags de emoções. Simples de registrar, rico de acompanhar.",
  },
  {
    title: "Análise emocional por IA",
    description:
      "Cada registro revela a energia calculada, as emoções detectadas, a emoção oculta, a emoção composta, a necessidade e o desejo do momento — com uma ação concreta e um resumo empático.",
  },
  {
    title: "Segundo cérebro emocional (RAG)",
    description:
      "Busca semântica com memória vetorial em todo o seu histórico. A cada conversa, o assistente traz os registros realmente relevantes ao que você sente agora.",
  },
  {
    title: "Assistente emocional seguro",
    description:
      "Focado só em emoções, humor, energia, ansiedade, relacionamentos e autocuidado — com camadas de proteção (guardrails) e sugestão de ajuda profissional em sofrimento intenso. Não é um ChatGPT genérico.",
  },
  {
    title: "Resumo semanal",
    description:
      "Sua energia média, a tendência da semana (subindo, estável ou descendo), as emoções mais frequentes e as principais necessidades do período.",
  },
  {
    title: "Tracking de bem-estar",
    description:
      "Acompanhe sono, estresse, socialização, motivação e burnout ao longo do tempo e enxergue como cada um influencia sua energia.",
  },
  {
    title: "Modo Cuidado (para psicólogos)",
    description:
      "Convites para acompanhar pacientes que escolhem compartilhar sua evolução — apoio contínuo entre uma sessão e outra.",
  },
] as const;

const AUDIENCES = [
  {
    eyebrow: "Para você",
    title: "Para quem quer se entender melhor",
    text: "Pessoas que buscam compreender as próprias emoções, reduzir ansiedade e burnout e construir autoconhecimento no seu próprio ritmo — sem julgamento e sem pressa.",
    bullets: [
      "Um diário que devolve significado, não só armazena texto",
      "Reflexões baseadas na sua história, não em respostas prontas",
      "Acompanhamento leve da sua energia, sono e estresse",
    ],
  },
  {
    eyebrow: "Para psicólogos",
    title: "Para quem cuida de outras pessoas",
    text: "Profissionais que querem acompanhar pacientes entre as sessões. Com o Modo Cuidado, você recebe convites para acompanhar quem escolhe compartilhar a própria evolução.",
    bullets: [
      "Convites seguros e controlados pelo paciente",
      "Contexto contínuo para enriquecer a escuta",
      "Complementa a prática clínica — nunca a substitui",
    ],
  },
] as const;

const SECURITY = [
  {
    title: "Não substitui terapia",
    description:
      "A EmotiveCare é uma ferramenta de autoconhecimento e apoio. Ele não faz diagnóstico nem promete cura e, em momentos de sofrimento intenso, sugere buscar ajuda profissional.",
  },
  {
    title: "Assistente com guardrails",
    description:
      "A conversa é focada exclusivamente em emoções, humor, energia, ansiedade, relacionamentos e autocuidado, com camadas de proteção que mantêm o cuidado no centro.",
  },
  {
    title: "Seus dados são seus (LGPD)",
    description:
      "Você decide o que registrar, o que revisar com a IA e o que compartilhar. Privacidade e cuidado com os dados seguem a LGPD.",
  },
] as const;

const PLANS = [
  {
    name: "Essencial",
    price: "Grátis",
    tagline: "Para começar a se entender.",
    features: [
      "Diário de energia emocional",
      "Análise emocional por IA",
      "Resumo semanal",
    ],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Pleno",
    price: "Assinatura",
    tagline: "O segundo cérebro no seu bolso.",
    features: [
      "Tudo do Essencial",
      "Assistente emocional com memória do seu histórico (RAG)",
      "Tracking completo de sono, estresse e burnout",
      "Compartilhamento com um profissional de confiança",
    ],
    cta: "Quero o Pleno",
    highlighted: true,
  },
  {
    name: "Cuidado",
    price: "Para psicólogos",
    tagline: "Acompanhe seus pacientes.",
    features: [
      "Modo Cuidado com convites para pacientes",
      "Acompanhamento contínuo entre sessões",
      "Dashboards dedicados ao profissional",
    ],
    cta: "Sou psicólogo(a)",
    highlighted: false,
  },
] as const;

export default function Home() {
  return (
    <>
      <JsonLd data={[medicalHomePageSchema(), faqSchema(faqEntries)]} />
      <div className="flex flex-col min-h-full">
        <header>
          <nav
            aria-label="Navegação principal da EmotiveCare"
            className="relative z-10 flex items-center justify-between gap-3 px-4 sm:px-8 py-4 sm:py-6 max-w-6xl mx-auto w-full min-h-[4rem] sm:min-h-[5rem]"
          >
            {/* Logo compacto no mobile, completo a partir de sm */}
            <div className="sm:hidden shrink-0">
              <AnimaLogo href="/" size="sm" />
            </div>
            <div className="hidden sm:block shrink-0">
              <AnimaLogo href="/" size="header" showWordmark />
            </div>
            <div className="flex items-center gap-2 sm:gap-4 justify-end">
              <a
                href="#como-funciona"
                className="hidden md:inline text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
              >
                Como funciona
              </a>
              <a
                href="#segundo-cerebro"
                className="hidden md:inline text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
              >
                Segundo cérebro
              </a>
              <a
                href="#planos"
                className="hidden md:inline text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
              >
                Planos
              </a>
              <Link
                href="/login"
                className="text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-full text-sm font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-[var(--anima-glow)]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
                }}
              >
                Começar grátis
              </Link>
            </div>
          </nav>
        </header>

        <main id="main-content" role="main" className="flex flex-col flex-1">
          {/* HERO */}
          <section
            aria-labelledby="hero-heading"
            className="relative flex flex-col items-center justify-center pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 text-center overflow-hidden"
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl pointer-events-none"
              style={{ backgroundColor: "var(--anima-violet)" }}
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none animate-gentle-float"
              style={{ backgroundColor: "var(--anima-lilac)" }}
              aria-hidden="true"
            />

            <p className="relative text-xs sm:text-sm font-medium uppercase tracking-widest text-anima-violet/80 mb-4">
              Diário de energia emocional com IA
            </p>
            <h1
              id="hero-heading"
              className="relative text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground/90 mb-4 max-w-4xl"
            >
              Seu segundo cérebro emocional.
            </h1>
            <div className="relative w-12 h-0.5 rounded-full bg-gradient-to-r from-anima-violet to-anima-lilac mb-6" />
            <p className="relative text-base sm:text-lg text-foreground/50 max-w-2xl leading-relaxed mb-4">
              A EmotiveCare entende o que você escreve, conecta seus padrões ao longo
              do tempo e devolve reflexões feitas para a sua história — não
              respostas prontas.
            </p>
            <p className="relative text-sm text-foreground/35 max-w-xl leading-relaxed mb-8 italic">
              &ldquo;Ele sente com você e lembra por você.&rdquo;
            </p>
            <div className="relative flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:shadow-[var(--anima-glow)] hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
                }}
              >
                Começar grátis
              </Link>
              <a
                href="#como-funciona"
                className="px-8 py-3 rounded-full text-sm font-semibold text-foreground/70 border border-foreground/10 hover:border-anima-violet/30 hover:text-anima-violet transition-colors"
              >
                Ver como funciona
              </a>
            </div>
            <p className="relative text-xs text-foreground/30 mt-6">
              Grátis para começar · Sem cartão · Seus dados são seus (LGPD)
            </p>
          </section>

          {/* COMO FUNCIONA */}
          <section
            id="como-funciona"
            className="py-14 px-4 bg-foreground/[0.02] border-t border-foreground/[0.04] scroll-mt-20"
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-3">
                Como a EmotiveCare funciona
              </h2>
              <p className="text-sm text-foreground/40 text-center max-w-lg mx-auto mb-10">
                Do registro do momento à reflexão personalizada — em quatro
                passos simples.
              </p>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {HOW_IT_WORKS.map((item) => (
                  <li key={item.step} className="glass-panel p-6">
                    <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-anima-violet/15 text-sm font-bold text-anima-violet mb-4">
                      {item.step}
                    </span>
                    <h3 className="text-base font-semibold text-foreground/80 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/40 leading-relaxed">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* DESTAQUE: SEGUNDO CÉREBRO EMOCIONAL */}
          <section
            id="segundo-cerebro"
            className="relative py-16 sm:py-20 px-4 border-t border-foreground/[0.04] overflow-hidden scroll-mt-20"
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
              style={{ backgroundColor: "var(--anima-indigo)" }}
              aria-hidden="true"
            />
            <div className="relative max-w-4xl mx-auto text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-anima-violet mb-3">
                O diferencial da EmotiveCare
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground/90 mb-5">
                Um diário comum esquece. A EmotiveCare lembra.
              </h2>
              <p className="text-sm sm:text-base text-foreground/50 leading-relaxed max-w-2xl mx-auto mb-12">
                A maioria dos apps guarda seus textos e os deixa soltos, um dia
                sem falar com o outro. A EmotiveCare organiza suas emoções por{" "}
                <strong className="text-foreground/70 font-semibold">
                  significado
                </strong>
                , não por data. Quando você conversa com o assistente, ele busca
                no seu histórico — com memória semântica — os momentos parecidos
                com o de agora e conecta pontos que até você já tinha esquecido.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                <div className="glass-panel p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-3">
                    Um diário comum
                  </p>
                  <p className="text-sm text-foreground/55 leading-relaxed">
                    Você registra que está ansioso hoje. O texto é salvo,
                    isolado — e ninguém liga esse dia a nenhum outro. Semana que
                    vem, você começa do zero.
                  </p>
                </div>
                <div
                  className="glass-panel p-6 sm:p-7 emotion-glow"
                  style={{ borderColor: "var(--anima-violet)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-anima-violet mb-3">
                    Com a EmotiveCare
                  </p>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    &ldquo;Há 3 semanas você sentiu algo parecido, também na
                    véspera de uma reunião. Naquele dia, respirar antes de
                    começar te ajudou.&rdquo; A EmotiveCare lembra por você.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FUNCIONALIDADES */}
          <section
            id="funcionalidades"
            className="py-16 px-4 bg-foreground/[0.02] border-t border-foreground/[0.04] scroll-mt-20"
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-3">
                Tudo o que a EmotiveCare faz por você
              </h2>
              <p className="text-sm text-foreground/40 text-center max-w-2xl mx-auto mb-10">
                Mais que um diário: um sistema completo de autoconhecimento
                emocional.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((feature) => (
                  <div key={feature.title} className="glass-panel p-6">
                    <h3 className="text-base font-semibold text-foreground/80 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-foreground/40 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PARA QUEM É */}
          <section
            id="para-quem-e"
            className="py-16 px-4 border-t border-foreground/[0.04] scroll-mt-20"
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-10">
                Para quem é a EmotiveCare
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {AUDIENCES.map((audience) => (
                  <div key={audience.title} className="glass-panel p-8">
                    <p className="text-xs font-medium uppercase tracking-widest text-anima-violet mb-3">
                      {audience.eyebrow}
                    </p>
                    <h3 className="text-xl font-bold text-foreground/90 mb-3">
                      {audience.title}
                    </h3>
                    <p className="text-sm text-foreground/45 leading-relaxed mb-6">
                      {audience.text}
                    </p>
                    <div className="flex flex-col gap-2.5">
                      {audience.bullets.map((bullet) => (
                        <div
                          key={bullet}
                          className="flex gap-3 text-sm text-foreground/60 items-start"
                        >
                          <span className="text-anima-violet mt-0.5">✓</span>
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PRIVACIDADE E SEGURANÇA */}
          <section
            id="seguranca"
            className="py-16 px-4 bg-foreground/[0.02] border-t border-foreground/[0.04] scroll-mt-20"
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-3">
                Cuidado de verdade começa com segurança
              </h2>
              <p className="text-sm text-foreground/40 text-center max-w-2xl mx-auto mb-10">
                Transparência sobre o que a EmotiveCare é — e o que ele não é.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {SECURITY.map((item) => (
                  <div key={item.title} className="glass-panel p-6">
                    <h3 className="text-base font-semibold text-foreground/80 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/40 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PLANOS */}
          <section
            id="planos"
            className="py-16 px-4 border-t border-foreground/[0.04] scroll-mt-20"
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-3">
                Planos para cada momento
              </h2>
              <p className="text-sm text-foreground/40 text-center max-w-lg mx-auto mb-10">
                Comece grátis e evolua quando fizer sentido para você.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
                {PLANS.map((plan) => (
                  <div
                    key={plan.name}
                    className={`glass-panel p-7 flex flex-col ${
                      plan.highlighted ? "emotion-glow" : ""
                    }`}
                    style={
                      plan.highlighted
                        ? { borderColor: "var(--anima-violet)" }
                        : undefined
                    }
                  >
                    {plan.highlighted && (
                      <span className="self-start mb-3 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-anima-violet to-anima-indigo">
                        Mais completo
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-foreground/90">
                      {plan.name}
                    </h3>
                    <p className="text-2xl font-bold text-anima-violet mt-1 mb-1">
                      {plan.price}
                    </p>
                    <p className="text-xs text-foreground/40 mb-5">
                      {plan.tagline}
                    </p>
                    <div className="flex flex-col gap-2.5 mb-6 flex-1">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex gap-2.5 text-sm text-foreground/55 items-start"
                        >
                          <span className="text-anima-violet mt-0.5">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/register"
                      className={`text-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                        plan.highlighted
                          ? "text-white hover:shadow-lg hover:shadow-[var(--anima-glow)]"
                          : "text-foreground/70 border border-foreground/10 hover:border-anima-violet/30 hover:text-anima-violet"
                      }`}
                      style={
                        plan.highlighted
                          ? {
                              background:
                                "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
                            }
                          : undefined
                      }
                    >
                      {plan.cta}
                    </Link>
                  </div>
                ))}
              </div>
              <p className="text-xs text-foreground/30 text-center mt-8 max-w-xl mx-auto">
                Você encontra os detalhes e valores de cada plano na página de{" "}
                <Link
                  href="/plans"
                  prefetch={false}
                  className="text-anima-violet hover:text-anima-lilac transition-colors"
                >
                  Planos
                </Link>
                .
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section
            id="faq"
            className="py-16 px-4 bg-foreground/[0.02] border-t border-foreground/[0.04] scroll-mt-20"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-10">
                Perguntas frequentes
              </h2>
              <div className="flex flex-col gap-4">
                {faqEntries.map((entry) => (
                  <details
                    key={entry.question}
                    className="glass-panel p-6 group"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none text-base font-semibold text-foreground/80">
                      {entry.question}
                      <span className="text-anima-violet transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="text-sm text-foreground/45 leading-relaxed mt-4">
                      {entry.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA FINAL */}
          <section className="py-16 px-4 text-center border-t border-foreground/[0.04]">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-foreground/85 mb-3">
                Comece a se entender melhor hoje
              </h2>
              <p className="text-sm text-foreground/40 mb-6 leading-relaxed">
                Grátis para começar. {HERO_TAGLINE}
              </p>
              <Link
                href="/register"
                className="inline-block px-8 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:shadow-[var(--anima-glow)] hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
                }}
              >
                Começar grátis
              </Link>
              <p className="mt-6">
                <Link
                  href="/login"
                  className="text-sm text-anima-violet hover:text-anima-lilac transition-colors"
                >
                  Já tenho conta — entrar →
                </Link>
              </p>
            </div>
          </section>
        </main>

        <footer
          className="py-8 text-center border-t border-foreground/[0.04]"
          role="contentinfo"
        >
          <p className="text-xs text-foreground/30 max-w-lg mx-auto leading-relaxed px-4 mb-3">
            <strong className="text-foreground/40 font-semibold">EmotiveCare</strong>{" "}
            · seu segundo cérebro emocional. Uma ferramenta de autoconhecimento e
            apoio — não substitui avaliação, diagnóstico ou tratamento clínico.
            Produto desenvolvido por{" "}
            <strong className="text-foreground/40 font-semibold">
              MutterCorp
            </strong>
            .
          </p>
          <p className="text-[10px] text-foreground/25 px-4">
            Ele sente com você e lembra por você.
          </p>
          <nav
            aria-label="Links rápidos do rodapé"
            className="mt-6 flex flex-wrap justify-center gap-4 text-[11px] font-medium text-foreground/35"
          >
            <Link
              href="/about"
              prefetch={false}
              className="hover:text-anima-violet transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/plans"
              prefetch={false}
              className="hover:text-anima-violet transition-colors"
            >
              Planos
            </Link>
            <Link
              href="/faq"
              prefetch={false}
              className="hover:text-anima-violet transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/blog"
              prefetch={false}
              className="hover:text-anima-violet transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/privacy"
              prefetch={false}
              className="hover:text-anima-violet transition-colors"
            >
              Privacidade
            </Link>
            <Link
              href="/terms"
              prefetch={false}
              className="hover:text-anima-violet transition-colors"
            >
              Termos
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
