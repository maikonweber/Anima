import { DynamicEmotionalMapSection } from "@/components/sections/DynamicEmotionalMapSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero */}
      <header className="relative flex flex-col items-center justify-center pt-20 pb-8 sm:pt-28 sm:pb-12 px-4 text-center">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ backgroundColor: "var(--anima-violet)" }}
          aria-hidden="true"
        />
        <h1 className="relative text-4xl sm:text-5xl font-bold tracking-tight text-foreground/90 mb-3">
          Anima
        </h1>
        <p className="relative text-base sm:text-lg text-foreground/50 max-w-md leading-relaxed">
          Transforme seus sentimentos em autoconhecimento com inteligência
          emocional guiada por IA.
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <DynamicEmotionalMapSection />
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-xs text-foreground/30">
          Anima &mdash; Inteligência emocional ao seu alcance
        </p>
      </footer>
    </div>
  );
}
