"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFeatureFlags } from "@/lib/api/feature-flags";

export function useFeatureFlags() {
  return useQuery({
    queryKey: ["feature-flags"],
    queryFn: fetchFeatureFlags,
    staleTime: 60_000,
    retry: 2,
  });
}
