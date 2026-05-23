"use client";

/**
 * Luzes ambientais sutis nos cantos (rosa + violeta) — só decoração, não recebe foco nem clique.
 * Deve ficar dentro de um pai com overflow-hidden / rounded-* para mascarar bordas.
 */
export function AssistantAmbience({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] ${className}`}
      aria-hidden
    >
      {/* Canto superior esquerdo — rosa suave */}
      <div
        className="absolute -left-[18%] -top-[32%] h-[min(52%,28rem)] w-[min(85%,36rem)] rounded-full bg-gradient-to-br from-rose-200/45 via-fuchsia-100/25 to-transparent blur-[56px] animate-gentle-float dark:from-rose-400/18 dark:via-fuchsia-500/12 dark:to-transparent"
        style={{ animationDelay: "0s" }}
      />
      {/* Canto inferior direito — rosa + lilás (marca) */}
      <div
        className="absolute -bottom-[38%] -right-[12%] h-[min(60%,32rem)] w-[min(78%,34rem)] rounded-full bg-gradient-to-tl from-anima-lilac/35 via-rose-200/30 to-anima-violet/15 blur-[64px] animate-gentle-float dark:from-anima-lilac/20 dark:via-rose-500/12 dark:to-anima-violet/12"
        style={{ animationDelay: "-2s" }}
      />
      {/* Halo central leve (profundidade) */}
      <div className="absolute left-1/2 top-[22%] h-[min(35%,16rem)] w-[min(55%,24rem)] -translate-x-1/2 rounded-full bg-gradient-to-b from-rose-100/20 to-transparent blur-[80px] dark:from-rose-400/10 dark:to-transparent" />
      {/* Borda interna suave (clareia cantos sem “corte” duro) */}
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(244,114,182,0.06),inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:shadow-[inset_0_0_0_1px_rgba(244,114,182,0.08),inset_0_1px_0_0_rgba(255,255,255,0.03)]" />
    </div>
  );
}
