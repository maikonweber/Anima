"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { LightMarkdown } from "@/components/assistant/LightMarkdown";
import { Button } from "@/components/ui/Button";
import {
  useAssistantSessionDetail,
  useAssistantSessionsInfinite,
  useDeleteAssistantSession,
  useSendAssistantMessage,
} from "@/hooks/use-assistant";
import { ApiError } from "@/lib/api-client";
import { formatAssistantMessageTime } from "@/lib/assistant/message-time";
import { isNearLimit, usagePercent } from "@/lib/subscription/utils";
import { useAuth } from "@/providers/auth-provider";
import type { AssistantMessage } from "@/types/assistant";

function TypingDots() {
  return (
    <span
      className="inline-flex gap-1 items-center text-foreground/40"
      aria-hidden
    >
      <span className="animate-bounce h-2 w-2 rounded-full bg-foreground/35 [animation-delay:0ms]" />
      <span className="animate-bounce h-2 w-2 rounded-full bg-foreground/35 [animation-delay:120ms]" />
      <span className="animate-bounce h-2 w-2 rounded-full bg-foreground/35 [animation-delay:240ms]" />
    </span>
  );
}

export function AssistantChatPage() {
  const { user, refreshUser } = useAuth();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [optimisticSnippet, setOptimisticSnippet] = useState<string | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const sessionsQuery = useAssistantSessionsInfinite();
  const detailQuery = useAssistantSessionDetail(selectedSessionId, !!selectedSessionId);
  const sendMutation = useSendAssistantMessage();
  const deleteMutation = useDeleteAssistantSession();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const assistantUsage = user?.subscription?.usage?.assistantMessages;
  const used = assistantUsage?.used ?? 0;
  const limit = assistantUsage?.limit ?? null;
  const hasLimit = limit != null && limit > 0;
  const pct = usagePercent(used, limit);
  const nearLimit = hasLimit ? isNearLimit(used, limit, 0.8) : false;

  const sessions = useMemo(() => {
    const pages = sessionsQuery.data?.pages;
    if (!pages?.length) return [];
    const rows = pages.flatMap((p) => p.data);
    const byId = new Map<string, (typeof rows)[0]>();
    for (const s of rows) {
      const prev = byId.get(s.id);
      if (!prev || new Date(s.atualizadoEm) > new Date(prev.atualizadoEm)) {
        byId.set(s.id, s);
      }
    }
    return [...byId.values()].sort(
      (a, b) =>
        new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime(),
    );
  }, [sessionsQuery.data]);

  const messages: AssistantMessage[] = useMemo(
    () => detailQuery.data?.messages ?? [],
    [detailQuery.data],
  );

  const sessionTitulo =
    detailQuery.data?.session.titulo ?? sessions.find((s) => s.id === selectedSessionId)?.titulo;

  const awaitingReply = sendMutation.isPending;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages, awaitingReply, optimisticSnippet, detailQuery.status]);

  useEffect(() => {
    const err = detailQuery.error;
    if (err instanceof ApiError && err.status === 404) {
      setSelectedSessionId(null);
      setInlineError("Esta conversa não está mais disponível.");
    }
  }, [detailQuery.error]);

  /** Bloquear scroll da página atrás do drawer mobile. */
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!mobileSidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileSidebarOpen]);

  const focusComposer = () => inputRef.current?.focus();

  const handleNewChat = () => {
    setSelectedSessionId(null);
    setInlineError(null);
    setDraft("");
    setMobileSidebarOpen(false);
    void focusComposer();
  };

  const handleSelectSession = (id: string) => {
    setSelectedSessionId(id);
    setInlineError(null);
    setOptimisticSnippet(null);
    setMobileSidebarOpen(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    setInlineError(null);
    if (text.length < 1 || text.length > 2000 || awaitingReply) return;

    setDraft("");
    setOptimisticSnippet(text);

    try {
      const res = await sendMutation.mutateAsync({
        message: text,
        sessionId: selectedSessionId ?? undefined,
      });
      setOptimisticSnippet(null);
      if (!selectedSessionId) {
        setSelectedSessionId(res.sessionId);
      }
      await refreshUser();
      queueMicrotask(() => focusComposer());
    } catch (err: unknown) {
      setOptimisticSnippet(null);
      setDraft(text);

      if (err instanceof ApiError) {
        if (err.status === 402) {
          return;
        }
        if (err.status === 503) {
          setInlineError(
            "Assistente temporariamente indisponível — tente novamente em alguns instantes.",
          );
          return;
        }
      }

      const msg =
        err instanceof ApiError
          ? err.message
          : "Não foi possível enviar sua mensagem. Tente novamente.";
      setInlineError(msg);
    }
  };

  const handleRetry = () => {
    void handleSubmit();
  };

  const onDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget;
    try {
      await deleteMutation.mutateAsync(id);
      if (selectedSessionId === id) {
        handleNewChat();
      }
    } finally {
      setDeleteTarget(null);
    }
  };

  function SessionSidebar() {
    const totalSessions = sessionsQuery.data?.pages?.[0]?.meta.total ?? sessions.length;

    return (
      <div className="flex h-full flex-col min-h-0">
        {/* Cabeçalho do drawer (mobile) */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-foreground/[0.06] px-3 py-3 sm:px-4 lg:hidden">
          <span className="text-sm font-semibold text-foreground/85 tracking-tight">Conversas</span>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded-xl p-2 text-foreground/45 hover:bg-foreground/[0.06] hover:text-foreground/70"
            aria-label="Fechar lista de conversas"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="border-b border-foreground/[0.06] p-3 sm:p-4 space-y-2.5 lg:space-y-3">
          <Button type="button" className="!w-full sm:!w-auto lg:!w-auto" onClick={handleNewChat}>
            Nova conversa
          </Button>
          {totalSessions === 0 && sessions.length === 0 && !sessionsQuery.isLoading ? (
            <>
              <p className="text-xs text-foreground/45 leading-relaxed lg:hidden">
                Fale sobre como você está. O assistente pode usar seus registros do diário quando
                existirem.
              </p>
              <p className="hidden text-xs text-foreground/45 leading-relaxed lg:block">
                Converse sobre como você está se sentindo. Quando há registros no diário, eles ajudam
                a contextualizar — com ética e discrição.
              </p>
            </>
          ) : null}
          {sessionsQuery.fetchStatus === "fetching" &&
          sessionsQuery.isFetching &&
          sessions.length === 0 ? (
            <p className="text-xs text-foreground/35">Carregando conversas…</p>
          ) : null}
        </div>

        <ul className="min-h-0 flex-1 divide-y divide-foreground/[0.05] overflow-x-hidden overflow-y-auto overscroll-y-contain">
          {sessions.map((s) => {
            const active = s.id === selectedSessionId;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => handleSelectSession(s.id)}
                  className={`w-full px-4 py-3.5 text-left text-sm transition-colors active:bg-anima-violet/15 ${
                    active
                      ? "bg-anima-violet/10 text-anima-violet"
                      : "text-foreground/65 hover:bg-foreground/[0.035]"
                  }`}
                >
                  <span className="font-medium line-clamp-2">{s.titulo || "Sem título"}</span>
                  <span className="mt-1 block text-[11px] text-foreground/35">
                    {formatAssistantMessageTime(s.atualizadoEm)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {sessionsQuery.hasNextPage ? (
          <div className="shrink-0 border-t border-foreground/[0.06] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              className="w-full rounded-xl py-2.5 text-xs font-medium text-anima-violet hover:bg-anima-violet/5 hover:text-anima-lilac"
              onClick={() => void sessionsQuery.fetchNextPage()}
              disabled={sessionsQuery.isFetchingNextPage}
            >
              {sessionsQuery.isFetchingNextPage ? "Carregando…" : "Carregar mais"}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-x-hidden lg:flex-row lg:gap-3 lg:rounded-2xl lg:border lg:border-foreground/[0.08] lg:bg-foreground/[0.02]">
      {/* Overlay drawer (mobile) */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${
          mobileSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!mobileSidebarOpen}
      >
        <button
          type="button"
          className="absolute inset-0"
          tabIndex={-1}
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Fechar lista"
        />
      </div>

      {/* Painel lista de sessões */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] flex min-w-0 max-w-[min(100vw,20.5rem)] flex-col overflow-x-hidden border-r border-foreground/[0.08] bg-background pt-[env(safe-area-inset-top)] shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform sm:w-80 sm:max-w-[20rem] lg:relative lg:inset-auto lg:z-auto lg:flex lg:!w-[260px] lg:max-w-none lg:flex-shrink-0 lg:rounded-l-2xl lg:border-r lg:border-foreground/[0.08] lg:bg-background/92 lg:pt-0 lg:shadow-none lg:!translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <SessionSidebar />
      </aside>

      {/* Área principal do chat */}
      <section className="flex min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-x-hidden overflow-y-hidden lg:rounded-r-2xl lg:bg-transparent">
        <header className="flex shrink-0 items-center gap-2 border-b border-foreground/[0.06] bg-background/80 px-3 py-2.5 backdrop-blur-sm sm:px-4 lg:bg-transparent lg:px-5 lg:py-4">
          <button
            type="button"
            className="-ml-0.5 flex items-center gap-2 rounded-xl p-2 text-foreground/55 hover:bg-foreground/[0.055] lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Abrir conversas"
          >
            <MenuPanelIcon />
            <span className="text-[11px] font-medium uppercase tracking-wide text-foreground/40">
              Lista
            </span>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[15px] font-semibold text-foreground/90 leading-tight sm:text-base">
              {selectedSessionId ? sessionTitulo ?? "Conversa" : "Nova conversa"}
            </h1>
            {!hasLimit ? (
              <p className="text-[10px] text-foreground/38 sm:text-[11px]">Mensagens ilimitadas</p>
            ) : (
              <p
                className={`text-[10px] sm:text-[11px] ${nearLimit ? "font-medium text-amber-600 dark:text-amber-400" : "text-foreground/38"}`}
              >
                <span className="sm:hidden">{used}/{limit} mensagens</span>
                <span className="hidden sm:inline">
                  {used}/{limit} mensagens neste período ({Math.round(pct)}%)
                </span>
              </p>
            )}
          </div>
          {selectedSessionId ? (
            <button
              type="button"
              className="shrink-0 rounded-xl p-2 text-red-400/95 hover:bg-red-500/10"
              onClick={() => {
                const ok =
                  typeof window !== "undefined" &&
                  window.confirm("Excluir esta conversa e todas as mensagens?");
                if (ok) setDeleteTarget(selectedSessionId);
              }}
              aria-label="Excluir conversa"
            >
              <TrashIcon />
            </button>
          ) : (
            /* Spacer on mobile so title stays visually centered block */
            <span className="w-14 shrink-0 lg:hidden" aria-hidden />
          )}
        </header>

        {inlineError ? (
          <div
            className="mx-3 mt-2 shrink-0 rounded-xl border border-red-500/30 bg-red-500/12 px-3 py-2 text-sm text-red-800 dark:text-red-200 sm:mx-4"
            role="alert"
          >
            <p className="leading-snug">{inlineError}</p>
            {draft.trim().length >= 1 && draft.trim().length <= 2000 ? (
              <button
                type="button"
                className="mt-1.5 text-xs underline underline-offset-2 opacity-95"
                onClick={() => void handleRetry()}
              >
                Tentar novamente
              </button>
            ) : null}
          </div>
        ) : null}

        <div
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-3 py-3 sm:px-5 sm:py-4 lg:px-8"
          aria-live="polite"
          aria-busy={awaitingReply}
        >
          {!selectedSessionId && messages.length === 0 ? (
            <div className="mx-auto flex max-w-lg flex-col items-center px-2 py-10 text-center sm:py-14">
              <div className="mb-6 inline-flex rounded-2xl bg-anima-violet/12 px-5 py-2.5 sm:mb-8">
                <span className="text-xs font-medium text-anima-violet sm:text-sm">
                  Espaço de apoio emocional
                </span>
              </div>
              <div className="space-y-3 text-[13px] leading-snug text-foreground/52 sm:hidden">
                <p>Fale livremente. Respostas em português, com tom humano.</p>
                <p className="text-foreground/42">
                  Se você já registrou momentos no diário, podemos usar isso só para contextualizar,
                  de forma discreta.
                </p>
              </div>
              <div className="hidden space-y-4 text-[15px] leading-relaxed text-foreground/55 sm:block">
                <p>O assistente responde com empatia. Você pode desabafar, pedir ideias para regulação
                  emocional ou refletir sobre o que está sentindo.</p>
                <p className="text-foreground/45">
                  Quando existem registros no diário, eles são considerados apenas como contexto opcional —
                  você continua no controle.
                </p>
              </div>
              <SparklesIconLarge />
            </div>
          ) : detailQuery.isLoading && selectedSessionId ? (
            <p className="py-14 text-center text-sm text-foreground/40">Carregando mensagens…</p>
          ) : messages.length === 0 && selectedSessionId ? (
            <p className="py-10 text-center text-sm text-foreground/45 sm:py-14">
              Envie a primeira mensagem para começar.
            </p>
          ) : null}

          <ul className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-3 pb-1">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={`flex min-w-0 max-w-full w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "user" ? (
                    <div className="min-w-0 max-w-[min(100%,36rem)] rounded-2xl rounded-br-md bg-anima-violet px-[0.85rem] py-2.5 text-[14px] leading-snug text-white shadow-sm">
                      <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{m.content}</p>
                      <time
                        dateTime={m.criadoEm}
                        className="mt-1.5 block text-right text-[10px] text-white/60 tabular-nums sm:text-[11px]"
                      >
                        {formatAssistantMessageTime(m.criadoEm)}
                      </time>
                    </div>
                  ) : (
                    <div className="min-w-0 max-w-[min(100%,38rem)] rounded-2xl rounded-bl-md border border-foreground/[0.08] bg-foreground/[0.034] px-[0.85rem] py-2.5 text-[14px] leading-snug shadow-sm">
                      <div className="min-w-0">
                        <LightMarkdown text={m.content} />
                      </div>
                      <time
                        dateTime={m.criadoEm}
                        className="mt-2 block text-[10px] tabular-nums text-foreground/35 sm:text-[11px]"
                      >
                        {formatAssistantMessageTime(m.criadoEm)}
                      </time>
                    </div>
                  )}
                </li>
              ))}

              {optimisticSnippet ? (
                <li className="flex min-w-0 max-w-full w-full justify-end">
                  <div className="min-w-0 max-w-[min(100%,36rem)] rounded-2xl rounded-br-md bg-anima-violet px-[0.85rem] py-2.5 text-[14px] text-white opacity-90 shadow-sm">
                    <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{optimisticSnippet}</p>
                    <span className="mt-1.5 block text-right text-[10px] text-white/55">enviando…</span>
                  </div>
                </li>
              ) : null}

              {awaitingReply ? (
                <li key="typing" aria-live="polite" className="flex min-w-0 max-w-full justify-start">
                  <div className="max-w-full rounded-2xl border border-foreground/[0.07] bg-foreground/[0.038] px-4 py-3 text-sm">
                    <span className="sr-only">Assistente está digitando</span>
                    <span className="flex items-center gap-2 text-xs text-foreground/50">
                      <TypingDots />
                      digitando…
                    </span>
                  </div>
                </li>
              ) : null}
          </ul>
          <div ref={messagesEndRef} className="h-px shrink-0" aria-hidden />
        </div>

        <footer className="min-w-0 max-w-full shrink-0 border-t border-foreground/[0.06] bg-background/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md sm:px-5 lg:rounded-br-2xl lg:bg-background/80 lg:px-8 lg:pb-5 lg:pt-4 lg:backdrop-blur-sm">
          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-2 sm:gap-3"
          >
            <label htmlFor="assistant-message" className="sr-only">
              Escreva uma mensagem para o assistente
            </label>
            <div className="relative min-w-0">
              <textarea
                id="assistant-message"
                ref={inputRef}
                rows={3}
                maxLength={2000}
                spellCheck={true}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Digite sua mensagem…"
                disabled={awaitingReply}
                className="box-border max-h-[7.25rem] min-h-[6.5rem] w-full resize-none overflow-x-hidden overflow-y-auto overscroll-contain rounded-xl border border-foreground/[0.11] bg-background px-3 py-2.5 pr-14 text-[15px] leading-snug text-foreground/90 outline-none [-webkit-overflow-scrolling:touch] placeholder:text-foreground/35 focus-visible:border-anima-violet/50 focus-visible:ring-2 focus-visible:ring-anima-violet/20 sm:max-h-[10rem] sm:min-h-[5.5rem] sm:text-[0.9375rem] lg:max-h-[12rem]"
              />
              <span
                className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] tabular-nums text-foreground/38 ring-1 ring-foreground/[0.06] sm:text-[11px]"
                aria-live="polite"
              >
                {draft.length}/2000
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <span className="hidden min-w-0 text-[11px] leading-snug text-foreground/34 sm:inline sm:max-w-[52%]">
                Até 2000 caracteres por envio · limite do plano conta só após resposta bem-sucedida da API.
              </span>
              {!hasLimit || used < limit! ? (
                <Button
                  type="submit"
                  className="w-full !py-3 sm:!w-auto sm:!min-w-[7rem]"
                  disabled={draft.trim().length < 1 || awaitingReply || draft.length > 2000}
                  isLoading={awaitingReply}
                >
                  Enviar
                </Button>
              ) : (
                <Link
                  href="/assinatura?plan=pleno"
                  className="inline-flex w-full min-w-0 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-anima-violet to-anima-indigo px-5 py-3 text-sm font-medium text-white shadow-sm sm:!w-auto"
                >
                  Fazer upgrade
                </Link>
              )}
            </div>
            <span className="text-[10px] text-foreground/32 sm:hidden">
              Mensagens longas continuam dentro da caixa (role para ver tudo).
            </span>
          </form>
          {nearLimit && hasLimit ? (
            <p className="mt-2 text-center text-[11px] text-foreground/38">
              Perto do limite mensal.{" "}
              <Link href="/assinatura?plan=pleno" className="text-anima-violet underline underline-offset-2">
                Plano Pleno
              </Link>
            </p>
          ) : null}
        </footer>
      </section>

      {deleteTarget ? (
        <ConfirmDeleteModal
          isDeleting={deleteMutation.isPending}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void onDeleteConfirmed()}
        />
      ) : null}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function MenuPanelIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 18h12M15 12h6" />
    </svg>
  );
}

function ConfirmDeleteModal({
  isDeleting,
  onCancel,
  onConfirm,
}: {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="del-title"
    >
      <div className="glass-panel max-w-md w-full rounded-2xl p-6 shadow-xl">
        <h2 id="del-title" className="text-lg font-semibold text-foreground/90 mb-2">
          Excluir conversa?
        </h2>
        <p className="text-sm text-foreground/50 mb-6">
          Isso remove todas as mensagens desta sessão permanentemente.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm text-foreground/60 hover:bg-foreground/[0.05] disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? "Excluindo…" : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
}

function SparklesIconLarge() {
  return (
    <div className="mx-auto mt-8 inline-flex rounded-full bg-anima-violet/12 p-4 sm:mt-10">
      <svg className="h-9 w-9 text-anima-violet sm:h-10 sm:w-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3l1.09 5.09L18.18 12l-5.09 3.91L12 21l-1.09-5.09L5.82 12l5.09-3.91L12 3z" />
      </svg>
    </div>
  );
}
