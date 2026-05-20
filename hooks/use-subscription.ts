"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  checkout,
  fetchPlans,
  fetchSubscriptionMe,
  openBillingPortal,
} from "@/lib/api/subscription";
import type { PlanSlug } from "@/types/subscription";
import { useAuth } from "@/providers/auth-provider";

export {
  usagePercent,
  isNearLimit,
  formatLimit,
  formatResetsAt,
} from "@/lib/subscription/utils";

export function usePlans() {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: fetchPlans,
  });
}

export function useSubscriptionMe(enabled = true) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["subscription-me"],
    queryFn: fetchSubscriptionMe,
    enabled: enabled && !!user,
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: (planSlug: Exclude<PlanSlug, "essencial">) => checkout(planSlug),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: openBillingPortal,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });
}
