"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useBillingPortal } from "@/hooks/use-subscription";
import { useAuth } from "@/providers/auth-provider";
import { useSubscription } from "@/providers/subscription-provider";

export default function AssinaturaGerenciarPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { planSlug, hasPaidSubscription, subscription } = useSubscription();
  const portal = useBillingPortal();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(
        `/login?redirect=${encodeURIComponent("/assinatura/gerenciar")}`,
      );
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!authLoading && user && !hasPaidSubscription && planSlug === "essencial") {
      router.replace("/assinatura");
    }
  }, [authLoading, user, hasPaidSubscription, planSlug, router]);

  async function openPortal() {
    setError(null);
    try {
      await portal.mutateAsync();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível abrir o portal de cobrança.",
      );
    }
  }

  if (authLoading || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 animate-pulse">
        <div className="h-40 rounded-2xl bg-foreground/[0.06]" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Link
        href="/assinatura"
        className="text-sm text-anima-violet hover:text-anima-lilac mb-6 inline-block"
      >
        ← Voltar aos planos
      </Link>

      <div className="glass-panel p-6">
        <h1 className="text-xl font-bold text-foreground/90 mb-2">
          Gerenciar assinatura
        </h1>
        <p className="text-sm text-foreground/45 mb-1">
          Plano atual:{" "}
          <strong className="text-foreground/70">
            {subscription?.plan.nome ?? planSlug}
          </strong>
        </p>
        {subscription?.currentPeriodEnd && (
          <p className="text-xs text-foreground/35 mb-6">
            Próxima renovação:{" "}
            {new Date(subscription.currentPeriodEnd).toLocaleDateString(
              "pt-BR",
            )}
          </p>
        )}

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <Button onClick={openPortal} isLoading={portal.isPending}>
          Abrir portal Stripe
        </Button>
        <p className="text-[10px] text-foreground/30 mt-4">
          Altere cartão, cancele ou atualize sua assinatura no portal seguro do
          Stripe.
        </p>
      </div>
    </div>
  );
}
