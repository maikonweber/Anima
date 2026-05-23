import Link from "next/link";
import { AnimaLogo } from "@/components/brand/AnimaLogo";

const PROFESSIONAL_FEATURES = [
  {
    title: "Convite por e-mail",
    description:
      "Quem usa o diário convida você com um link seguro. Você aceita o convite e passa a acompanhar apenas o que foi autorizado.",
  },
  {
    title: "Dashboard compartilhado",
    description:
      "Resumo semanal, histórico de registros e detalhes do diário em modo somente leitura — sem expor dados além do consentimento.",
  },
  {
    title: "Lista de acompanhamentos",
    description:
      "Centralize o acompanhamento de quem compartilhou o diário. Ideal para clínicas e consultórios com volume moderado.",
  },
  {
    title: "Plano Cuidado",
    description:
      "Até 25 acompanhamentos com dashboard, pensado para psicólogos e outros profissionais que acompanham processos terapêuticos.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 max-w-6xl mx-auto w-full min-h-[5rem]">
        <AnimaLogo href="/" size="header" showWordmark />
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
          sentimentos no dia a dia — com apoio de IA e, quando você
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
            Um produto completo de inteligência emocional: você registra
            energia e emoções, recebe análises da IA e acompanha tendências no
            dashboard. Quando faz sentido no tratamento, convida o profissional
            para ver o mesmo resumo — sempre com consentimento explícito e
            acesso somente leitura. Quem acompanha ganha material concreto para
            sessões; quem registra ganha um ritual diário de cuidado consigo.
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
                title: "Registro no diário",
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
                text: "Com plano adequado, quem registra convida o profissional por e-mail. Você acessa dashboards autorizados.",
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
              clínica sem violar a autonomia de quem registra. A pessoa mantém o diário;
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
              permite gerenciar até 25 acompanhamentos com dashboard dedicado.
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
            Quem compartilha o diário precisa do plano Pleno para enviar convites. Profissionais
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
            conforme sua necessidade — uso pessoal, profissional ou ambos.
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
