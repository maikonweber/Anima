"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TeleconsultPatientLinkPanel } from "@/components/clinic/TeleconsultPatientLinkPanel";
import { TeleconsultRoom } from "@/components/clinic/TeleconsultRoom";
import { TeleconsultFeatureGate } from "@/components/clinic/TeleconsultDisabledNotice";
import { useTeleconsult } from "@/hooks/use-teleconsult";
import { useAuth } from "@/providers/auth-provider";
import { useQueryClient } from "@tanstack/react-query";

export default function ClinicTeleconsultPage() {
  const params = useParams<{ orgId: string; sessionId: string }>();
  const { orgId, sessionId } = params;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useTeleconsult(orgId, sessionId);
  const [entered, setEntered] = useState(false);

  const viewerRole = data?.viewerRole;
  const isInitiator = Boolean(
    data &&
      user &&
      (data.professionalUserId === user.id ||
        data.viewerRole === "CLINIC_ADMIN"),
  );

  return (
    <TeleconsultFeatureGate backHref={`/clinic/${orgId}/agenda`}>
      <div className="teleconsult-page max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
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
        <p className="text-xs font-medium tracking-wide text-[var(--clinic-accent,#0d7377)] mb-2">
          Visão clínica
        </p>
        <h1 className="text-2xl font-bold text-foreground/90 mb-2">
          Teleconsulta
        </h1>
        <p className="text-sm text-foreground/45 mb-6">
          Sessão autenticada · requer consentimento TELECONSULTA
          {viewerRole ? ` · ${viewerRole === "PATIENT" ? "paciente" : "clínico"}` : ""}
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
            <TeleconsultPatientLinkPanel
              orgId={orgId}
              patientId={data.patientId}
              roomCode={data.roomCode}
              patientJoinUrl={data.patientJoinUrl}
            />
            <Button type="button" onClick={() => setEntered(true)}>
              Entrar na sala
            </Button>
          </div>
        )}

        {data && entered && (
          <TeleconsultRoom
            session={data}
            viewerRole={viewerRole ?? "PROFESSIONAL"}
            isInitiator={isInitiator}
            enablePostConsultBriefing
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
    </TeleconsultFeatureGate>
  );
}
