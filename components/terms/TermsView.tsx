"use client";

import { useTerms, useTermsStatus } from "@/hooks/use-terms";
import { useAuth } from "@/providers/auth-provider";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { TermStatusItem, TermsType } from "@/types/terms";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function TermsView() {
  const { user } = useAuth();
  const { data: terms, isLoading, error, refetch } = useTerms();
  const { data: status } = useTermsStatus();

  const statusByType = new Map<TermsType, TermStatusItem>();
  status?.porTipo.forEach((item) => statusByType.set(item.tipo, item));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground/90">
          Termos da ferramenta
        </h1>
        <p className="mt-2 text-sm text-foreground/55 leading-relaxed">
          Termos de Uso, Compromisso e Responsabilidade da EmotiveCare. Ao usar a
          plataforma, você concorda com as condições abaixo.
        </p>
      </header>

      {error && (
        <ErrorMessage
          message="Não foi possível carregar os termos."
          onRetry={() => refetch()}
        />
      )}

      {isLoading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-foreground/[0.06] animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && !error && (!terms || terms.length === 0) && (
        <div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-8 text-center text-sm text-foreground/50">
          Nenhum termo publicado no momento.
        </div>
      )}

      {terms?.map((term) => {
        const st = statusByType.get(term.tipo);
        return (
          <article
            key={term.id}
            className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6"
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground/85">
                  {term.titulo}
                </h2>
                <p className="text-xs text-foreground/35">
                  Versão {term.versao}
                </p>
              </div>
              {user && st && (
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    st.aceito
                      ? "bg-green-500/10 text-green-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {st.aceito
                    ? st.aceitoEm
                      ? `Aceito em ${formatDate(st.aceitoEm)}`
                      : "Aceito"
                    : "Pendente"}
                </span>
              )}
            </div>
            <div className="text-sm leading-relaxed text-foreground/60 whitespace-pre-line">
              {term.conteudo}
            </div>
          </article>
        );
      })}
    </div>
  );
}
