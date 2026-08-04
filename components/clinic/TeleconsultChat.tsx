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
};

export function TeleconsultChat({ orgId, sessionId, disabled }: Props) {
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
    <div className="glass-panel flex flex-col h-72 sm:h-80">
      <div className="px-3 py-2 border-b border-foreground/[0.06]">
        <p className="text-xs font-medium text-foreground/70">Chat da sessão</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {messages.length === 0 && (
          <p className="text-[11px] text-foreground/35">
            Nenhuma mensagem ainda.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.authorUserId === user?.id;
          return (
            <div
              key={m.id}
              className={`text-sm max-w-[85%] rounded-xl px-3 py-1.5 ${
                mine
                  ? "ml-auto bg-anima-violet/20 text-foreground/85"
                  : "bg-foreground/[0.05] text-foreground/75"
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
        className="p-2 border-t border-foreground/[0.06] flex gap-2"
      >
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={disabled || sending}
          placeholder={disabled ? "Sessão encerrada" : "Mensagem…"}
          className="flex-1 rounded-xl px-3 py-2 text-sm bg-foreground/[0.03] border border-foreground/[0.08]"
          maxLength={4000}
        />
        <Button type="submit" isLoading={sending} disabled={disabled}>
          Enviar
        </Button>
      </form>
      {error && <p className="px-3 pb-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
