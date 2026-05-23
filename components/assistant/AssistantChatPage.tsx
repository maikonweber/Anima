"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AssistantAmbience } from "@/components/assistant/AssistantAmbience";
import { LightMarkdown } from "@/components/assistant/LightMarkdown";
import { Button } from "@/components/ui/Button";
import {
  useAssistantSessionDetail,
  useAssistantSessionsInfinite,
  useDeleteAssistantSession,
  useSendAssistantMessage,
} from "@/hooks/use-assistant";
import { ApiError } from "@/lib/api-client";
import { extractApiErrorExtras } from "@/lib/assistant/api-errors";
import { formatAssistantMessageTime } from "@/lib/assistant/message-time";
import { isNearLimit } from "@/lib/subscription/utils";
import { useAuth } from "@/providers/auth-provider";
import type { AssistantLimits, AssistantMessage } from "@/types/assistant";

const CODE_DIARY_REQUIRED = "ASSISTANT_DIARY_REQUIRED";
const CODE_SESSION_TURN_LIMIT = "ASSISTANT_SESSION_TURN_LIMIT";

type AssistBanner = {
  tone: "danger" | "amber";
  message: string;
  code?: string;
};

function TypingDots() {
  const reduce = useReducedMotion();
  return (
    <span className="inline-flex items-center gap-1.5 text-foreground/40" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-anima-violet/50 dark:bg-anima-lilac/60"
          animate={
            reduce
              ? {}
              : { y: [0, -3, 0], opacity: [0.55, 1, 0.55] }
          }
          transition={{
            duration: 0.85,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function AssistantChatPage() {
  const { user, refreshUser } = useAuth();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [optimisticSnippet, setOptimisticSnippet] = useState<string | null>(null);
  const [assistBanner, setAssistBanner] = useState<AssistBanner | null>(null);
  /** Limites vindos da última POST bem-sucedida (enquanto GET /sessions/:id atualiza). */
  const [limitsFromSend, setLimitsFromSend] = useState<AssistantLimits | null>(null);
  const [rateLimitedUntilMs, setRateLimitedUntilMs] = useState<number | null>(null);
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
  const nearLimit = hasLimit ? isNearLimit(used, limit, 0.8) : false;
  const reduceMotion = useReducedMotion() ?? false;

  const mergedLimits = limitsFromSend ?? detailQuery.data?.limits ?? null;

  const blockedByMonthlySub = hasLimit && used >= limit!;
  const blockedByMonthlyApi =
    mergedLimits?.messagesLimitThisMonth != null &&
    mergedLimits.messagesRemainingThisMonth === 0;

  const blockedBySessionTurn =
    mergedLimits != null && mergedLimits.messagesRemainingInSession === 0;

  const rateLimitedRemainingSec =
    rateLimitedUntilMs != null && Date.now() < rateLimitedUntilMs
      ? Math.ceil((rateLimitedUntilMs - Date.now()) / 1000)
      : 0;
  const isRateLimited = rateLimitedRemainingSec > 0;

  /** Sem limites na API (ex.: primeira carga antiga): ainda usar assinatura para o mês. */
  const sendBlockedMonthly = blockedByMonthlyApi || (!mergedLimits && blockedByMonthlySub);

  useEffect(() => {
    setAssistBanner(null);
  }, [selectedSessionId]);

  useEffect(() => {
    if (rateLimitedUntilMs == null) return;
    const tick = window.setInterval(() => {
      setRateLimitedUntilMs((until) =>
        until != null && Date.now() >= until ? null : until,
      );
    }, 450);
    return () => window.clearInterval(tick);
  }, [rateLimitedUntilMs]);

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

  const composerLocked =
    awaitingReply || sendBlockedMonthly || blockedBySessionTurn || isRateLimited;

  /** Tela inicial — sem conversa ativa, sem histórico e sem envio em curso. */
  const isWelcomeSplash =
    selectedSessionId == null &&
    messages.length === 0 &&
    optimisticSnippet == null &&
    !awaitingReply;

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
      setAssistBanner({
        tone: "danger",
        message: "Esta conversa não está mais disponível.",
      });
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
    setLimitsFromSend(null);
    setAssistBanner(null);
    setRateLimitedUntilMs(null);
    setDraft("");
    setMobileSidebarOpen(false);
    void focusComposer();
  };

  const handleSelectSession = (id: string) => {
    setSelectedSessionId(id);
    setLimitsFromSend(null);
    setAssistBanner(null);
    setRateLimitedUntilMs(null);
    setOptimisticSnippet(null);
    setMobileSidebarOpen(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    setAssistBanner(null);
    if (text.length < 1 || text.length > 2000 || awaitingReply) return;
    if (sendBlockedMonthly || blockedBySessionTurn || isRateLimited) return;

    setDraft("");
    setOptimisticSnippet(text);

    try {
      const res = await sendMutation.mutateAsync({
        message: text,
        sessionId: selectedSessionId ?? undefined,
      });
      setLimitsFromSend(res.limits);
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
        const { code: errCodeRaw, retryAfterSeconds } = extractApiErrorExtras(err.details);
        const code = errCodeRaw;

        if (err.status === 402) {
          return;
        }

        if (err.status === 403 && code === CODE_DIARY_REQUIRED) {
          setAssistBanner({
            tone: "amber",
            message: err.message || "Precisamos de pelo menos uma entrada no diário para usar o assistente.",
            code,
          });
          return;
        }

        if (err.status === 400 && code?.startsWith("ASSISTANT_SCOPE")) {
          setAssistBanner({
            tone: "amber",
            message:
              err.message ||
              "Esse tema fica fora do escopo do assistente — ele é voltado ao seu bem-estar emocional.",
            code,
          });
          return;
        }

        if (err.status === 400 && code === CODE_SESSION_TURN_LIMIT) {
          setAssistBanner({
            tone: "danger",
            message:
              err.message ||
              "Você atingiu o máximo de mensagens suas nesta conversa. Abra uma nova conversa.",
            code,
          });
          return;
        }

        if (err.status === 429) {
          const sec =
            retryAfterSeconds && retryAfterSeconds > 0 ? Math.min(retryAfterSeconds, 300) : 35;
          setRateLimitedUntilMs(Date.now() + sec * 1000);
          setAssistBanner({
            tone: "danger",
            message:
              err.message ||
              "Muitas mensagens enviadas de uma vez. Aguarde um instante antes de tentar novamente.",
            code: code ?? "RATE_LIMITED",
          });
          return;
        }

        if (err.status === 503) {
          setAssistBanner({
            tone: "danger",
            message:
              "Assistente temporariamente indisponível — tente novamente em alguns instantes.",
          });
          return;
        }
      }

      const msg =
        err instanceof ApiError
          ? err.message
          : "Não foi possível enviar sua mensagem. Tente novamente.";
      setAssistBanner({ tone: "danger", message: msg });
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
                  className={`max-w-full rounded-2xl px-4 py-3.5 text-left text-sm transition-colors duration-200 active:bg-anima-violet/15 ${
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
    <div className="relative isolate flex min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-hidden lg:flex-row lg:gap-3 lg:rounded-2xl lg:border lg:border-rose-200/15 lg:bg-foreground/[0.02] lg:shadow-[0_0_0_1px_rgba(244,114,182,0.06),0_20px_50px_-28px_rgba(124,92,191,0.18)] dark:lg:border-rose-400/12 dark:lg:shadow-[0_0_0_1px_rgba(244,114,182,0.09),0_24px_56px_-28px_rgba(0,0,0,0.42)]">
      <AssistantAmbience />

      {/* Overlay drawer (mobile) */}
      <AnimatePresence>
        {mobileSidebarOpen ? (
          <motion.div
            key="drawer-overlay"
            className="fixed inset-0 z-[60] lg:hidden"
            aria-hidden={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />
            <button
              type="button"
              className="absolute inset-0"
              tabIndex={-1}
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Fechar lista"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Painel lista de sessões */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] flex min-h-0 min-w-0 max-w-[min(100vw,20.5rem)] flex-col overflow-hidden border-r border-rose-100/10 bg-background/85 pt-[env(safe-area-inset-top)] shadow-xl backdrop-blur-md transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform sm:w-80 sm:max-w-[20rem] dark:border-rose-950/25 dark:bg-background/80 lg:relative lg:inset-auto lg:z-[1] lg:!w-[260px] lg:max-w-none lg:flex-shrink-0 lg:rounded-l-[inherit] lg:border-foreground/[0.08] lg:bg-background/90 lg:pt-0 lg:shadow-none lg:backdrop-blur-sm lg:!translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <SessionSidebar />
      </aside>

      {/* Área principal do chat */}
      <section className="relative z-[1] flex min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-hidden lg:rounded-r-[inherit] lg:bg-transparent">
        <header className="flex shrink-0 flex-col gap-0 border-b border-rose-100/12 bg-background/72 backdrop-blur-md dark:border-rose-950/20 dark:bg-background/50 lg:border-foreground/[0.06] lg:bg-background/35 lg:backdrop-blur-sm">
          <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 lg:px-5 lg:py-4">
          <button
            type="button"
            className="-ml-0.5 flex items-center gap-2 rounded-xl p-2 text-foreground/55 transition-colors duration-200 hover:bg-rose-100/25 active:scale-[0.98] dark:hover:bg-rose-950/25 lg:hidden"
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
            {!mergedLimits ? (
              <>
                {!hasLimit ? (
                  <p className="text-[10px] text-foreground/38 sm:text-[11px]">
                    Limites aparecem após você enviar a primeira mensagem ou abrir uma conversa
                    existente · não é um chat genérico
                  </p>
                ) : (
                  <p
                    className={`text-[10px] sm:text-[11px] ${nearLimit ? "font-medium text-amber-600 dark:text-amber-400" : "text-foreground/38"}`}
                  >
                    Enquanto não carrega o assistente: {used}/{limit} mensagens (plano)&nbsp;&nbsp;
                    <span className="text-foreground/30">este mês</span>
                  </p>
                )}
              </>
            ) : mergedLimits.messagesLimitThisMonth === null ? (
              <div className="text-[10px] text-foreground/40 sm:text-[11px] space-y-0.5 leading-snug tabular-nums">
                <p>
                  Esta conversa: {mergedLimits.messagesUsedInSession}/
                  {mergedLimits.messagesLimitPerSession}{" "}
                  <span className="font-normal text-foreground/38">mensagens suas</span>
                </p>
                <p>
                  Este mês: <span className="font-medium text-foreground/55">sem limite mensal</span>
                </p>
              </div>
            ) : (
              <div className="text-[10px] text-foreground/40 sm:text-[11px] space-y-0.5 leading-snug tabular-nums">
                <p>
                  Esta conversa: {mergedLimits.messagesUsedInSession}/
                  {mergedLimits.messagesLimitPerSession}{" "}
                  <span className="font-normal text-foreground/38">mensagens suas</span>
                </p>
                <p>
                  Este mês: {mergedLimits.messagesUsedThisMonth}/
                  {mergedLimits.messagesLimitThisMonth ?? "–"}
                  {mergedLimits.messagesRemainingThisMonth != null ? (
                    <span className="text-foreground/35">{` (${mergedLimits.messagesRemainingThisMonth} restantes)`}</span>
                  ) : null}
                </p>
              </div>
            )}
          </div>
          {selectedSessionId ? (
            <button
              type="button"
              className="shrink-0 rounded-xl p-2 text-red-400/95 transition-colors duration-200 hover:bg-red-500/10 active:scale-[0.97]"
              onClick={() => setDeleteTarget(selectedSessionId)}
              aria-label="Excluir conversa"
            >
              <TrashIcon />
            </button>
          ) : (
            /* Spacer on mobile so title stays visually centered block */
            <span className="w-14 shrink-0 lg:hidden" aria-hidden />
          )}
          </div>
          <div className="border-t border-rose-100/8 bg-rose-50/[0.35] px-3 py-2 text-[10.5px] leading-snug text-foreground/50 dark:border-rose-950/20 dark:bg-rose-950/15 sm:text-[11px] sm:px-4 lg:px-5">
            <strong className="font-medium text-foreground/65">Assistente emocional</strong> — só
            sentimentos e seu diário; não faz tarefas, receitas nem programação.
          </div>
        </header>

        {isRateLimited ? (
          <div
            className="mx-3 mt-2 shrink-0 rounded-xl border border-amber-400/35 bg-amber-500/[0.09] px-3 py-2 text-sm text-amber-950 dark:text-amber-100 sm:mx-4"
            role="status"
          >
            <p className="tabular-nums text-xs leading-snug sm:text-sm">
              Aguarde mais <strong>{rateLimitedRemainingSec}s</strong> antes de enviar outra mensagem (limite da
              API).
            </p>
          </div>
        ) : null}

        {assistBanner ? (
          <div
            className={`mx-3 mt-2 shrink-0 rounded-xl border px-3 py-2 text-sm sm:mx-4 ${
              assistBanner.tone === "amber"
                ? "border-amber-400/35 bg-amber-500/[0.08] text-amber-950 dark:text-amber-100"
                : "border-red-500/30 bg-red-500/12 text-red-800 dark:text-red-200"
            }`}
            role="alert"
          >
            <p className="leading-snug">{assistBanner.message}</p>
            {assistBanner.code === CODE_DIARY_REQUIRED ? (
              <p className="mt-2">
                <Link
                  href="/diary/new"
                  className={`text-xs font-semibold underline underline-offset-2 sm:text-sm ${
                    assistBanner.tone === "amber"
                      ? "text-amber-900 dark:text-amber-200"
                      : "text-red-700 dark:text-red-100"
                  }`}
                >
                  Criar entrada no diário
                </Link>
              </p>
            ) : null}
            {assistBanner.code === CODE_SESSION_TURN_LIMIT ? (
              <button
                type="button"
                className={`mt-2 text-xs font-semibold underline underline-offset-2 sm:text-sm ${
                  assistBanner.tone === "amber"
                    ? "text-amber-900 dark:text-amber-200"
                    : "text-red-700 dark:text-red-100"
                }`}
                onClick={() => handleNewChat()}
              >
                Nova conversa
              </button>
            ) : null}
            {assistBanner.code?.startsWith("ASSISTANT_SCOPE") ? (
              <p className="mt-1 text-[11px] opacity-95">
                Você pode editar a última mensagem no campo abaixo e enviar novamente quando quiser.
              </p>
            ) : null}
            {draft.trim().length >= 1 && draft.trim().length <= 2000 &&
            !assistBanner.code?.startsWith("ASSISTANT_SCOPE") ? (
              <button
                type="button"
                className={`mt-1.5 text-xs underline underline-offset-2 opacity-95 ${
                  assistBanner.tone === "amber" ? "" : ""
                }`}
                onClick={() => void handleRetry()}
              >
                Tentar novamente
              </button>
            ) : null}
          </div>
        ) : null}

        <div
          className="relative z-[1] min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-3 py-3 sm:px-5 sm:py-4 lg:px-8"
          aria-live="polite"
          aria-busy={awaitingReply}
        >
          {!selectedSessionId && messages.length === 0 ? (
            <motion.div
              className="mx-auto flex w-full max-w-lg min-w-0 flex-col items-center px-2 py-10 text-center sm:py-14"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-r from-rose-100/55 to-anima-lilac/25 px-5 py-2.5 ring-1 ring-rose-200/40 dark:from-rose-950/40 dark:to-anima-violet/20 dark:ring-rose-500/20 sm:mb-8">
                <span className="text-xs font-medium tracking-tight text-anima-violet dark:text-anima-lilac sm:text-sm">
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
              <SparklesIconLarge reducedMotion={reduceMotion} />
            </motion.div>
          ) : detailQuery.isLoading && selectedSessionId ? (
            <p className="py-14 text-center text-sm text-foreground/40">Carregando mensagens…</p>
          ) : messages.length === 0 && selectedSessionId ? (
            <p className="py-10 text-center text-sm text-foreground/45 sm:py-14">
              Envie a primeira mensagem para começar.
            </p>
          ) : null}

          {!isWelcomeSplash ? (
            <ul className="relative z-[1] mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-3 pb-1">
              {messages.map((m) => (
                <motion.li
                  key={m.id}
                  layout={false}
                  className={`flex w-full min-w-0 max-w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.24,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {m.role === "user" ? (
                    <div className="min-w-0 max-w-[min(100%,36rem)] rounded-2xl rounded-br-md bg-gradient-to-br from-anima-violet to-anima-indigo px-[0.85rem] py-2.5 text-[14px] leading-snug text-white shadow-md shadow-anima-violet/15 ring-1 ring-white/10">
                      <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{m.content}</p>
                      <time
                        dateTime={m.criadoEm}
                        className="mt-1.5 block text-right text-[10px] text-white/60 tabular-nums sm:text-[11px]"
                      >
                        {formatAssistantMessageTime(m.criadoEm)}
                      </time>
                    </div>
                  ) : (
                    <div className="min-w-0 max-w-[min(100%,38rem)] rounded-2xl rounded-bl-md border border-rose-200/25 bg-background/65 px-[0.85rem] py-2.5 text-[14px] leading-snug shadow-sm backdrop-blur-[2px] dark:border-rose-400/15 dark:bg-foreground/[0.06]">
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
                </motion.li>
              ))}

              {optimisticSnippet ? (
                <motion.li
                  layout={false}
                  className="flex w-full min-w-0 max-w-full justify-end"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                >
                  <div className="min-w-0 max-w-[min(100%,36rem)] rounded-2xl rounded-br-md bg-gradient-to-br from-anima-violet to-anima-indigo px-[0.85rem] py-2.5 text-[14px] text-white opacity-95 shadow-md shadow-anima-violet/15 ring-1 ring-white/10">
                    <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{optimisticSnippet}</p>
                    <span className="mt-1.5 block text-right text-[10px] text-white/60">enviando…</span>
                  </div>
                </motion.li>
              ) : null}

              {awaitingReply ? (
                <motion.li
                  layout={false}
                  key="typing"
                  aria-live="polite"
                  className="flex min-w-0 max-w-full justify-start"
                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.22 }}
                >
                  <div className="max-w-full rounded-2xl border border-rose-200/35 bg-background/55 px-4 py-3 text-sm shadow-sm backdrop-blur-sm dark:border-rose-400/25 dark:bg-foreground/[0.07]">
                    <span className="sr-only">Assistente está digitando</span>
                    <span className="flex items-center gap-2 text-xs text-foreground/50">
                      <TypingDots />
                      digitando…
                    </span>
                  </div>
                </motion.li>
              ) : null}
          </ul>
          ) : null}
          <div ref={messagesEndRef} className="h-px shrink-0" aria-hidden />
        </div>

        <footer className="relative z-[2] min-w-0 max-w-full shrink-0 border-t border-rose-200/20 bg-gradient-to-b from-rose-50/30 to-background px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md dark:border-rose-900/35 dark:from-rose-950/20 dark:to-background sm:px-5 lg:rounded-br-[inherit] lg:border-foreground/[0.07] lg:from-transparent lg:to-background/92 lg:bg-background/88 lg:px-8 lg:pb-5 lg:pt-4">
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
                disabled={composerLocked}
                className="box-border max-h-[7.25rem] min-h-[6.5rem] w-full resize-none overflow-x-hidden overflow-y-auto overscroll-contain rounded-xl border border-rose-200/25 bg-background/90 px-3 py-2.5 pr-14 text-[15px] leading-snug text-foreground/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] outline-none [-webkit-overflow-scrolling:touch] placeholder:text-foreground/35 transition-[border-color,box-shadow] duration-200 dark:border-rose-400/18 dark:bg-background/80 focus-visible:border-anima-violet/55 focus-visible:ring-2 focus-visible:ring-rose-200/55 focus-visible:ring-offset-0 dark:focus-visible:ring-rose-500/35 sm:max-h-[10rem] sm:min-h-[5.5rem] sm:text-[0.9375rem] lg:max-h-[12rem] disabled:opacity-60 disabled:pointer-events-none"
              />
              <span
                className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-background/92 px-1.5 py-0.5 text-[10px] tabular-nums text-foreground/42 ring-1 ring-rose-200/30 dark:bg-background/80 dark:ring-rose-500/15 sm:text-[11px]"
                aria-live="polite"
              >
                {draft.length}/2000
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <span className="hidden min-w-0 text-[11px] leading-snug text-foreground/34 sm:inline sm:max-w-[52%]">
                Envie até 2000 caracteres. O uso é contado após a API aceitar cada interação bem-sucedida.
                {blockedBySessionTurn ? (
                  <span className="mt-1 block text-amber-600/95 dark:text-amber-400/90">
                    Limite nesta conversa atingido — abra uma nova conversa para continuar.
                  </span>
                ) : null}
                {isRateLimited ? (
                  <span className="mt-1 block text-red-700/95 dark:text-red-300">
                    Envio rápido demais. Aguarde o contador acima do campo.
                  </span>
                ) : null}
              </span>
              {blockedBySessionTurn ? (
                <Button
                  type="button"
                  className="w-full !py-3 sm:!w-auto sm:!min-w-[9rem]"
                  onClick={() => handleNewChat()}
                >
                  Nova conversa
                </Button>
              ) : sendBlockedMonthly ? (
                <Link
                  href="/assinatura?plan=pleno"
                  className="inline-flex w-full min-w-0 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-anima-violet to-anima-indigo px-5 py-3 text-sm font-medium text-white shadow-sm sm:!w-auto"
                >
                  Fazer upgrade
                </Link>
              ) : (
                <Button
                  type="submit"
                  className="w-full !py-3 sm:!w-auto sm:!min-w-[7rem]"
                  disabled={
                    draft.trim().length < 1 ||
                    awaitingReply ||
                    draft.length > 2000 ||
                    isRateLimited
                  }
                  isLoading={awaitingReply}
                >
                  Enviar
                </Button>
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

      <AnimatePresence mode="wait">
        {deleteTarget ? (
          <ConfirmDeleteModal
            key={deleteTarget}
            isDeleting={deleteMutation.isPending}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => void onDeleteConfirmed()}
            reducedMotion={reduceMotion}
          />
        ) : null}
      </AnimatePresence>
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
  reducedMotion = false,
}: {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  reducedMotion?: boolean;
}) {
  const instant = reducedMotion;
  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/55 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="del-title"
      initial={instant ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={instant ? undefined : { opacity: 0 }}
      transition={{ duration: instant ? 0 : 0.2 }}
    >
      <motion.div
        className="glass-panel max-w-md w-full rounded-2xl border border-rose-200/35 p-6 shadow-xl shadow-rose-200/25 dark:border-rose-500/25 dark:shadow-rose-900/20"
        initial={instant ? false : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={instant ? undefined : { opacity: 0, scale: 0.97, y: 6 }}
        transition={{
          duration: instant ? 0 : 0.26,
          ease: [0.16, 1, 0.3, 1],
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
            className="px-4 py-2 rounded-xl text-sm text-foreground/60 hover:bg-foreground/[0.05] disabled:opacity-40 transition-colors duration-150"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors duration-150"
          >
            {isDeleting ? "Excluindo…" : "Excluir"}
          </button>
        </div>
      </motion.div>
    </motion.div>
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

function SparklesIconLarge({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <motion.div
      className="mx-auto mt-8 inline-flex rounded-full bg-gradient-to-br from-anima-violet/15 via-rose-100/35 to-anima-lilac/25 p-4 ring-1 ring-rose-200/35 shadow-sm dark:via-rose-950/30 dark:to-anima-violet/20 dark:ring-rose-500/20 sm:mt-10"
      initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
      animate={{
        opacity: 1,
        scale: reducedMotion ? 1 : [1, 1.028, 1],
      }}
      transition={
        reducedMotion
          ? { duration: 0.22, ease: "easeOut" }
          : {
              opacity: { duration: 0.4, ease: "easeOut" },
              scale: {
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }
      }
    >
      <svg className="h-9 w-9 text-anima-violet sm:h-10 sm:w-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3l1.09 5.09L18.18 12l-5.09 3.91L12 21l-1.09-5.09L5.82 12l5.09-3.91L12 3z" />
      </svg>
    </motion.div>
  );
}
