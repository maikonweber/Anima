"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  listTeleconsultMessages,
  postTeleconsultMessage,
} from "@/lib/api/teleconsult";
import type { TeleconsultMessage } from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

type Props = {
  orgId: string;
  sessionId: string;
  disabled?: boolean;
  className?: string;
};

export function TeleconsultChat({
  orgId,
  sessionId,
  disabled,
  className = "",
}: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<TeleconsultMessage[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const afterId = useRef<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stopped = false;
    async function poll() {
      while (!stopped) {
        try {
          const batch = await listTeleconsultMessages(orgId, sessionId, {
            afterId: afterId.current,
            limit: 50,
          });
          if (batch.length > 0) {
            afterId.current = batch[batch.length - 1]?.id;
            setMessages((prev) => {
              const ids = new Set(prev.map((m) => m.id));
              const next = [...prev];
              for (const msg of batch) {
                if (!ids.has(msg.id)) next.push(msg);
              }
              return next;
            });
          }
        } catch {
          // keep polling
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    void poll();
    return () => {
      stopped = true;
    };
  }, [orgId, sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!body.trim() || disabled) return;
    setSending(true);
    setError(null);
    try {
      const msg = await postTeleconsultMessage(orgId, sessionId, {
        body: body.trim(),
      });
      setMessages((prev) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
      );
      afterId.current = msg.id;
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className={`teleconsult-chat glass-panel flex flex-col min-h-0 min-w-0 ${className}`}
    >
      <div className="shrink-0 px-3 py-2.5 border-b border-foreground/[0.06]">
        <p className="text-xs font-semibold text-foreground/70">Chat da sessão</p>
      </div>

      <div className="teleconsult-chat-messages flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-2">
        {messages.length === 0 && (
          <p className="text-[11px] text-foreground/35 py-1">
            Nenhuma mensagem ainda.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.authorUserId === user?.id;
          return (
            <div
              key={m.id}
              className={`text-sm max-w-[88%] rounded-2xl px-3 py-2 leading-snug break-words ${
                mine
                  ? "ml-auto bg-anima-violet/18 text-foreground/90"
                  : "mr-auto bg-foreground/[0.05] text-foreground/80"
              }`}
            >
              {m.deleted ? (
                <span className="italic text-foreground/35">Removida</span>
              ) : (
                m.body
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => void handleSend(e)}
        className="shrink-0 p-2 sm:p-3 border-t border-foreground/[0.06] flex flex-col sm:flex-row gap-2"
      >
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={disabled || sending}
          placeholder={disabled ? "Sessão encerrada" : "Mensagem…"}
          className="teleconsult-chat-input min-w-0 flex-1 rounded-xl px-3 py-2.5 text-sm bg-foreground/[0.03] border border-foreground/[0.08] focus:outline-none focus:ring-2 focus:ring-anima-violet/25"
          maxLength={4000}
        />
        <Button
          type="submit"
          fullWidth={false}
          isLoading={sending}
          disabled={disabled}
          className="!py-2.5 !px-4 shrink-0 sm:min-w-[5.5rem]"
        >
          Enviar
        </Button>
      </form>

      {error && (
        <p className="shrink-0 px-3 pb-2 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
