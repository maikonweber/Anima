"use client";

import { FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
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
import type { OrganizationRole } from "@anima/shared";

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

  if (!canView) {
    return (
      <ClinicPageFrame width="narrow">
        <p className="text-sm text-foreground/50">
          Sem permissão para ver o WhatsApp da clínica.
        </p>
      </ClinicPageFrame>
    );
  }

  return (
    <ClinicPageFrame>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <ClinicPageHeader
          title={t.pages.whatsapp}
          description={t.whatsappPage.description}
        />

        {actionError && (
          <div className="mb-4">
            <ErrorMessage message={actionError} />
          </div>
        )}

        <section className="mb-8 rounded-2xl border border-foreground/[0.08] bg-background/40 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-medium text-foreground">
                {t.whatsappPage.connection}
              </h2>
              <p className="mt-1 text-sm text-foreground/55">
                Status:{" "}
                <span className="text-foreground/80">
                  {liveStatus ?? "—"}
                </span>
                {livePhone ? ` · ${livePhone}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {canConnect && (
                <>
                  <Button
                    type="button"
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
                      onClick={() => void handleDisconnect()}
                      disabled={disconnect.isPending}
                    >
                      {t.whatsappPage.disconnect}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {needsQr && qr.data?.qrcode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-5 flex flex-col items-start gap-3"
            >
              <p className="text-sm text-foreground/60">
                {t.whatsappPage.scanQr}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qr.data.qrcode}
                alt="QR Code WhatsApp"
                className="h-56 w-56 rounded-xl border border-foreground/10 bg-white p-2"
              />
            </motion.div>
          )}
        </section>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-foreground/[0.08] bg-background/40 p-3">
            <h3 className="mb-2 px-2 text-sm font-medium text-foreground/70">
              {t.whatsappPage.inbox}
            </h3>
            <ul className="max-h-[520px] space-y-1 overflow-y-auto">
              {(conversations.data ?? []).map((conv) => (
                <li key={conv.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(conv.id)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
                      selectedId === conv.id
                        ? "bg-foreground/[0.08]"
                        : "hover:bg-foreground/[0.04]"
                    }`}
                  >
                    <div className="truncate text-sm text-foreground">
                      {conv.patientFullName ?? "Paciente"}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-foreground/45">
                      {conv.patientPhone ?? "—"} · {conv.status}
                      {conv.aiEnabled ? " · IA" : ""}
                    </div>
                  </button>
                </li>
              ))}
              {!conversations.data?.length && (
                <li className="px-2 py-6 text-sm text-foreground/40">
                  {t.whatsappPage.emptyInbox}
                </li>
              )}
            </ul>
          </aside>

          <section className="flex min-h-[520px] flex-col rounded-2xl border border-foreground/[0.08] bg-background/40">
            {selected ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-foreground/[0.06] px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {selected.patientFullName}
                    </div>
                    <div className="text-xs text-foreground/45">
                      {selected.patientPhone} · modo {selected.status}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        void toggleAi.mutateAsync({
                          conversationId: selected.id,
                          enabled: !selected.aiEnabled,
                        })
                      }
                    >
                      {selected.aiEnabled
                        ? t.whatsappPage.disableAi
                        : t.whatsappPage.enableAi}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => void handoff.mutateAsync(selected.id)}
                    >
                      {t.whatsappPage.handoff}
                    </Button>
                  </div>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
                  {(messages.data ?? []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                        msg.direction === "out"
                          ? "ml-auto bg-foreground/[0.08] text-foreground"
                          : "bg-foreground/[0.04] text-foreground/85"
                      }`}
                    >
                      {msg.content}
                      <div className="mt-1 text-[10px] text-foreground/35">
                        {msg.status}
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => void handleSend(e)}
                  className="flex gap-2 border-t border-foreground/[0.06] p-3"
                >
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={t.whatsappPage.replyPlaceholder}
                    className="flex-1 rounded-xl border border-foreground/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/25"
                  />
                  <Button type="submit" disabled={send.isPending || !draft.trim()}>
                    {t.whatsappPage.send}
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center px-6 text-sm text-foreground/40">
                {t.whatsappPage.selectConversation}
              </div>
            )}
          </section>
        </div>
      </motion.div>
    </ClinicPageFrame>
  );
}
