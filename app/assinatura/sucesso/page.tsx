"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/auth-provider";

export default function AssinaturaSucessoPage() {
  const router = useRouter();
  const { refreshUser, isLoading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refreshUser();
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

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
          Assinatura ativa
        </h1>
        <p className="text-sm text-foreground/45 mb-8">
          {isLoading || !ready
            ? "Atualizando seu plano..."
            : "Seu plano foi atualizado. Aproveite os novos recursos!"}
        </p>
        <Button
          onClick={() => router.push("/diary")}
          disabled={!ready}
          isLoading={!ready}
        >
          Ir para o diário
        </Button>
      </motion.div>
    </div>
  );
}
