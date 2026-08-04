"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  canSubscribeToPlan,
  getBilledPaidPlanSlug,
  getCheckoutErrorMessage,
  PLAN_TRACK_INCOMPATIBLE_MESSAGE,
} from "@/lib/subscription/checkout";
import { isCheckoutPlanSlug } from "@/lib/subscription/acquisition";
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
  const {
    planSlug,
    subscription,
    isPreviewPlan,
    previewMode,
    checkoutEnabled,
    sponsoredByPsychologist,
    hasPaidSubscription,
  } = useSubscription();
  const { data: plans, isLoading, error, refetch } = usePlans();
  const checkout = useCheckout();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const autoCheckoutStarted = useRef(false);

  const highlightPlan = searchParams.get("plan") as PlanSlug | null;
  const wantsAutoCheckout = searchParams.get("checkout") === "1";
  const billedPaidSlug = getBilledPaidPlanSlug({
    planSlug,
    sponsoredByPsychologist,
    hasPaidSubscription,
  });

  useEffect(() => {
    if (wantsAutoCheckout || !isCheckoutPlanSlug(highlightPlan)) return;
    try {
      sessionStorage.removeItem(`assinatura-auto-checkout:${highlightPlan}`);
    } catch {
      /* ignore */
    }
  }, [wantsAutoCheckout, highlightPlan]);

  useEffect(() => {
    if (!authLoading && !user) {
      const qs = searchParams.toString();
      const returnPath = qs ? `/assinatura?${qs}` : "/assinatura";
      router.replace(`/login?redirect=${encodeURIComponent(returnPath)}`);
    }
  }, [authLoading, user, router, searchParams]);

  async function handleSubscribe(
    slug: Exclude<PlanSlug, "essencial" | "preview">,
  ) {
    if (!canSubscribeToPlan(billedPaidSlug, slug)) {
      setCheckoutError(PLAN_TRACK_INCOMPATIBLE_MESSAGE);
      return;
    }
    setCheckoutError(null);
    try {
      await checkout.mutateAsync(slug);
    } catch (err) {
      setCheckoutError(getCheckoutErrorMessage(err));
    }
  }

  useEffect(() => {
    if (authLoading || !user || autoCheckoutStarted.current) return;
    if (!wantsAutoCheckout || !checkoutEnabled) return;
    if (!isCheckoutPlanSlug(highlightPlan)) return;

    const guardKey = `assinatura-auto-checkout:${highlightPlan}`;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(guardKey)) {
      return;
    }

    if (planSlug === highlightPlan) {
      autoCheckoutStarted.current = true;
      router.replace(`/assinatura?plan=${highlightPlan}`);
      return;
    }

    if (!canSubscribeToPlan(billedPaidSlug, highlightPlan)) {
      autoCheckoutStarted.current = true;
      setCheckoutError(PLAN_TRACK_INCOMPATIBLE_MESSAGE);
      router.replace(`/assinatura?plan=${highlightPlan}`);
      return;
    }

    autoCheckoutStarted.current = true;
    try {
      sessionStorage.setItem(guardKey, "1");
    } catch {
      /* private mode */
    }

    void (async () => {
      setCheckoutError(null);
      try {
        await checkout.mutateAsync(highlightPlan);
      } catch (err) {
        try {
          sessionStorage.removeItem(guardKey);
        } catch {
          /* ignore */
        }
        autoCheckoutStarted.current = false;
        setCheckoutError(getCheckoutErrorMessage(err));
        router.replace(`/assinatura?plan=${highlightPlan}`);
      }
    })();
    // checkout.mutateAsync is stable enough; omit `checkout` to avoid re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    authLoading,
    user,
    wantsAutoCheckout,
    checkoutEnabled,
    highlightPlan,
    planSlug,
    billedPaidSlug,
    router,
  ]);

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

  const sortedPlans = [...(plans ?? [])]
    .filter((p) => p.slug !== "preview")
    .sort((a, b) => {
      const order: PlanSlug[] = ["essencial", "pleno", "cuidado"];
      return order.indexOf(a.slug) - order.indexOf(b.slug);
    });

  const currentSlug =
    planSlug === "preview" ? ("essencial" as PlanSlug) : planSlug;

  const isAutoCheckingOut =
    wantsAutoCheckout &&
    checkoutEnabled &&
    isCheckoutPlanSlug(highlightPlan) &&
    planSlug !== highlightPlan &&
    canSubscribeToPlan(billedPaidSlug, highlightPlan) &&
    (checkout.isPending || !checkoutError);

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
        <p className="text-sm text-foreground/40 mb-4">
          Escolha o plano para expandir registros, insights SENTIO AI e vínculos com profissionais
        </p>
        {(previewMode || isPreviewPlan) && (
          <p className="text-xs text-foreground/45 mb-8 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            Modo demonstração ativo — limites exibidos refletem a API.
          </p>
        )}

        {isAutoCheckingOut && (
          <p className="text-sm text-foreground/50 mb-6">
            Redirecionando para o pagamento seguro…
          </p>
        )}

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
                  isCurrent={plan.slug === currentSlug}
                  isTrackIncompatible={
                    !canSubscribeToPlan(billedPaidSlug, plan.slug) &&
                    plan.slug !== currentSlug
                  }
                  onSubscribe={handleSubscribe}
                  isLoading={checkout.isPending}
                  checkoutEnabled={checkoutEnabled}
                />
              </div>
            ))}
          </div>
        )}

        {subscription?.usage && (
          <SubscriptionUsagePanel usage={subscription.usage} />
        )}

        {subscription && planSlug !== "essencial" && planSlug !== "preview" && (
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
