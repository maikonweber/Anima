"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  ClinicPageFrame,
  ClinicPageHeader,
} from "@/components/clinic/ClinicPageFrame";
import {
  useConnectWhatsApp,
  useDisconnectWhatsApp,
  useHandoffWhatsApp,
  useSendWhatsAppMessage,
  useToggleWhatsAppAi,
  useWhatsAppConversations,
  useWhatsAppInstances,
  useWhatsAppMessages,
  useWhatsAppQrcode,
  useWhatsAppStatus,
} from "@/hooks/use-whatsapp";
import { useMyOrganizations } from "@/hooks/use-organizations";
import { getClinicUiDictionary } from "@/lib/i18n/clinic-ui-dictionary";
import { useLocale } from "@/lib/i18n/locale-provider";
import type {
  OrganizationRole,
  WhatsAppConversation,
  WhatsAppMessage,
} from "@anima/shared";

export default function ClinicWhatsAppPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const { locale } = useLocale();
  const t = getClinicUiDictionary(locale);
  const { data: orgs } = useMyOrganizations();
  const role: OrganizationRole | undefined = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );

  const canView =
    role === "CLINIC_ADMIN" ||
    role === "PROFESSIONAL" ||
    role === "SECRETARY";
  const canConnect = role === "CLINIC_ADMIN";

  const instances = useWhatsAppInstances(orgId, canView);
  const instance = instances.data?.[0];
  const status = useWhatsAppStatus(
    orgId,
    instance?.id,
    canView && !!instance,
  );
  const needsQr =
    canConnect &&
    !!instance &&
    (status.data?.status === "connecting" ||
      instance.status === "connecting" ||
      status.data?.connectionState === "connecting");
  const qr = useWhatsAppQrcode(orgId, instance?.id, needsQr);

  const conversations = useWhatsAppConversations(orgId, canView);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const messages = useWhatsAppMessages(orgId, selectedId, !!selectedId);
  const [draft, setDraft] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const connect = useConnectWhatsApp(orgId);
  const disconnect = useDisconnectWhatsApp(orgId);
  const send = useSendWhatsAppMessage(orgId);
  const handoff = useHandoffWhatsApp(orgId);
  const toggleAi = useToggleWhatsAppAi(orgId);

  const selected = conversations.data?.find((c) => c.id === selectedId);
  const liveStatus = status.data?.status ?? instance?.status;
  const livePhone = status.data?.phone ?? instance?.phone;
  const chatOpen = !!selectedId;

  useEffect(() => {
    if (!chatOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [chatOpen]);

  async function handleConnect() {
    setActionError(null);
    try {
      await connect.mutateAsync();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao conectar WhatsApp.",
      );
    }
  }

  async function handleDisconnect() {
    if (!instance) return;
    setActionError(null);
    try {
      await disconnect.mutateAsync(instance.id);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao desconectar.",
      );
    }
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!selectedId || !draft.trim()) return;
    setActionError(null);
    try {
      await send.mutateAsync({ conversationId: selectedId, body: draft.trim() });
      setDraft("");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Falha ao enviar mensagem.",
      );
    }
  }

  function closeChat() {
    setSelectedId(undefined);
    setDraft("");
  }

  if (!canView) {
    return (
      <ClinicPageFrame width="narrow">
        <p className="text-sm text-[var(--clinic-muted)]">
          Sem permissão para ver o WhatsApp da clínica.
        </p>
      </ClinicPageFrame>
    );
  }

  return (
    <ClinicPageFrame
      className={chatOpen ? "lg:block max-lg:!px-0 max-lg:!py-0 max-lg:!max-w-none" : ""}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="min-w-0"
      >
        {/* List view: hide on mobile when a chat is open */}
        <div className={chatOpen ? "hidden lg:block" : "block"}>
          <ClinicPageHeader
            title={t.pages.whatsapp}
            description={t.whatsappPage.description}
          />

          {actionError && (
            <div className="mb-4 px-4 sm:px-0">
              <ErrorMessage message={actionError} />
            </div>
          )}

          <section className="mb-5 sm:mb-8 rounded-none sm:rounded-2xl border-y sm:border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <h2 className="text-base font-medium text-foreground">
                  {t.whatsappPage.connection}
                </h2>
                <p className="mt-1 text-sm text-[var(--clinic-muted)] break-words">
                  {t.whatsappPage.statusLabel}:{" "}
                  <span className="text-foreground/80">
                    {liveStatus ?? "—"}
                  </span>
                  {livePhone ? ` · ${livePhone}` : ""}
                </p>
              </div>
              {canConnect && (
                <div className="flex w-full sm:w-auto flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    className="clinic-btn-primary w-full sm:w-auto"
                    onClick={() => void handleConnect()}
                    disabled={connect.isPending || liveStatus === "connected"}
                  >
                    {liveStatus === "connected"
                      ? t.whatsappPage.connected
                      : t.whatsappPage.connect}
                  </Button>
                  {instance && liveStatus === "connected" && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full sm:w-auto"
                      onClick={() => void handleDisconnect()}
                      disabled={disconnect.isPending}
                    >
                      {t.whatsappPage.disconnect}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {needsQr && qr.data?.qrcode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-5 flex flex-col items-center sm:items-start gap-3"
              >
                <p className="text-sm text-[var(--clinic-muted)] text-center sm:text-left">
                  {t.whatsappPage.scanQr}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qr.data.qrcode}
                  alt="QR Code WhatsApp"
                  className="h-48 w-48 sm:h-56 sm:w-56 rounded-xl border border-[var(--clinic-border)] bg-white p-2"
                />
              </motion.div>
            )}
          </section>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
            <aside className="rounded-none sm:rounded-2xl border-y sm:border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-2 sm:p-3">
              <h3 className="mb-1 px-3 sm:px-2 py-2 text-sm font-medium text-[var(--clinic-muted)]">
                {t.whatsappPage.inbox}
              </h3>
              <ul className="max-h-none lg:max-h-[520px] space-y-0.5 overflow-y-auto">
                {(conversations.data ?? []).map((conv) => (
                  <li key={conv.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(conv.id)}
                      className={`w-full rounded-xl px-3 py-3 sm:py-2.5 text-left transition active:scale-[0.99] ${
                        selectedId === conv.id
                          ? "bg-[var(--clinic-accent-soft)] text-[var(--clinic-accent)]"
                          : "hover:bg-[var(--clinic-row-hover)]"
                      }`}
                    >
                      <div className="truncate text-sm font-medium text-foreground">
                        {conv.patientFullName ?? t.whatsappPage.unnamedPatient}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-[var(--clinic-subtle)]">
                        {conv.patientPhone ?? "—"} · {conv.status}
                        {conv.aiEnabled ? " · IA" : ""}
                      </div>
                    </button>
                  </li>
                ))}
                {!conversations.data?.length && (
                  <li className="px-3 py-8 text-sm text-[var(--clinic-subtle)] text-center sm:text-left">
                    {t.whatsappPage.emptyInbox}
                  </li>
                )}
              </ul>
            </aside>

            {/* Desktop-only empty / selected pane when list is visible */}
            <section className="hidden lg:flex min-h-[520px] flex-col rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)]">
              {selected ? (
                <ChatPane
                  t={t}
                  selected={selected}
                  messages={messages.data ?? []}
                  draft={draft}
                  setDraft={setDraft}
                  onSend={handleSend}
                  sendPending={send.isPending}
                  onToggleAi={() =>
                    void toggleAi.mutateAsync({
                      conversationId: selected.id,
                      enabled: !selected.aiEnabled,
                    })
                  }
                  onHandoff={() => void handoff.mutateAsync(selected.id)}
                  showBack={false}
                />
              ) : (
                <div className="flex flex-1 items-center justify-center px-6 text-sm text-[var(--clinic-subtle)]">
                  {t.whatsappPage.selectConversation}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Mobile full-screen chat */}
        <AnimatePresence>
          {chatOpen && selected && (
            <motion.div
              key={selected.id}
              initial={{ x: "12%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "8%", opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="lg:hidden fixed inset-x-0 top-12 bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] z-30 flex flex-col bg-[var(--background)]"
            >
              {actionError && (
                <div className="px-3 pt-2 shrink-0">
                  <ErrorMessage message={actionError} />
                </div>
              )}
              <ChatPane
                t={t}
                selected={selected}
                messages={messages.data ?? []}
                draft={draft}
                setDraft={setDraft}
                onSend={handleSend}
                sendPending={send.isPending}
                onToggleAi={() =>
                  void toggleAi.mutateAsync({
                    conversationId: selected.id,
                    enabled: !selected.aiEnabled,
                  })
                }
                onHandoff={() => void handoff.mutateAsync(selected.id)}
                showBack
                onBack={closeChat}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ClinicPageFrame>
  );
}

type ChatPaneProps = {
  t: ReturnType<typeof getClinicUiDictionary>;
  selected: WhatsAppConversation;
  messages: WhatsAppMessage[];
  draft: string;
  setDraft: (v: string) => void;
  onSend: (e: FormEvent) => void;
  sendPending: boolean;
  onToggleAi: () => void;
  onHandoff: () => void;
  showBack: boolean;
  onBack?: () => void;
};

function ChatPane({
  t,
  selected,
  messages,
  draft,
  setDraft,
  onSend,
  sendPending,
  onToggleAi,
  onHandoff,
  showBack,
  onBack,
}: ChatPaneProps) {
  return (
    <>
      <div className="flex items-start gap-2 border-b border-[var(--clinic-border)] px-3 sm:px-4 py-3 shrink-0 bg-[var(--clinic-panel)]">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label={t.whatsappPage.backToInbox}
            className="mt-0.5 -ml-1 shrink-0 rounded-lg p-2 text-[var(--clinic-muted)] hover:bg-[var(--clinic-row-hover)] hover:text-foreground"
          >
            <BackIcon />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-foreground truncate">
            {selected.patientFullName ?? t.whatsappPage.unnamedPatient}
          </div>
          <div className="text-xs text-[var(--clinic-subtle)] truncate">
            {selected.patientPhone} · {selected.status}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            type="button"
            variant="ghost"
            className="!px-2.5 !py-1.5 !text-[11px]"
            onClick={onToggleAi}
          >
            {selected.aiEnabled
              ? t.whatsappPage.disableAi
              : t.whatsappPage.enableAi}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="!px-2.5 !py-1.5 !text-[11px]"
            onClick={onHandoff}
          >
            {t.whatsappPage.handoff}
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 space-y-2 overflow-y-auto overscroll-contain px-3 sm:px-4 py-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[88%] sm:max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              msg.direction === "out"
                ? "ml-auto bg-[var(--clinic-accent-soft)] text-foreground"
                : "bg-[var(--clinic-panel)] border border-[var(--clinic-border)] text-foreground/85"
            }`}
          >
            {msg.content ?? ""}
            <div className="mt-1 text-[10px] text-[var(--clinic-subtle)]">
              {msg.status}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => void onSend(e)}
        className="flex gap-2 border-t border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-3 shrink-0"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t.whatsappPage.replyPlaceholder}
          className="min-w-0 flex-1 rounded-xl border border-[var(--clinic-border)] bg-transparent px-3 py-2.5 text-base sm:text-sm outline-none focus:border-[var(--clinic-accent)]"
        />
        <Button
          type="submit"
          className="clinic-btn-primary shrink-0"
          disabled={sendPending || !draft.trim()}
        >
          {t.whatsappPage.send}
        </Button>
      </form>
    </>
  );
}

function BackIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}
