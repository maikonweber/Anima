"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import {
  analyzeDiaryEntry,
  createDiaryEntry,
  deleteDiaryEntry,
  fetchDiaryAnalysis,
  fetchDiaryEntries,
  fetchDiaryEntry,
  fetchEmotions,
  fetchWeekSummary,
  searchDiaryEntries,
  updateDiaryEntry,
} from "@/lib/api/diary";
import type {
  CreateDiaryEntry,
  DiaryEntriesQuery,
  UpdateDiaryEntry,
} from "@/lib/types";
import {
  ACHIEVEMENTS_QUERY_KEY,
  STREAK_QUERY_KEY,
} from "@/hooks/use-insights";
import { useAuth } from "@/providers/auth-provider";

function useRefreshSubscription() {
  const { refreshUser } = useAuth();
  return refreshUser;
}

/** Invalida os dados de engajamento (streak/conquistas) após mudanças no diário. */
function invalidateEngagement(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: [STREAK_QUERY_KEY] });
  queryClient.invalidateQueries({ queryKey: [ACHIEVEMENTS_QUERY_KEY] });
}

export function useEmotions() {
  return useQuery({
    queryKey: ["emotions"],
    queryFn: fetchEmotions,
  });
}

export function useWeekSummary() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["week-summary"],
    queryFn: fetchWeekSummary,
    enabled: !!user,
  });
}

export function useDiaryEntries(query: DiaryEntriesQuery = {}) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["diary-entries", query],
    queryFn: () => fetchDiaryEntries(query),
    enabled: !!user,
  });
}

export function useDiaryEntry(id: string) {
  return useQuery({
    queryKey: ["diary-entry", id],
    queryFn: () => fetchDiaryEntry(id),
    enabled: !!id,
  });
}

export function useDiarySearch(q: string, limit = 10) {
  const { user } = useAuth();
  const term = q.trim();
  return useQuery({
    queryKey: ["diary-search", term, limit],
    queryFn: () => searchDiaryEntries(term, limit),
    enabled: !!user && term.length > 0,
    placeholderData: keepPreviousData,
  });
}

export function useDiaryAnalysis(entryId: string, enabled = true) {
  return useQuery({
    queryKey: ["diary-analysis", entryId],
    queryFn: () => fetchDiaryAnalysis(entryId),
    enabled: !!entryId && enabled,
  });
}

export function useCreateDiaryEntry() {
  const queryClient = useQueryClient();
  const refreshUser = useRefreshSubscription();

  return useMutation({
    mutationFn: (data: CreateDiaryEntry) => createDiaryEntry(data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
      queryClient.invalidateQueries({ queryKey: ["week-summary"] });
      invalidateEngagement(queryClient);
      await refreshUser();
    },
  });
}

export function useUpdateDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDiaryEntry }) =>
      updateDiaryEntry(id, data),
    onSuccess: (entry) => {
      queryClient.setQueryData(["diary-entry", entry.id], entry);
      queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
      queryClient.invalidateQueries({ queryKey: ["week-summary"] });
      invalidateEngagement(queryClient);
    },
  });
}

export function useDeleteDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDiaryEntry(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ["diary-entry", id] });
      queryClient.removeQueries({ queryKey: ["diary-analysis", id] });
      queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
      queryClient.invalidateQueries({ queryKey: ["week-summary"] });
      invalidateEngagement(queryClient);
    },
  });
}

export function useAnalyzeDiaryEntry() {
  const queryClient = useQueryClient();
  const refreshUser = useRefreshSubscription();

  return useMutation({
    mutationFn: (entryId: string) => analyzeDiaryEntry(entryId),
    onSuccess: async (data, entryId) => {
      queryClient.setQueryData(["diary-analysis", entryId], data);
      queryClient.invalidateQueries({ queryKey: ["week-summary"] });
      invalidateEngagement(queryClient);
      await refreshUser();
    },
  });
}
