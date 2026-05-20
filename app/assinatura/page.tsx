"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ApiError } from "@/lib/api-client";
import { PlanCard } from "@/components/subscription/PlanCard";
import { SubscriptionUsagePanel } from "@/components/subscription/SubscriptionUsagePanel";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import { useCheckout, usePlans } from "@/hooks/use-subscription";
import { useAuth } from "@/providers/auth-provider";
import { useSubscription } from "@/providers/subscription-provider";
import type { PlanSlug } from "@/types/subscription";

export default function AssinaturaPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse h-96 bg-foreground/[0.06] rounded-2xl" />
      }
    >
      <AssinaturaPageContent />
    </Suspense>
  );
}

function AssinaturaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { planSlug, subscription } = useSubscription();
  const { data: plans, isLoading, error, refetch } = usePlans();
  const checkout = useCheckout();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const highlightPlan = searchParams.get("plan") as PlanSlug | null;

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent("/assinatura")}`);
    }
  }, [authLoading, user, router]);

  async function handleSubscribe(slug: Exclude<PlanSlug, "essencial">) {
    setCheckoutError(null);
    try {
      await checkout.mutateAsync(slug);
    } catch (err) {
      setCheckoutError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível iniciar o checkout.",
      );
    }
  }

  if (authLoading || !user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-foreground/[0.06] rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-foreground/[0.06] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const sortedPlans = [...(plans ?? [])].sort((a, b) => {
    const order: PlanSlug[] = ["essencial", "pleno", "cuidado"];
    return order.indexOf(a.slug) - order.indexOf(b.slug);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          Planos
        </h1>
        <p className="text-sm text-foreground/40 mb-8">
          Escolha o plano ideal para sua jornada emocional
        </p>

        {error && (
          <ErrorMessage
            message="Não foi possível carregar os planos."
            onRetry={() => refetch()}
          />
        )}

        {checkoutError && (
          <div className="mb-6">
            <ErrorMessage message={checkoutError} />
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-foreground/[0.06] animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && sortedPlans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {sortedPlans.map((plan) => (
              <div
                key={plan.slug}
                className={
                  highlightPlan === plan.slug
                    ? "ring-2 ring-anima-lilac/50 rounded-2xl"
                    : ""
                }
              >
                <PlanCard
                  plan={plan}
                  isCurrent={plan.slug === planSlug}
                  onSubscribe={handleSubscribe}
                  isLoading={checkout.isPending}
                />
              </div>
            ))}
          </div>
        )}

        {subscription?.usage && (
          <SubscriptionUsagePanel usage={subscription.usage} />
        )}

        {subscription && planSlug !== "essencial" && (
          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={() => router.push("/assinatura/gerenciar")}
            >
              Gerenciar assinatura
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
