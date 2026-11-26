"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDiaryEntries } from "@/lib/api/diary";
import type { DiaryEntry } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

const PAGE_SIZE = 50;
const MAX_PAGES = 20;

async function fetchAllEntriesInRange(from: string, to: string): Promise<DiaryEntry[]> {
  const all: DiaryEntry[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await fetchDiaryEntries({ page, limit: PAGE_SIZE, from, to });
    all.push(...result.data);
    totalPages = Math.max(1, result.meta.totalPages || 1);
    page += 1;
  } while (page <= totalPages && page <= MAX_PAGES);

  return all;
}

export function useDiaryRange(from: string, to: string, enabled = true) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["diary-entries-range", from, to],
    queryFn: () => fetchAllEntriesInRange(from, to),
    enabled: Boolean(user && enabled && from && to),
  });
}
