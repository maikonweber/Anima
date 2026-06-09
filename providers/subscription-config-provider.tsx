"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useSubscriptionConfig } from "@/hooks/use-subscription-config";

interface SubscriptionConfigContextValue {
  paymentsEnabled: boolean;
  stripePublishableKey: string | null;
  isLoading: boolean;
}

const SubscriptionConfigContext =
  createContext<SubscriptionConfigContextValue | null>(null);

export function SubscriptionConfigProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data, isLoading } = useSubscriptionConfig();

  const value = useMemo<SubscriptionConfigContextValue>(
    () => ({
      paymentsEnabled: data?.paymentsEnabled ?? false,
      stripePublishableKey: data?.stripePublishableKey ?? null,
      isLoading,
    }),
    [data?.paymentsEnabled, data?.stripePublishableKey, isLoading],
  );

  return (
    <SubscriptionConfigContext.Provider value={value}>
      {children}
    </SubscriptionConfigContext.Provider>
  );
}

export function useSubscriptionConfigContext() {
  const ctx = useContext(SubscriptionConfigContext);
  if (!ctx) {
    throw new Error(
      "useSubscriptionConfigContext must be used within SubscriptionConfigProvider",
    );
  }
  return ctx;
}
