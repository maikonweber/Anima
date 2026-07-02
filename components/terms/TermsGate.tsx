"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ApiError } from "@/lib/api-client";
import { useAcceptTerms, useTerms, useTermsStatus } from "@/hooks/use-terms";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { Term, TermStatusItem } from "@/types/terms";

/** Rotas onde o gate não deve aparecer (fluxos de auth / leitura pública dos termos). */
const EXCLUDED_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/aguardando-verificacao",
  "/care-invite",
  "/terms",
];

function isExcludedPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return EXCLUDED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function TermsGate() {
  const { user } = useAuth();
  const pathname = usePathname();
  const excluded = isExcludedPath(pathname);

  const { data: status } = useTermsStatus();
  const gated =
    !!user &&
    !excluded &&
    !!status &&
    !status.todosAceitos &&
    status.pendentes.length > 0;

  if (!gated) return null;

  return <TermsGateModal pendentes={status.pendentes} />;
}

function TermsGateModal({ pendentes }: { pendentes: TermStatusItem[] }) {
  const { data: terms, isLoading: termsLoading } = useTerms();
  const acceptMutation = useAcceptTerms();

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const pendingTerms = useMemo(() => {
    return pendentes
      .map((item) => {
        const full =
          terms?.find((t) => t.id === item.termId) ??
          terms?.find((t) => t.tipo === item.tipo);
        return { item, term: full };
      })
      .filter((entry): entry is { item: TermStatusItem; term: Term } =>
        Boolean(entry.term),
      );
  }, [pendentes, terms]);

  const pendingIds = pendentes
    .map((p) => p.termId)
    .filter((id): id is string => !!id);

  const allChecked =
    pendingIds.length > 0 && pendingIds.every((id) => checked[id]);

  // Trava o scroll do body enquanto o gate estiver ativo.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Foca o diálogo ao montar.
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Foco preso: mantém o Tab dentro do diálogo.
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function toggleAll(value: boolean) {
    const next: Record<string, boolean> = {};
    for (const id of pendingIds) next[id] = value;
    setChecked(next);
  }

  async function handleAccept() {
    setErrorMsg(null);
    if (!allChecked || pendingIds.length === 0) return;
    try {
      await acceptMutation.mutateAsync(pendingIds);
      // Sucesso: o cache de status é atualizado e o gate desmonta automaticamente.
    } catch (err) {
      setErrorMsg(
        err instanceof ApiError
          ? err.message
          : "Não foi possível registrar seu aceite. Tente novamente.",
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-gate-title"
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex w-full max-w-lg max-h-[90vh] flex-col glass-panel rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 focus:outline-none"
      >
        <div className="p-6 sm:p-8 pb-4">
          <h2
            id="terms-gate-title"
            className="text-lg font-bold text-foreground/90"
          >
            Aceite dos Termos
          </h2>
          <p className="mt-1 text-sm text-foreground/50">
            Para continuar usando a EmotiveCare, leia e aceite os termos abaixo.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-8 space-y-4">
          {termsLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl bg-foreground/[0.06] animate-pulse"
                />
              ))}
            </div>
          )}

          {!termsLoading &&
            pendingTerms.map(({ item, term }) => (
              <section
                key={term.id}
                className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02]"
              >
                <header className="px-4 pt-4">
                  <h3 className="text-sm font-semibold text-foreground/85">
                    {term.titulo}
                  </h3>
                  <p className="text-[11px] text-foreground/35">
                    Versão {term.versao}
                  </p>
                </header>
                <div className="mx-4 my-3 max-h-40 overflow-y-auto rounded-lg bg-foreground/[0.03] p-3 text-xs leading-relaxed text-foreground/60 whitespace-pre-line">
                  {term.conteudo}
                </div>
                <div className="border-t border-foreground/[0.06] px-4 py-3">
                  <Checkbox
                    checked={!!checked[term.id]}
                    onChange={(e) =>
                      setChecked((prev) => ({
                        ...prev,
                        [term.id]: e.target.checked,
                      }))
                    }
                    label={`Li e aceito: ${term.titulo}`}
                    aria-label={`Aceitar ${term.titulo} (${item.tipo})`}
                  />
                </div>
              </section>
            ))}
        </div>

        <div className="p-6 sm:p-8 pt-4 space-y-3 border-t border-foreground/[0.06]">
          {pendingTerms.length > 1 && (
            <Checkbox
              checked={allChecked}
              onChange={(e) => toggleAll(e.target.checked)}
              label="Li e aceito todos os termos"
            />
          )}

          {errorMsg && <ErrorMessage message={errorMsg} />}

          <Button
            type="button"
            onClick={handleAccept}
            disabled={!allChecked || termsLoading}
            isLoading={acceptMutation.isPending}
          >
            Aceitar e continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
