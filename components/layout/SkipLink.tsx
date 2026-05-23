/** Link “pular navegação” visível apenas em foco de teclado. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="pointer-events-none fixed left-4 top-3 z-[200] translate-y-[-120%] rounded-xl bg-[var(--anima-violet)] px-4 py-2 text-sm font-semibold text-white shadow-lg outline-none opacity-0 transition focus:pointer-events-auto focus:z-[210] focus:translate-y-0 focus:opacity-100 focus:ring-2 focus:ring-white/80"
    >
      Ir ao conteúdo principal
    </a>
  );
}
