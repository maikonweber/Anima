"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { configureApiClient } from "@/lib/api-client";
import { PaywallModal } from "@/components/subscription/PaywallModal";
import { useAuth } from "@/providers/auth-provider";
import { useFeatureFlagsContext } from "@/providers/feature-flags-provider";
import { useSubscriptionConfigContext } from "@/providers/subscription-config-provider";
import type { PlanLimitError, PlanSlug, SubscriptionSummary } from "@/types/subscription";

interface SubscriptionContextValue {
  subscription: SubscriptionSummary | null;
  planSlug: PlanSlug;
  usage: SubscriptionSummary["usage"] | null;
  isPleno: boolean;
  isCuidado: boolean;
  isEssencial: boolean;
  isPreviewPlan: boolean;
  /** CRM /clinic — exclusivo Cuidado (ou preview). Free e Pleno = false. */
  canAccessClinic: boolean;
  previewMode: boolean;
  sponsoredByPsychologist: boolean;
  /** Stripe 100% configurado no backend — informativo */
  paymentsEnabled: boolean;
  /** Exibir CTAs de upgrade/checkout */
  checkoutEnabled: boolean;
  shouldSuggestUpgrade: boolean;
  canShareDashboard: boolean;
  canViewSharedDashboard: boolean;
  hasPaidSubscription: boolean;
  showPaywall: (error: PlanLimitError) => void;
  closePaywall: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null,
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { previewMode: featurePreviewMode } = useFeatureFlagsContext();
  const { paymentsEnabled, checkoutEnabled } = useSubscriptionConfigContext();
  const [paywallError, setPaywallError] = useState<PlanLimitError | null>(null);

  const showPaywall = useCallback(
    (error: PlanLimitError) => {
      if (featurePreviewMode) return;
      setPaywallError(error);
    },
    [featurePreviewMode],
  );

  const closePaywall = useCallback(() => {
    setPaywallError(null);
  }, []);

  useEffect(() => {
    configureApiClient({
      onPaymentRequired: showPaywall,
    });
  }, [showPaywall]);

  const subscription = user?.subscription ?? null;
  const planSlug = subscription?.plan.slug ?? "essencial";
  const limits = subscription?.plan.limits;
  const sponsoredByPsychologist =
    subscription?.sponsoredByPsychologist === true;
  const previewMode =
    featurePreviewMode ||
    subscription?.preview === true ||
    planSlug === "preview";
  const isPreviewPlan = planSlug === "preview" || subscription?.preview === true;
  // Allowlist explícita — Pleno/essencial nunca abrem o CRM.
  const canAccessClinic = planSlug === "cuidado" || isPreviewPlan;

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      subscription,
      planSlug,
      usage: subscription?.usage ?? null,
      isPleno: planSlug === "pleno",
      isCuidado: planSlug === "cuidado",
      isEssencial: planSlug === "essencial",
      isPreviewPlan,
      canAccessClinic,
      previewMode,
      sponsoredByPsychologist,
      paymentsEnabled,
      checkoutEnabled,
      shouldSuggestUpgrade:
        planSlug === "essencial" &&
        !sponsoredByPsychologist &&
        !previewMode &&
        checkoutEnabled &&
        !(
          !!subscription?.currentPeriodEnd &&
          (subscription.status === "active" ||
            subscription.status === "trialing" ||
            subscription.status === "past_due")
        ),
      canShareDashboard: limits?.canShareDashboard ?? false,
      canViewSharedDashboard: limits?.canViewSharedDashboard ?? false,
      hasPaidSubscription:
        (planSlug === "pleno" || planSlug === "cuidado") &&
        !!subscription?.currentPeriodEnd &&
        (subscription.status === "active" ||
          subscription.status === "trialing" ||
          subscription.status === "past_due"),
      showPaywall,
      closePaywall,
    }),
    [
      subscription,
      planSlug,
      limits,
      isPreviewPlan,
      canAccessClinic,
      previewMode,
      sponsoredByPsychologist,
      paymentsEnabled,
      checkoutEnabled,
      showPaywall,
      closePaywall,
    ],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
      <PaywallModal
        error={paywallError}
        onClose={closePaywall}
        previewMode={previewMode}
        checkoutEnabled={checkoutEnabled}
      />
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return ctx;
}
