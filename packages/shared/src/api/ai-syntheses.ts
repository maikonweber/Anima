import { api } from "../api-client";
import type {
  AiSynthesis,
  ApplyCarePlanSuggestionsPayload,
  ApproveAiSynthesisPayload,
  CarePlanSuggestion,
  GenerateAiSynthesisPayload,
  ListAiSynthesesQuery,
  RejectAiSynthesisPayload,
  UpdateAiSynthesisPayload,
} from "../types/ai-syntheses";
import type { CarePlan, CarePlanItem } from "../types/care-plans";

function buildQuery(query: ListAiSynthesesQuery = {}): string {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function listAiSyntheses(
  orgId: string,
  patientId: string,
  query: ListAiSynthesesQuery = {},
) {
  return api<AiSynthesis[]>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/ai-syntheses${buildQuery(query)}`,
    { auth: true },
  );
}

export async function getAiSynthesis(
  orgId: string,
  patientId: string,
  synthesisId: string,
) {
  return api<AiSynthesis>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/ai-syntheses/${encodeURIComponent(synthesisId)}`,
    { auth: true },
  );
}

export async function exportAiSynthesisReport(
  orgId: string,
  patientId: string,
  synthesisId: string,
  format: "pdf" | "json",
) {
  return api<{ objectId: string; url: string; expiresAt: string }>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/ai-syntheses/${encodeURIComponent(synthesisId)}/export/${format}`,
    { method: "POST", auth: true, body: "{}" },
  );
}

export async function generateAiSynthesis(
  orgId: string,
  patientId: string,
  payload: GenerateAiSynthesisPayload,
) {
  return api<AiSynthesis>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/ai-syntheses`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function updateAiSynthesis(
  orgId: string,
  patientId: string,
  synthesisId: string,
  payload: UpdateAiSynthesisPayload,
) {
  return api<AiSynthesis>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/ai-syntheses/${encodeURIComponent(synthesisId)}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function approveAiSynthesis(
  orgId: string,
  patientId: string,
  synthesisId: string,
  payload: ApproveAiSynthesisPayload = {},
) {
  return api<AiSynthesis>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/ai-syntheses/${encodeURIComponent(synthesisId)}/approve`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function rejectAiSynthesis(
  orgId: string,
  patientId: string,
  synthesisId: string,
  payload: RejectAiSynthesisPayload = {},
) {
  return api<AiSynthesis>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/ai-syntheses/${encodeURIComponent(synthesisId)}/reject`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function suggestCarePlanItems(
  orgId: string,
  patientId: string,
  synthesisId: string,
) {
  return api<{ synthesisId: string; suggestions: CarePlanSuggestion[] }>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/ai-syntheses/${encodeURIComponent(synthesisId)}/suggest-care-plan-items`,
    { method: "POST", auth: true, body: "{}" },
  );
}

export async function applyCarePlanSuggestions(
  orgId: string,
  patientId: string,
  synthesisId: string,
  payload: ApplyCarePlanSuggestionsPayload,
) {
  return api<{
    plan: CarePlan | null;
    items: CarePlanItem[];
    suggestionsApplied: CarePlanSuggestion[];
  }>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/ai-syntheses/${encodeURIComponent(synthesisId)}/apply-care-plan-suggestions`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}
