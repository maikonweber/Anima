"use client";

import { useTerms, useTermsStatus } from "@/hooks/use-terms";
import { useAuth } from "@/providers/auth-provider";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { TermStatusItem, TermsType } from "@/types/terms";

function formatDate(iso: string, locale: Locale): string {
  try {
    return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function TermsView({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getDictionary(locale).terms;
  const { user } = useAuth();
  const { data: terms, isLoading, error, refetch } = useTerms();
  const { data: status } = useTermsStatus();

  const statusByType = new Map<TermsType, TermStatusItem>();
  status?.porTipo.forEach((item) => statusByType.set(item.tipo, item));

  const copy =
    locale === "en"
      ? {
          loadError: "Could not load the terms.",
          empty: "No terms published at the moment.",
          version: "Version",
          acceptedOn: (d: string) => `Accepted on ${d}`,
          accepted: "Accepted",
          pending: "Pending",
        }
      : {
          loadError: "Não foi possível carregar os termos.",
          empty: "Nenhum termo publicado no momento.",
          version: "Versão",
          acceptedOn: (d: string) => `Aceito em ${d}`,
          accepted: "Aceito",
          pending: "Pendente",
        };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground/90">{t.title}</h1>
        <p className="mt-2 text-sm text-foreground/55 leading-relaxed">
          {t.intro}
        </p>
      </header>

      {error && (
        <ErrorMessage message={copy.loadError} onRetry={() => refetch()} />
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
          {copy.empty}
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
                  {copy.version} {term.versao}
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
                      ? copy.acceptedOn(formatDate(st.aceitoEm, locale))
                      : copy.accepted
                    : copy.pending}
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
