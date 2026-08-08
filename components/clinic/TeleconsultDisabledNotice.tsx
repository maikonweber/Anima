"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useFeatureFlagsContext } from "@/providers/feature-flags-provider";

type Props = {
  backHref?: string;
  backLabel?: string;
};

export function TeleconsultDisabledNotice({
  backHref,
  backLabel = "← Voltar à agenda",
}: Props) {
  const params = useParams<{ orgId?: string }>();
  const href = backHref ?? (params.orgId ? `/clinic/${params.orgId}/agenda` : "/");

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 space-y-4"
      >
        <h1 className="text-xl font-bold text-foreground/90">
          Teleconsulta integrada indisponível
        </h1>
        <p className="text-sm text-foreground/55 leading-relaxed">
          A sala de vídeo integrada está temporariamente desativada. O
          profissional deve cadastrar o link do Google Meet na sessão da agenda.
        </p>
        <Link href={href}>
          <Button type="button" variant="secondary" className="w-auto">
            {backLabel}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export function TeleconsultFeatureGate({
  children,
  backHref,
  backLabel,
}: Props & { children: ReactNode }) {
  const { teleconsult, isLoading } = useFeatureFlagsContext();

  if (isLoading) {
    return (
      <div className="h-48 rounded-2xl bg-foreground/[0.06] animate-pulse mx-4 my-8" />
    );
  }

  if (!teleconsult) {
    return (
      <TeleconsultDisabledNotice backHref={backHref} backLabel={backLabel} />
    );
  }

  return <>{children}</>;
}
