import Link from "next/link";
import { BASE_EMOTIONS } from "@/lib/emotion/base-emotions";
import { BLEND_DEFINITIONS } from "@/lib/emotion/blends";

const SHOWCASE_BLENDS = BLEND_DEFINITIONS.slice(0, 4);
const EMOTION_LIST = Object.values(BASE_EMOTIONS);

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <span className="text-lg font-bold tracking-tight text-foreground/90">
          Anima
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/login"
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

      {/* Hero */}
      <header className="relative flex flex-col items-center justify-center pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 text-center overflow-hidden">
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

        <h1 className="relative text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground/90 mb-4">
          Anima
        </h1>
        <div className="relative w-12 h-0.5 rounded-full bg-gradient-to-r from-anima-violet to-anima-lilac mb-6" />
        <p className="relative text-lg sm:text-xl text-foreground/50 max-w-lg leading-relaxed mb-8">
          Transforme seus sentimentos em autoconhecimento com inteligência
          emocional guiada por IA.
        </p>
        <div className="relative flex gap-3">
          <Link
            href="/login"
            className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:shadow-[var(--anima-glow)] hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
            }}
          >
            Começar gratuitamente
          </Link>
        </div>
      </header>

      {/* Emotion circles preview */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 mb-3">
            Suas emoções, em camadas
          </h2>
          <p className="text-sm sm:text-base text-foreground/40 max-w-md mx-auto mb-10">
            Descubra como emoções-base se combinam para formar sentimentos
            complexos que você vive todos os dias.
          </p>

          {/* Emotion pills */}
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

          {/* Blend examples */}
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

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-anima-violet/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-anima-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-foreground/80 mb-1">
                IA Emocional
              </h3>
              <p className="text-sm text-foreground/40 leading-relaxed">
                Análise inteligente dos seus sentimentos em tempo real.
              </p>
            </div>
            <div className="glass-panel p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-anima-violet/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-anima-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-foreground/80 mb-1">
                Mapa Emocional
              </h3>
              <p className="text-sm text-foreground/40 leading-relaxed">
                Visualize combinações e descubra novas camadas emocionais.
              </p>
            </div>
            <div className="glass-panel p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-anima-violet/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-anima-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-foreground/80 mb-1">
                Bem-estar
              </h3>
              <p className="text-sm text-foreground/40 leading-relaxed">
                Reflexões personalizadas para sua jornada de autoconhecimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-foreground/85 mb-3">
            Comece sua jornada emocional
          </h2>
          <p className="text-sm text-foreground/40 mb-6">
            Crie sua conta gratuita e descubra o que seus sentimentos revelam
            sobre você.
          </p>
          <Link
            href="/login"
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

      {/* Footer */}
      <footer className="py-8 text-center border-t border-foreground/[0.04]">
        <p className="text-xs text-foreground/30">
          Anima &mdash; Inteligência emocional ao seu alcance
        </p>
      </footer>
    </div>
  );
}
