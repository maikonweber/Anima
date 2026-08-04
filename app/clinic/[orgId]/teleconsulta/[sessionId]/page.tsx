"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TeleconsultRoom } from "@/components/clinic/TeleconsultRoom";
import { useTeleconsult } from "@/hooks/use-teleconsult";
import { useMyOrganizations } from "@/hooks/use-organizations";
import { useSendWhatsAppPatientMessage } from "@/hooks/use-whatsapp";
import { useAuth } from "@/providers/auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import {
  buildTeleconsultPatientUrl,
  buildTeleconsultWhatsAppMessage,
} from "@/lib/teleconsult";

export default function ClinicTeleconsultPage() {
  const params = useParams<{ orgId: string; sessionId: string }>();
  const { orgId, sessionId } = params;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: orgs } = useMyOrganizations();
  const { data, isLoading, error, refetch } = useTeleconsult(orgId, sessionId);
  const sendWhatsApp = useSendWhatsAppPatientMessage(orgId);
  const [entered, setEntered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  const patientUrl = useMemo(
    () => (data ? buildTeleconsultPatientUrl(data.roomCode) : ""),
    [data],
  );

  const role = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );

  const isInitiator =
    role === "CLINIC_ADMIN" ||
    (role === "PROFESSIONAL" && data?.professionalUserId === user?.id);

  const copyLink = useCallback(async () => {
    if (!patientUrl) return;
    try {
      await navigator.clipboard.writeText(patientUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [patientUrl]);

  const sendLinkViaWhatsApp = useCallback(async () => {
    if (!data) return;
    try {
      await sendWhatsApp.mutateAsync({
        patientId: data.patientId,
        body: buildTeleconsultWhatsAppMessage(data.roomCode),
      });
      setWhatsappSent(true);
      window.setTimeout(() => setWhatsappSent(false), 3000);
    } catch {
      /* error shown via sendWhatsApp.error */
    }
  }, [data, sendWhatsApp]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          href={`/clinic/${orgId}/agenda`}
          className="text-sm text-foreground/40 hover:text-anima-violet mb-4 inline-block"
        >
          ← Agenda
        </Link>
        <h1 className="text-2xl font-bold text-foreground/90 mb-2">
          Teleconsulta
        </h1>
        <p className="text-sm text-foreground/45 mb-6">
          Sessão autenticada · requer consentimento TELECONSULTA
        </p>

        {error && (
          <ErrorMessage
            message={
              error instanceof Error
                ? error.message
                : "Não foi possível carregar a teleconsulta."
            }
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="h-48 rounded-2xl bg-foreground/[0.06] animate-pulse" />
        )}

        {data && !entered && (
          <div className="glass-panel p-6 space-y-4">
            <p className="text-sm text-foreground/60">
              Código: <code className="font-mono">{data.roomCode}</code>
            </p>

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
                className="sm:flex-1"
                onClick={copyLink}
              >
                {copied ? "Link copiado!" : "Copiar link"}
              </Button>
              <Button
                type="button"
                className="sm:flex-1 !bg-[#25D366] hover:!shadow-[#25D366]/20 hover:!shadow-lg"
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

            <Button type="button" onClick={() => setEntered(true)}>
              Entrar na sala
            </Button>
          </div>
        )}

        {data && entered && (
          <TeleconsultRoom
            session={data}
            isInitiator={!!isInitiator}
            enablePostConsultBriefing={!!isInitiator}
            onEnded={(updated) => {
              queryClient.setQueryData(
                ["teleconsult", orgId, sessionId],
                updated,
              );
              router.push(`/clinic/${orgId}/agenda`);
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
