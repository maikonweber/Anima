import Link from "next/link";
import { AnimaLogo } from "@/components/brand/AnimaLogo";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Registre seu momento",
    text: "Escreva sobre seu dia, selecione emoções e acompanhe sua energia emocional.",
  },
  {
    step: "2",
    title: "Receba insights com IA",
    text: "A SENTIO AI identifica padrões, emoções ocultas e sugestões de cuidado emocional.",
  },
  {
    step: "3",
    title: "Acompanhe sua evolução",
    text: "Visualize sua linha do tempo emocional, tendências semanais e mudanças importantes.",
  },
  {
    step: "4",
    title: "Compartilhe com profissionais",
    text: "Quando quiser, compartilhe sua evolução com psicólogos ou profissionais de confiança.",
  },
] as const;

const PERSONAL_FEATURES = [
  "Diário emocional inteligente",
  "Mapa de emoções",
  "Energia emocional",
  "Histórico e padrões",
  "Sugestões de regulação",
  "Memória emocional longitudinal",
  "Alertas suaves de sobrecarga",
  "Jornada de autoconhecimento",
] as const;

const DIFFERENTIALS = [
  {
    title: "Memória emocional",
    description:
      "A plataforma acompanha padrões ao longo do tempo, ajudando a transformar registros em contexto.",
  },
  {
    title: "IA contextual",
    description:
      "A SENTIO AI interpreta emoções, energia e sinais recorrentes para gerar insights mais humanos.",
  },
  {
    title: "Cuidado contínuo",
    description:
      "Entre uma sessão e outra, o paciente continua sendo acompanhado de forma leve e segura.",
  },
  {
    title: "Privacidade e controle",
    description:
      "O usuário decide o que registrar, acompanhar e compartilhar.",
  },
] as const;

const PSYCHOLOGIST_CAPABILITIES = [
  "Dashboard clínico",
  "Pré-consulta inteligente",
  "Timeline terapêutica",
  "Alertas emocionais preventivos",
  "Compartilhamento controlado pelo paciente",
  "Relatórios de evolução",
  "Insights para acompanhamento longitudinal",
] as const;

const PROFESSIONAL_FEATURES = [
  {
    title: "Convite por e-mail",
    description:
      "O paciente envia um convite seguro por e-mail. Você aceita e acompanha apenas o que foi autorizado, em modo somente leitura.",
  },
  {
    title: "Dashboard compartilhado",
    description:
      "Resumo entre sessões, histórico e contexto para enriquecer a escuta — sem substituir a avaliação clínica nem editar registros.",
  },
  {
    title: "Lista de acompanhamentos",
    description:
      "Centralize pacientes que compartilharam dados com você. Ideal para consultórios e equipes com volume moderado.",
  },
  {
    title: "Plano Cuidado",
    description:
      "Até 25 acompanhamentos com dashboard dedicado para profissionais que desejam mais contexto longitudinal.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 max-w-6xl mx-auto w-full min-h-[5rem]">
        <AnimaLogo href="/" size="header" showWordmark />
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end">
          <a
            href="#como-funciona"
            className="hidden sm:inline text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            Como funciona
          </a>
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
            Começar minha jornada
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
          Plataforma de acompanhamento emocional contínuo · Powered by SENTIO AI
        </p>
        <h1 className="relative text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground/90 mb-4 max-w-4xl">
          O futuro do cuidado emocional.
        </h1>
        <div className="relative w-12 h-0.5 rounded-full bg-gradient-to-r from-anima-violet to-anima-lilac mb-6" />
        <p className="relative text-base sm:text-lg text-foreground/50 max-w-2xl leading-relaxed mb-4">
          Uma plataforma de acompanhamento emocional contínuo com IA para
          autoconhecimento, prevenção emocional e apoio entre sessões.
        </p>
        <p className="relative text-sm text-foreground/35 max-w-xl leading-relaxed mb-8 italic">
          &ldquo;Entenda suas emoções. Cuide da sua mente.&rdquo;
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
            Começar minha jornada
          </Link>
          <a
            href="#como-funciona"
            className="px-8 py-3 rounded-full text-sm font-semibold text-foreground/70 border border-foreground/10 hover:border-anima-violet/30 hover:text-anima-violet transition-colors"
          >
            Conhecer a plataforma
          </a>
        </div>
      </header>

      <section className="py-12 px-4 border-t border-foreground/[0.04]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground/85 mb-4">
            EmotiveCare
          </h2>
          <p className="text-sm sm:text-base text-foreground/45 leading-relaxed max-w-2xl mx-auto">
            Uma plataforma de acompanhamento emocional contínuo para pacientes e
            profissionais, com{" "}
            <strong className="text-foreground/60 font-semibold">
              SENTIO AI
            </strong>
            , memória emocional e insights terapêuticos pensados para complementar
            o cuidado humano — não para substituí-lo.
          </p>
          <p className="text-xs text-foreground/30 mt-4">
            Produto desenvolvido por MutterCorp.
          </p>
        </div>
      </section>

      <section
        id="como-funciona"
        className="py-14 px-4 bg-foreground/[0.02] scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-3">
            Como a EmotiveCare acompanha sua jornada emocional
          </h2>
          <p className="text-sm text-foreground/40 text-center max-w-lg mx-auto mb-10">
            Quatro pilares pensados para cuidado contínuo, com tecnologia ao
            serviço das pessoas.
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

      <section
        id="para-uso-pessoal"
        className="py-16 px-4 border-t border-foreground/[0.04] scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-4 text-center sm:text-left">
              Autoconhecimento que evolui com você
            </h2>
            <p className="text-sm sm:text-base text-foreground/45 leading-relaxed max-w-3xl mb-8">
              A EmotiveCare ajuda você a entender padrões emocionais, reconhecer
              gatilhos, acompanhar sua energia e criar uma rotina de cuidado emocional
              mais consciente.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PERSONAL_FEATURES.map((feat) => (
                <div
                  key={feat}
                  className="flex gap-3 text-sm text-foreground/60 items-start"
                >
                  <span className="text-anima-violet mt-0.5">✓</span>
                  {feat}
                </div>
              ))}
            </div>
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
              Para profissionais
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-4">
              Acompanhamento emocional entre sessões
            </h2>
            <p className="text-sm sm:text-base text-foreground/45 leading-relaxed max-w-3xl mb-6">
              Apoie seus pacientes com uma visão contínua da evolução emocional,
              padrões recorrentes, alertas importantes e resumos pré-consulta.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mb-8">
              {PSYCHOLOGIST_CAPABILITIES.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 text-sm text-foreground/55 items-start"
                >
                  <span className="text-anima-violet mt-0.5">✓</span>
                  {item}
                </div>
              ))}
            </div>
            <p className="text-sm text-foreground/35 leading-relaxed max-w-3xl">
              O plano{" "}
              <strong className="text-foreground/55 font-semibold">Cuidado</strong>{" "}
              permite gerenciar até 25 acompanhamentos com dashboards dedicados. A plataforma
              complementa sua prática; não define diagnóstico nem substitui sua escuta clínica.
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
              Criar minha conta profissional
            </Link>
            <Link
              href="/login"
              className="text-sm text-anima-violet hover:text-anima-lilac transition-colors"
            >
              Já tenho conta — entrar →
            </Link>
          </div>
          <p className="text-xs text-foreground/30 text-center mt-6 max-w-xl mx-auto">
            Quem compartilha dados com você precisa de um plano com convites ativos (Pleno). Profissionais
            costumam utilizar o plano Cuidado para visualizar múltiplos painéis. Detalhes
            em Planos após entrar na conta.
          </p>
        </div>
      </section>

      <section className="py-14 px-4 bg-foreground/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-3">
            Mais que um diário. Um sistema de cuidado emocional.
          </h2>
          <p className="text-sm text-foreground/40 text-center max-w-2xl mx-auto mb-10">
            Tecnologia e sensibilidade andando juntas — com a SENTIO AI gerando insights
            que respeitam sua história.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {DIFFERENTIALS.map((item) => (
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

      <section
        id="seguranca"
        className="py-16 px-4 border-t border-foreground/[0.04] scroll-mt-20"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 mb-4">
            Tecnologia com responsabilidade emocional
          </h2>
          <p className="text-sm sm:text-base text-foreground/45 leading-relaxed">
            A EmotiveCare não substitui acompanhamento psicológico ou médico. A plataforma
            oferece apoio ao autoconhecimento, organização emocional e acompanhamento
            complementar.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 text-center bg-foreground/[0.015] border-t border-foreground/[0.04]">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-foreground/85 mb-3">
            Inicie onde você está — evolua com apoio
          </h2>
          <p className="text-sm text-foreground/40 mb-6 leading-relaxed">
            Experimente pelo plano Essencial e avance conforme suas necessidades
            — uso pessoal, compartilhamento com especialistas ou prática assistida.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:shadow-[var(--anima-glow)] hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
            }}
          >
            Criar minha conta
          </Link>
          <p className="mt-6">
            <Link
              href="/login"
              className="text-sm text-anima-violet hover:text-anima-lilac transition-colors"
            >
              Ou entrar para acompanhar minha evolução →
            </Link>
          </p>
        </div>
      </section>

      <footer className="py-8 text-center border-t border-foreground/[0.04]">
        <p className="text-xs text-foreground/30 max-w-lg mx-auto leading-relaxed px-4 mb-3">
          <strong className="text-foreground/40 font-semibold">
            EmotiveCare
          </strong>{" "}
          · plataforma de acompanhamento emocional contínuo com IA (SENTIO AI). Uma empresa{" "}
          <strong className="text-foreground/40 font-semibold">MutterCorp</strong>
          . Não substitui avaliação, diagnóstico ou tratamento clínico.
        </p>
        <p className="text-[10px] text-foreground/25 px-4">
          O futuro do cuidado emocional · Cuidado emocional com inteligência
        </p>
      </footer>
    </div>
  );
}
