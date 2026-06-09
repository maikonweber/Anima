"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSubscriptionConfig } from "@/lib/api/subscription";

export function useSubscriptionConfig() {
  return useQuery({
    queryKey: ["subscription-config"],
    queryFn: fetchSubscriptionConfig,
    staleTime: 60_000,
    retry: 2,
  });
}
