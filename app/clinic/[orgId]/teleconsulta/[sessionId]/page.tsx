"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TeleconsultRoom } from "@/components/clinic/TeleconsultRoom";
import { useTeleconsult } from "@/hooks/use-teleconsult";
import { useMyOrganizations } from "@/hooks/use-organizations";
import { useAuth } from "@/providers/auth-provider";

export default function ClinicTeleconsultPage() {
  const params = useParams<{ orgId: string; sessionId: string }>();
  const { orgId, sessionId } = params;
  const { user } = useAuth();
  const { data: orgs } = useMyOrganizations();
  const { data, isLoading, error, refetch } = useTeleconsult(orgId, sessionId);
  const [entered, setEntered] = useState(false);

  const role = useMemo(
    () =>
      orgs?.find((item) => item.organization.id === orgId)?.membership.role,
    [orgs, orgId],
  );

  const isInitiator =
    role === "CLINIC_ADMIN" ||
    (role === "PROFESSIONAL" && data?.professionalUserId === user?.id);

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
            <p className="text-xs text-foreground/40">
              Paciente pode entrar em /teleconsulta/{data.roomCode}
            </p>
            <Button type="button" onClick={() => setEntered(true)}>
              Entrar na sala
            </Button>
          </div>
        )}

        {data && entered && (
          <TeleconsultRoom session={data} isInitiator={!!isInitiator} />
        )}
      </motion.div>
    </div>
  );
}
