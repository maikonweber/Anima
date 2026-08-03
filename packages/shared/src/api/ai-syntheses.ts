import { api } from "../api-client";
import type {
  AiSynthesis,
  ApproveAiSynthesisPayload,
  GenerateAiSynthesisPayload,
  ListAiSynthesesQuery,
  RejectAiSynthesisPayload,
  UpdateAiSynthesisPayload,
} from "../types/ai-syntheses";

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
