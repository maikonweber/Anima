"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useSendWhatsAppPatientMessage } from "@/hooks/use-whatsapp";
import {
  buildTeleconsultPatientUrl,
  buildTeleconsultWhatsAppMessage,
} from "@/lib/teleconsult";

type Props = {
  orgId: string;
  patientId: string;
  roomCode: string;
  patientJoinUrl?: string | null;
  /** Layout compacto para uso dentro da sala. */
  compact?: boolean;
};

export function TeleconsultPatientLinkPanel({
  orgId,
  patientId,
  roomCode,
  patientJoinUrl,
  compact = false,
}: Props) {
  const sendWhatsApp = useSendWhatsAppPatientMessage(orgId);
  const [copied, setCopied] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  const patientUrl = useMemo(
    () => buildTeleconsultPatientUrl(roomCode, patientJoinUrl),
    [patientJoinUrl, roomCode],
  );

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(patientUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [patientUrl]);

  const sendLinkViaWhatsApp = useCallback(async () => {
    try {
      await sendWhatsApp.mutateAsync({
        patientId,
        body: buildTeleconsultWhatsAppMessage(roomCode, patientJoinUrl),
      });
      setWhatsappSent(true);
      window.setTimeout(() => setWhatsappSent(false), 3000);
    } catch {
      /* error shown via sendWhatsApp.error */
    }
  }, [patientId, patientJoinUrl, roomCode, sendWhatsApp]);

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {!compact && (
        <p className="text-sm text-foreground/60">
          Código: <code className="font-mono">{roomCode}</code>
        </p>
      )}

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
          Link para o paciente
        </p>
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-3">
          <a
            href={patientUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-anima-violet hover:underline break-all"
          >
            {patientUrl}
          </a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="secondary"
          className={compact ? "!w-auto !py-2 !px-4 text-xs" : "sm:flex-1"}
          onClick={copyLink}
        >
          {copied ? "Link copiado!" : "Copiar link"}
        </Button>
        <Button
          type="button"
          className={
            compact
              ? "!w-auto !py-2 !px-4 text-xs !bg-[#25D366]"
              : "sm:flex-1 !bg-[#25D366] hover:!shadow-[#25D366]/20 hover:!shadow-lg"
          }
          onClick={sendLinkViaWhatsApp}
          isLoading={sendWhatsApp.isPending}
          disabled={whatsappSent}
        >
          {whatsappSent ? "Enviado no WhatsApp!" : "Enviar via WhatsApp"}
        </Button>
      </div>

      {sendWhatsApp.error && (
        <p className="text-xs text-red-400">
          {sendWhatsApp.error instanceof Error
            ? sendWhatsApp.error.message
            : "Não foi possível enviar pelo WhatsApp. Verifique se o número da clínica está conectado e se o paciente tem telefone cadastrado."}
        </p>
      )}
    </div>
  );
}
