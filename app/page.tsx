import Link from "next/link";
import { BASE_EMOTIONS } from "@/lib/emotion/base-emotions";
import { BLEND_DEFINITIONS } from "@/lib/emotion/blends";

const SHOWCASE_BLENDS = BLEND_DEFINITIONS.slice(0, 4);
const EMOTION_LIST = Object.values(BASE_EMOTIONS);

const PATIENT_FEATURES = [
  {
    title: "Diário emocional estruturado",
    description:
      "Registros com nível de energia, emoções-base e combinações — um vocabulário claro para nomear o que se sente entre as sessões.",
    icon: "diary",
  },
  {
    title: "IA emocional",
    description:
      "Análises que ajudam o paciente a refletir sobre padrões e gatilhos. Ferramenta de apoio, não substitui o trabalho clínico.",
    icon: "sparkles",
  },
  {
    title: "Mapa emocional",
    description:
      "Visualização das combinações de emoções para explorar camadas de sentimento ao longo do tempo.",
    icon: "map",
  },
  {
    title: "Resumo semanal",
    description:
      "Visão consolidada da semana para retomar o processo terapêutico com mais contexto na consulta.",
    icon: "chart",
  },
] as const;

const PROFESSIONAL_FEATURES = [
  {
    title: "Convite por e-mail",
    description:
      "O paciente convida você com um link seguro. Você aceita o convite e passa a acompanhar apenas o que foi autorizado.",
  },
  {
    title: "Dashboard compartilhado",
    description:
      "Resumo semanal, histórico de registros e detalhes do diário em modo somente leitura — sem expor dados além do consentimento.",
  },
  {
    title: "Lista de pacientes",
    description:
      "Centralize o acompanhamento de quem compartilhou o diário. Ideal para clínicas e consultórios com volume moderado.",
  },
  {
    title: "Plano Cuidado",
    description:
      "Até 25 pacientes com dashboard, pensado para psicólogos e outros profissionais que acompanham processos terapêuticos.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <span className="text-lg font-bold tracking-tight text-foreground/90">
          Anima
        </span>
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#para-psicologos"
            className="hidden sm:inline text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            Para psicólogos
          </a>
          <Link
            href="/login"
            className="text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-full text-sm font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-[var(--anima-glow)]"
            style={{
              background:
                "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
            }}
          >
            Começar agora
          </Link>
        </div>
      </nav>

      <header className="relative flex flex-col items-center justify-center pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 text-center overflow-hidden">
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
          Diário de energia emocional
        </p>
        <h1 className="relative text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground/90 mb-4 max-w-4xl">
          Continuidade emocional entre uma sessão e outra
        </h1>
        <div className="relative w-12 h-0.5 rounded-full bg-gradient-to-r from-anima-violet to-anima-lilac mb-6" />
        <p className="relative text-base sm:text-lg text-foreground/50 max-w-2xl leading-relaxed mb-4">
          O Anima é uma plataforma para registrar, nomear e refletir sobre
          sentimentos no dia a dia — com apoio de IA e, quando o paciente
          autoriza, compartilhamento seguro com psicólogos e profissionais de
          saúde mental.
        </p>
        <p className="relative text-sm text-foreground/35 max-w-xl leading-relaxed mb-8">
          Para quem está em terapia: um diário guiado que fortalece o
          autoconhecimento. Para quem acompanha: visibilidade ética do processo,
          sem substituir a escuta clínica.
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
            Criar conta gratuita
          </Link>
          <a
            href="#para-psicologos"
            className="px-8 py-3 rounded-full text-sm font-semibold text-foreground/70 border border-foreground/10 hover:border-anima-violet/30 hover:text-anima-violet transition-colors"
          >
            Sou psicólogo(a)
          </a>
        </div>
      </header>

      <section className="py-12 px-4 border-t border-foreground/[0.04]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground/85 mb-4">
            O que é o Anima
          </h2>
          <p className="text-sm sm:text-base text-foreground/45 leading-relaxed max-w-2xl mx-auto">
            Um produto completo de inteligência emocional: o paciente registra
            energia e emoções, recebe análises da IA e acompanha tendências no
            dashboard. Quando faz sentido no tratamento, convida o profissional
            para ver o mesmo resumo — sempre com consentimento explícito e
            acesso somente leitura. Você ganha material concreto para sessões;
            seu paciente ganha um ritual diário de cuidado consigo.
          </p>
        </div>
      </section>

      <section className="py-14 px-4 bg-foreground/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-3">
            Como funciona
          </h2>
          <p className="text-sm text-foreground/40 text-center max-w-lg mx-auto mb-10">
            Do registro individual ao acompanhamento profissional, em três
            passos.
          </p>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Paciente registra",
                text: "No app, registra energia, emoções e contexto. A IA sugere reflexões sobre o que foi escrito.",
              },
              {
                step: "2",
                title: "Evolução visível",
                text: "Resumo semanal, histórico e mapa emocional mostram padrões ao longo do tempo.",
              },
              {
                step: "3",
                title: "Compartilhamento opcional",
                text: "Com plano adequado, o paciente convida o psicólogo por e-mail. Você acessa dashboards autorizados.",
              },
            ].map((item) => (
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

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 mb-3">
            Suas emoções, em camadas
          </h2>
          <p className="text-sm sm:text-base text-foreground/40 max-w-lg mx-auto mb-10">
            O diário usa emoções-base que se combinam em sentimentos mais
            complexos — uma linguagem compartilhada entre paciente e terapeuta.
          </p>

          <div className="flex gap-3 flex-wrap justify-center mb-12">
            {EMOTION_LIST.map((emo) => (
              <div
                key={emo.id}
                className="flex items-center gap-2 glass-panel px-4 py-2.5"
                style={{ borderRadius: "9999px" }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: emo.color,
                    opacity: 0.75,
                    boxShadow: `0 0 10px ${emo.color}40`,
                  }}
                />
                <span className="text-sm font-medium text-foreground/60">
                  {emo.icon} {emo.name}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SHOWCASE_BLENDS.map((blend) => {
              const a = BASE_EMOTIONS[blend.a];
              const b = BASE_EMOTIONS[blend.b];
              return (
                <div
                  key={`${blend.a}-${blend.b}`}
                  className="glass-panel p-5 text-center"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{
                        backgroundColor: a.color,
                        opacity: 0.7,
                        boxShadow: `0 0 12px ${a.color}30`,
                      }}
                    />
                    <div
                      className="-ml-3 w-10 h-10 rounded-full"
                      style={{
                        backgroundColor: b.color,
                        opacity: 0.7,
                        boxShadow: `0 0 12px ${b.color}30`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-foreground/30 mb-1">
                    {a.name} + {b.name}
                  </p>
                  <p className="text-base font-semibold text-foreground/80">
                    {blend.composite.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-3">
            Para quem está em processo terapêutico
          </h2>
          <p className="text-sm text-foreground/40 text-center max-w-md mx-auto mb-10">
            Ferramentas pensadas para uso entre consultas, com privacidade e
            clareza emocional.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PATIENT_FEATURES.map((feature) => (
              <div key={feature.title} className="glass-panel p-6">
                <FeatureIcon name={feature.icon} />
                <h3 className="text-base font-semibold text-foreground/80 mb-2 mt-4">
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

      <section
        id="para-psicologos"
        className="py-16 px-4 scroll-mt-20 border-t border-foreground/[0.04]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel p-8 sm:p-10 mb-10 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-widest text-anima-violet mb-3">
              Anima Care
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-4">
              Para psicólogos e profissionais de saúde mental
            </h2>
            <p className="text-sm sm:text-base text-foreground/45 leading-relaxed max-w-3xl mb-4">
              O módulo de acompanhamento foi desenhado para ampliar sua visão
              clínica sem violar a autonomia do paciente. Ele mantém o diário;
              você recebe convite, aceita o vínculo e consulta resumos e
              registros compartilhados — nunca altera o conteúdo dele.
            </p>
            <p className="text-sm text-foreground/35 leading-relaxed max-w-3xl">
              Indicado para psicoterapia individual, acompanhamento
              psicopedagógico e outras práticas em que registros emocionais
              entre sessões enriquecem a intervenção. O plano{" "}
              <strong className="text-foreground/55 font-semibold">
                Cuidado
              </strong>{" "}
              permite gerenciar até 25 pacientes com dashboard dedicado.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {PROFESSIONAL_FEATURES.map((feature) => (
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <Link
              href="/register"
              className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:shadow-[var(--anima-glow)]"
              style={{
                background:
                  "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
              }}
            >
              Criar conta profissional
            </Link>
            <Link
              href="/login"
              className="text-sm text-anima-violet hover:text-anima-lilac transition-colors"
            >
              Já tenho conta — entrar →
            </Link>
          </div>
          <p className="text-xs text-foreground/30 text-center mt-6 max-w-xl mx-auto">
            O paciente precisa do plano Pleno para enviar convites. Profissionais
            usam o plano Cuidado para visualizar múltiplos dashboards. Detalhes
            em Planos após o login.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-foreground/85 mb-3">
            Comece hoje
          </h2>
          <p className="text-sm text-foreground/40 mb-6 leading-relaxed">
            Conta gratuita no plano Essencial. Evolua para Pleno ou Cuidado
            conforme sua necessidade — paciente, profissional ou ambos.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:shadow-[var(--anima-glow)] hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
            }}
          >
            Criar conta gratuita
          </Link>
        </div>
      </section>

      <footer className="py-8 text-center border-t border-foreground/[0.04]">
        <p className="text-xs text-foreground/30 max-w-md mx-auto leading-relaxed px-4">
          Anima — diário emocional com IA e acompanhamento profissional
          consentido. Não substitui avaliação, diagnóstico ou tratamento
          clínico.
        </p>
      </footer>
    </div>
  );
}

function FeatureIcon({ name }: { name: (typeof PATIENT_FEATURES)[number]["icon"] }) {
  const className = "w-6 h-6 text-anima-violet";
  const wrapper =
    "w-12 h-12 rounded-2xl bg-anima-violet/10 flex items-center justify-center";

  switch (name) {
    case "diary":
      return (
        <div className={wrapper}>
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </div>
      );
    case "sparkles":
      return (
        <div className={wrapper}>
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
      );
    case "map":
      return (
        <div className={wrapper}>
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
        </div>
      );
    case "chart":
      return (
        <div className={wrapper}>
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
      );
  }
}
