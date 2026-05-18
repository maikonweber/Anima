import { api, ApiError } from "@/lib/api-client";
import type {
  DiaryAnalysis,
  DiaryEntry,
  DiaryEntryInput,
  Emotion,
  WeekSummary,
} from "@/lib/types";

export async function fetchEmotions(token?: string) {
  return api<Emotion[]>("/emotions", { token });
}

export async function createDiaryEntry(data: DiaryEntryInput, token?: string) {
  return api<DiaryEntry>("/diary-entries", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export async function fetchDiaryEntry(id: string, token?: string) {
  return api<DiaryEntry>(`/diary-entries/${id}`, { token });
}

export async function fetchUserDiaryEntries(userId: string, token?: string) {
  return api<DiaryEntry[]>(`/users/${userId}/diary-entries`, { token });
}

export async function fetchWeekSummary(userId: string, token?: string) {
  return api<WeekSummary>(`/users/${userId}/diary-entries/week-summary`, {
    token,
  });
}

export async function analyzeDiaryEntry(id: string, token?: string) {
  return api<DiaryAnalysis>(`/diary-entries/${id}/analyze`, {
    method: "POST",
    token,
  });
}

export async function fetchDiaryAnalysis(id: string, token?: string) {
  try {
    return await api<DiaryAnalysis>(`/diary-entries/${id}/analysis`, { token });
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
