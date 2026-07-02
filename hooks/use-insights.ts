"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAchievements,
  fetchCorrelations,
  fetchMonthlyReport,
  fetchStreak,
  fetchTrends,
} from "@/lib/api/insights";
import { getAssistantSuggestions } from "@/lib/api/assistant";
import { useAuth } from "@/providers/auth-provider";

export const STREAK_QUERY_KEY = "insights-streak";
export const ACHIEVEMENTS_QUERY_KEY = "insights-achievements";

export function useStreak() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [STREAK_QUERY_KEY],
    queryFn: fetchStreak,
    enabled: !!user,
  });
}

export function useAchievements() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [ACHIEVEMENTS_QUERY_KEY],
    queryFn: fetchAchievements,
    enabled: !!user,
  });
}

export function useTrends(days = 30) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["insights-trends", days],
    queryFn: () => fetchTrends(days),
    enabled: !!user,
  });
}

export function useMonthlyReport(month?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["insights-monthly-report", month ?? "current"],
    queryFn: () => fetchMonthlyReport(month),
    enabled: !!user,
  });
}

export function useCorrelations(days = 90) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["insights-correlations", days],
    queryFn: () => fetchCorrelations(days),
    enabled: !!user,
  });
}

export function useAssistantSuggestions(enabled = true) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["assistant-suggestions"],
    queryFn: getAssistantSuggestions,
    enabled: enabled && !!user,
    staleTime: 5 * 60 * 1000,
  });
}
