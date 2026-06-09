"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/auth-provider";
import { useSubscription } from "@/providers/subscription-provider";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 10;

export default function AssinaturaSucessoPage() {
  const router = useRouter();
  const { refreshUser, isLoading } = useAuth();
  const { planSlug, hasPaidSubscription } = useSubscription();
  const [ready, setReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const syncSubscription = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshUser();
    } finally {
      setRefreshing(false);
      setReady(true);
    }
  }, [refreshUser]);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      if (cancelled) return;
      await syncSubscription();
      attempts += 1;
      if (!cancelled && attempts < MAX_POLL_ATTEMPTS && !hasPaidSubscription) {
        timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    void poll();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [syncSubscription, hasPaidSubscription]);

  const planUpdated = hasPaidSubscription || planSlug !== "essencial";

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-panel p-8"
      >
        <p className="text-4xl mb-4" aria-hidden>
          ✓
        </p>
        <h1 className="text-xl font-bold text-foreground/90 mb-2">
          Pagamento confirmado
        </h1>
        <p className="text-sm text-foreground/45 mb-4">
          {isLoading || !ready || refreshing
            ? "Atualizando seu plano..."
            : planUpdated
              ? "Seu plano foi atualizado. Boas-vindas à próxima etapa da sua rotina na EmotiveCare."
              : "O pagamento foi recebido. Se o plano ainda não aparecer, aguarde alguns segundos — o webhook do Stripe pode levar um momento."}
        </p>
        {!planUpdated && ready && !refreshing && (
          <p className="text-xs text-foreground/35 mb-6">
            Plano atual: {planSlug}
          </p>
        )}
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => router.push("/diary")}
            disabled={!ready}
            isLoading={!ready && !refreshing}
          >
            Ir para a linha do tempo
          </Button>
          <Button
            variant="secondary"
            onClick={() => syncSubscription()}
            isLoading={refreshing}
            disabled={refreshing}
          >
            Atualizar plano
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
