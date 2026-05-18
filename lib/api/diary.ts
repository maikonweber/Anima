import { api, ApiError } from "@/lib/api-client";
import type {
  CreateDiaryEntry,
  DeleteDiaryEntryResponse,
  DiaryAnalysis,
  DiaryEntriesQuery,
  DiaryEntryDetail,
  Emotion,
  PaginatedDiaryEntries,
  UpdateDiaryEntry,
  WeekSummary,
} from "@/lib/types";

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchEmotions() {
  return api<Emotion[]>("/emotions");
}

export async function createDiaryEntry(data: CreateDiaryEntry) {
  return api<DiaryEntryDetail>("/diary-entries", {
    method: "POST",
    body: JSON.stringify(data),
    auth: true,
  });
}

export async function fetchDiaryEntries(query: DiaryEntriesQuery = {}) {
  const qs = buildQuery({
    page: query.page ?? 1,
    limit: query.limit ?? 20,
    from: query.from,
    to: query.to,
  });
  return api<PaginatedDiaryEntries>(`/diary-entries${qs}`, { auth: true });
}

export async function fetchDiaryEntry(id: string) {
  return api<DiaryEntryDetail>(`/diary-entries/${id}`, { auth: true });
}

export async function updateDiaryEntry(id: string, data: UpdateDiaryEntry) {
  return api<DiaryEntryDetail>(`/diary-entries/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    auth: true,
  });
}

export async function deleteDiaryEntry(id: string) {
  return api<DeleteDiaryEntryResponse>(`/diary-entries/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function fetchWeekSummary() {
  return api<WeekSummary>("/diary-entries/week-summary", { auth: true });
}

export async function analyzeDiaryEntry(id: string) {
  return api<DiaryAnalysis>(`/diary-entries/${id}/analyze`, {
    method: "POST",
    auth: true,
  });
}

export async function fetchDiaryAnalysis(id: string) {
  try {
    return await api<DiaryAnalysis>(`/diary-entries/${id}/analysis`, {
      auth: true,
    });
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
