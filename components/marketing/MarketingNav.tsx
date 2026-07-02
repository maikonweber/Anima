"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/about", label: "Sobre" },
  { href: "/plans", label: "Planos" },
  { href: "/psychologists", label: "Psicólogos" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contato" },
] as const;

/** Navegação institucional: linha única no desktop, menu sanfona no mobile. */
export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <nav
        className="hidden md:flex flex-wrap justify-end gap-x-6 gap-y-2 text-sm font-medium text-foreground/55"
        aria-label="Links institucionais"
      >
        {LINKS.map((link) => (
          <Link
            key={link.href}
            className="hover:text-anima-violet transition-colors"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
        <Link
          className="font-semibold text-anima-violet hover:text-anima-lilac transition-colors"
          href="/login"
        >
          Entrar
        </Link>
      </nav>

      {/* Botão hambúrguer (mobile) */}
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-foreground/60 hover:bg-foreground/[0.06] hover:text-foreground/90 transition-colors"
        aria-expanded={open}
        aria-controls="marketing-mobile-menu"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        )}
      </button>

      {/* Painel do menu (mobile) */}
      {open ? (
        <nav
          id="marketing-mobile-menu"
          className="md:hidden w-full mt-1"
          aria-label="Links institucionais"
        >
          <div className="glass-panel flex flex-col divide-y divide-foreground/[0.06] p-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-foreground/70 hover:bg-foreground/[0.04] hover:text-anima-violet transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold text-anima-violet hover:bg-anima-violet/5 transition-colors"
            >
              Entrar
            </Link>
          </div>
        </nav>
      ) : null}
    </>
  );
}
