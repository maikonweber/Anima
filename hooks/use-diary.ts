"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  analyzeDiaryEntry,
  createDiaryEntry,
  fetchDiaryAnalysis,
  fetchDiaryEntry,
  fetchEmotions,
  fetchUserDiaryEntries,
  fetchWeekSummary,
} from "@/lib/api/diary";
import type { DiaryEntryInput } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

export function useEmotions() {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["emotions"],
    queryFn: () => fetchEmotions(getToken() ?? undefined),
  });
}

export function useWeekSummary() {
  const { user, getToken } = useAuth();
  return useQuery({
    queryKey: ["week-summary", user?.id],
    queryFn: () => fetchWeekSummary(user!.id, getToken() ?? undefined),
    enabled: !!user?.id,
  });
}

export function useDiaryEntries() {
  const { user, getToken } = useAuth();
  return useQuery({
    queryKey: ["diary-entries", user?.id],
    queryFn: () => fetchUserDiaryEntries(user!.id, getToken() ?? undefined),
    enabled: !!user?.id,
  });
}

export function useDiaryEntry(id: string) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["diary-entry", id],
    queryFn: () => fetchDiaryEntry(id, getToken() ?? undefined),
    enabled: !!id,
  });
}

export function useDiaryAnalysis(entryId: string, enabled = true) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["diary-analysis", entryId],
    queryFn: () => fetchDiaryAnalysis(entryId, getToken() ?? undefined),
    enabled: !!entryId && enabled,
  });
}

export function useCreateDiaryEntry() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DiaryEntryInput) =>
      createDiaryEntry(data, getToken() ?? undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
      queryClient.invalidateQueries({ queryKey: ["week-summary"] });
    },
  });
}

export function useAnalyzeDiaryEntry() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) =>
      analyzeDiaryEntry(entryId, getToken() ?? undefined),
    onSuccess: (data, entryId) => {
      queryClient.setQueryData(["diary-analysis", entryId], data);
      queryClient.invalidateQueries({ queryKey: ["week-summary"] });
    },
  });
}
