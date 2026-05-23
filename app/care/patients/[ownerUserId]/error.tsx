"use client";

import Link from "next/link";

export default function PatientDashboardError() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href="/care/patients"
        className="text-sm text-anima-violet hover:text-anima-lilac transition-colors mb-6 inline-block"
      >
        ← Voltar aos acompanhamentos
      </Link>
      <div className="glass-panel p-6 text-center">
        <p className="text-sm text-foreground/50 mb-2">
          Não foi possível carregar o dashboard compartilhado.
        </p>
        <p className="text-xs text-foreground/35">
          Tente recarregar a página ou volte mais tarde.
        </p>
      </div>
    </div>
  );
}
