import Link from "next/link";
import type { ReactNode } from "react";
import { AnimaLogo } from "@/components/brand/AnimaLogo";

interface MarketingChromeProps {
  children: ReactNode;
}

/** Shell semântico reutilizado em páginas públicas institucionais. */
export function MarketingChrome({ children }: MarketingChromeProps) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-foreground/[0.06] px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4">
          <AnimaLogo href="/" size="header" showWordmark />
          <nav
            className="flex flex-wrap justify-end gap-x-6 gap-y-2 text-sm font-medium text-foreground/55"
            aria-label="Links institucionais"
          >
            <Link className="hover:text-anima-violet transition-colors" href="/about">
              Sobre
            </Link>
            <Link className="hover:text-anima-violet transition-colors" href="/plans">
              Planos
            </Link>
            <Link className="hover:text-anima-violet transition-colors" href="/psychologists">
              Psicólogos
            </Link>
            <Link className="hover:text-anima-violet transition-colors" href="/faq">
              FAQ
            </Link>
            <Link className="hover:text-anima-violet transition-colors" href="/blog">
              Blog
            </Link>
            <Link className="hover:text-anima-violet transition-colors" href="/contact">
              Contato
            </Link>
            <Link className="hover:text-anima-violet transition-colors" href="/login">
              Entrar
            </Link>
          </nav>
        </div>
      </header>
      <main id="main-content" role="main" className="flex-1 px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
      <footer
        className="border-t border-foreground/[0.06] px-4 py-10 text-center text-xs text-foreground/40"
        role="contentinfo"
      >
        <div className="mx-auto mb-6 flex max-w-xl flex-wrap justify-center gap-4 font-medium">
          <Link href="/privacy" className="hover:text-anima-violet">
            Privacidade
          </Link>
          <Link href="/terms" className="hover:text-anima-violet">
            Termos
          </Link>
          <Link href="/resources" className="hover:text-anima-violet">
            Recursos
          </Link>
        </div>
        <p>
          EmotiveCare · MutterCorp · SENTIO AI. Não substitui avaliação clínica
          especializada.
        </p>
      </footer>
    </div>
  );
}
