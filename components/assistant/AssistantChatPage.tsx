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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, awaitingReply, optimisticSnippet, detailQuery.status]);

  useEffect(() => {
    const err = detailQuery.error;
    if (err instanceof ApiError && err.status === 404) {
      setSelectedSessionId(null);
      setInlineError("Esta conversa não está mais disponível.");
    }
  }, [detailQuery.error]);

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
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-foreground/[0.06] space-y-3">
          <Button type="button" className="!w-auto" onClick={handleNewChat}>
            Nova conversa
          </Button>
          {totalSessions === 0 && sessions.length === 0 && !sessionsQuery.isLoading ? (
            <p className="text-xs text-foreground/45 leading-relaxed">
              Converse com o assistente sobre como você está se sentindo. Ele usa seu diário como
              contexto para um suporte personalizado e acolhedor.
            </p>
          ) : null}
          {sessionsQuery.fetchStatus === "fetching" &&
          sessionsQuery.isFetching &&
          sessions.length === 0 ? (
            <p className="text-xs text-foreground/35">Carregando conversas…</p>
          ) : null}
        </div>
        <ul className="flex-1 overflow-y-auto divide-y divide-foreground/[0.05]">
          {sessions.map((s) => {
            const active = s.id === selectedSessionId;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => handleSelectSession(s.id)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    active
                      ? "bg-anima-violet/10 text-anima-violet"
                      : "text-foreground/60 hover:bg-foreground/[0.03]"
                  }`}
                >
                  <span className="font-medium line-clamp-2 block">{s.titulo || "Sem título"}</span>
                  <span className="text-[11px] text-foreground/35 mt-1 block">
                    {formatAssistantMessageTime(s.atualizadoEm)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {sessionsQuery.hasNextPage ? (
          <div className="p-3 border-t border-foreground/[0.06]">
            <button
              type="button"
              className="w-full py-2 text-xs text-anima-violet hover:text-anima-lilac"
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
    <div className="flex flex-col lg:flex-row h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-0px)] min-h-[28rem] -mx-px">
      {/* Mobile sidebar overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm transition-opacity ${
          mobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileSidebarOpen}
      >
        <button
          type="button"
          className="absolute inset-0"
          tabIndex={-1}
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Fechar lista de conversas"
        />
      </div>
      <aside
        className={`fixed lg:relative z-[70] top-0 bottom-24 lg:bottom-0 left-0 w-[min(100%,288px)] border-r border-foreground/[0.06] glass-panel lg:bg-background/55 flex flex-col transition-transform duration-200 lg:!translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <SessionSidebar />
      </aside>

      <section className="flex-1 flex flex-col min-w-0 min-h-0">
        <header className="flex items-center gap-2 px-4 py-3 border-b border-foreground/[0.06] glass-panel lg:bg-transparent">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-foreground/60 hover:bg-foreground/[0.05]"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Abrir conversas"
          >
            <MenuIcon />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-foreground/90 truncate">
              {selectedSessionId ? sessionTitulo ?? "Conversa" : "Nova conversa"}
            </h1>
            {!hasLimit ? (
              <p className="text-[11px] text-foreground/40">Mensagens ilimitadas</p>
            ) : (
              <p
                className={`text-[11px] ${nearLimit ? "text-amber-600 dark:text-amber-400 font-medium" : "text-foreground/40"}`}
              >
                {used}/{limit} mensagens do assistente neste período ({Math.round(pct)}% do limite)
              </p>
            )}
          </div>
          {selectedSessionId ? (
            <button
              type="button"
              className="p-2 rounded-lg text-red-400/90 hover:bg-red-500/10 shrink-0"
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
          ) : null}
        </header>

        {inlineError ? (
          <div
            className="mx-4 mt-3 px-4 py-2 rounded-xl text-sm bg-red-500/15 text-red-800 dark:text-red-200 border border-red-500/30"
            role="alert"
          >
            <p>{inlineError}</p>
            {draft.trim().length >= 1 && draft.trim().length <= 2000 ? (
              <button type="button" className="text-xs underline mt-1 opacity-90" onClick={() => handleRetry}>
                Tentar novamente
              </button>
            ) : null}
          </div>
        ) : null}

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4"
          aria-live="polite"
          aria-busy={awaitingReply}
        >
          {!selectedSessionId && messages.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-12 px-4">
              <p className="text-sm text-foreground/55 leading-relaxed mb-6">
                O assistente usa seus registros do diário como contexto (quando você já registrou momentos).
                Você pode falar sobre o que está sentindo, pedir estratégias de regulação emocional ou
                apenas desabafar — em português e com tom humano e acolhedor.
              </p>
              <SparklesIconLarge />
            </div>
          ) : detailQuery.isLoading && selectedSessionId ? (
            <p className="text-sm text-center text-foreground/40 py-16">Carregando mensagens…</p>
          ) : messages.length === 0 && selectedSessionId ? (
            <p className="text-sm text-center text-foreground/45 py-16">
              Envie a primeira mensagem para começar.
            </p>
          ) : null}

          <ul className="space-y-3 max-w-3xl mx-auto list-none flex flex-col pb-28">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "user" ? (
                  <div className="max-w-[min(100%,32rem)] w-full ml-auto rounded-2xl px-4 py-2.5 text-sm shadow-sm bg-anima-violet text-white rounded-br-md">
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    <time
                      dateTime={m.criadoEm}
                      className="text-[11px] text-white/65 mt-1 block text-right"
                    >
                      {formatAssistantMessageTime(m.criadoEm)}
                    </time>
                  </div>
                ) : (
                  <div className="max-w-[min(100%,32rem)] w-full mr-auto rounded-2xl px-4 py-2.5 text-sm shadow-sm bg-foreground/[0.045] border border-foreground/[0.07] rounded-bl-md">
                    <LightMarkdown text={m.content} />
                    <time
                      dateTime={m.criadoEm}
                      className="text-[11px] text-foreground/35 mt-2 block"
                    >
                      {formatAssistantMessageTime(m.criadoEm)}
                    </time>
                  </div>
                )}
              </li>
            ))}

            {optimisticSnippet ? (
              <li className="flex w-full justify-end">
                <div className="max-w-[min(100%,32rem)] w-full ml-auto rounded-2xl px-4 py-2.5 text-sm shadow-sm bg-anima-violet text-white rounded-br-md opacity-90">
                  <p className="whitespace-pre-wrap break-words">{optimisticSnippet}</p>
                  <span className="text-[11px] text-white/55 mt-1 block text-right">
                    enviando…
                  </span>
                </div>
              </li>
            ) : null}

            {awaitingReply ? (
              <li key="typing" aria-live="polite" className="flex">
                <div className="max-w-[min(100%,28rem)] rounded-2xl px-4 py-3 text-sm bg-foreground/[0.04] border border-foreground/[0.06]">
                  <span className="sr-only">Assistente está digitando</span>
                  <span className="text-foreground/50 text-xs flex items-center gap-2">
                    <TypingDots />
                    digitando…
                  </span>
                </div>
              </li>
            ) : null}
          </ul>
          <div ref={messagesEndRef} />
        </div>

        <footer className="sticky bottom-0 left-0 right-0 px-4 pt-3 pb-[max(7rem,calc(env(safe-area-inset-bottom)+5rem))] lg:pb-5 border-t border-foreground/[0.06] glass-panel lg:bg-transparent">
          <form onSubmit={(e) => void handleSubmit(e)} className="max-w-3xl mx-auto space-y-2">
            <label htmlFor="assistant-message" className="sr-only">
              Escreva uma mensagem para o assistente
            </label>
            <textarea
              id="assistant-message"
              ref={inputRef}
              rows={3}
              maxLength={2000}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Escreva o que você sente ou o que está precisando de apoio agora..."
              disabled={awaitingReply}
              className="w-full resize-none rounded-xl border border-foreground/[0.1] bg-background/75 px-3 py-2.5 text-sm text-foreground/90 outline-none focus:border-anima-violet/55 focus:ring-2 focus:ring-anima-violet/20"
            />
            <div className="flex justify-between gap-3 items-center">
              <span className="text-[11px] text-foreground/35">
                Máximo 2000 caracteres · uso contado por envio bem-sucedido
              </span>
              <div className="flex gap-2">
                {!hasLimit || used < limit! ? (
                  <Button
                    type="submit"
                    className="!w-auto min-w-[6rem]"
                    disabled={draft.trim().length < 1 || awaitingReply}
                    isLoading={awaitingReply}
                  >
                    Enviar
                  </Button>
                ) : (
                  <Link
                    href="/assinatura?plan=pleno"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-anima-violet to-anima-indigo"
                  >
                    Fazer upgrade
                  </Link>
                )}
              </div>
            </div>
          </form>
          {nearLimit && hasLimit ? (
            <p className="text-center text-[11px] text-foreground/35 mt-2">
              Você está próximo do limite mensal.&nbsp;
              <Link href="/assinatura?plan=pleno" className="text-anima-violet underline">
                Conheça o plano Pleno
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
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
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

function MenuIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" d="M3.75 8.25h16.5M3.75 12h16.5m-16.5 3.75h16.5" />
    </svg>
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
    <div className="inline-flex mx-auto rounded-full bg-anima-violet/15 p-4">
      <svg className="w-10 h-10 text-anima-violet" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3l1.09 5.09L18.18 12l-5.09 3.91L12 21l-1.09-5.09L5.82 12l5.09-3.91L12 3z" />
      </svg>
    </div>
  );
}
