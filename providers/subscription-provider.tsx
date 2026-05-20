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
import type { PlanLimitError, PlanSlug, SubscriptionSummary } from "@/types/subscription";

interface SubscriptionContextValue {
  subscription: SubscriptionSummary | null;
  planSlug: PlanSlug;
  usage: SubscriptionSummary["usage"] | null;
  isPleno: boolean;
  isCuidado: boolean;
  isEssencial: boolean;
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
  const [paywallError, setPaywallError] = useState<PlanLimitError | null>(null);

  const showPaywall = useCallback((error: PlanLimitError) => {
    setPaywallError(error);
  }, []);

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

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      subscription,
      planSlug,
      usage: subscription?.usage ?? null,
      isPleno: planSlug === "pleno",
      isCuidado: planSlug === "cuidado",
      isEssencial: planSlug === "essencial",
      canShareDashboard: limits?.canShareDashboard ?? false,
      canViewSharedDashboard: limits?.canViewSharedDashboard ?? false,
      hasPaidSubscription:
        planSlug !== "essencial" &&
        !!subscription?.currentPeriodEnd &&
        (subscription.status === "active" ||
          subscription.status === "trialing" ||
          subscription.status === "past_due"),
      showPaywall,
      closePaywall,
    }),
    [subscription, planSlug, limits, showPaywall, closePaywall],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
      <PaywallModal error={paywallError} onClose={closePaywall} />
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
