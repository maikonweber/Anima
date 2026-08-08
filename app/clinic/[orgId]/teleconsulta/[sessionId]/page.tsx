"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { TeleconsultFeatureGate } from "@/components/clinic/TeleconsultDisabledNotice";
import { useTeleconsult } from "@/hooks/use-teleconsult";
import { buildTeleconsultProfessionalUrl } from "@/lib/teleconsult";

/**
 * Entrada legada do painel clínico → sala canônica do profissional
 * (`/teleconsulta/{roomCode}/profissional`).
 */
export default function ClinicTeleconsultPage() {
  const params = useParams<{ orgId: string; sessionId: string }>();
  const { orgId, sessionId } = params;
  const router = useRouter();
  const { data, isLoading, error, refetch } = useTeleconsult(orgId, sessionId);

  useEffect(() => {
    if (!data?.roomCode) return;
    const path = `/teleconsulta/${encodeURIComponent(data.roomCode)}/profissional`;
    router.replace(path);
  }, [data?.roomCode, router]);

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
          <h1 className="text-2xl font-bold text-foreground/90 mb-2">
            Teleconsulta
          </h1>
          <p className="text-sm text-foreground/45 mb-6">
            Abrindo a sala do profissional…
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

          {data?.roomCode && (
            <p className="text-sm text-foreground/50">
              Se não redirecionar,{" "}
              <Link
                href={`/teleconsulta/${encodeURIComponent(data.roomCode)}/profissional`}
                className="text-anima-violet hover:underline"
              >
                abra a sala do profissional
              </Link>
              {" · "}
              <span className="text-foreground/35 break-all">
                {buildTeleconsultProfessionalUrl(data.roomCode)}
              </span>
            </p>
          )}
        </motion.div>
      </div>
    </TeleconsultFeatureGate>
  );
}
