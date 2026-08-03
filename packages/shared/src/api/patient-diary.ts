import { api } from "../api-client";
import type {
  DiaryEntriesQuery,
  PaginatedDiaryEntries,
} from "../types";

function buildQuery(query: DiaryEntriesQuery = {}): string {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** Diário do paciente CRM com consentimento DIARIO_CHECKIN (clinic). */
export async function listPatientDiary(
  orgId: string,
  patientId: string,
  query?: DiaryEntriesQuery,
) {
  return api<PaginatedDiaryEntries>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/diary${buildQuery(query)}`,
    { auth: true },
  );
}
