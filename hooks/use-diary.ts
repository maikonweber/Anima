"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  analyzeDiaryEntry,
  createDiaryEntry,
  deleteDiaryEntry,
  fetchDiaryAnalysis,
  fetchDiaryEntries,
  fetchDiaryEntry,
  fetchEmotions,
  fetchWeekSummary,
  updateDiaryEntry,
} from "@/lib/api/diary";
import type {
  CreateDiaryEntry,
  DiaryEntriesQuery,
  UpdateDiaryEntry,
} from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

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

export function useDiaryAnalysis(entryId: string, enabled = true) {
  return useQuery({
    queryKey: ["diary-analysis", entryId],
    queryFn: () => fetchDiaryAnalysis(entryId),
    enabled: !!entryId && enabled,
  });
}

export function useCreateDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDiaryEntry) => createDiaryEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
      queryClient.invalidateQueries({ queryKey: ["week-summary"] });
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
    },
  });
}

export function useAnalyzeDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => analyzeDiaryEntry(entryId),
    onSuccess: (data, entryId) => {
      queryClient.setQueryData(["diary-analysis", entryId], data);
      queryClient.invalidateQueries({ queryKey: ["week-summary"] });
    },
  });
}
