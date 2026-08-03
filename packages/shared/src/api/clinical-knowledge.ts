import { api } from "../api-client";
import type {
  ClinicalKnowledgeArticle,
  ClinicalKnowledgeSearchResult,
  CreateClinicalKnowledgePayload,
  ListClinicalKnowledgeQuery,
  UpdateClinicalKnowledgePayload,
} from "../types/clinical-knowledge";

function buildQuery(query: ListClinicalKnowledgeQuery = {}): string {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.scope) params.set("scope", query.scope);
  if (query.q) params.set("q", query.q);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function listClinicalKnowledge(
  orgId: string,
  query: ListClinicalKnowledgeQuery = {},
) {
  return api<ClinicalKnowledgeArticle[]>(
    `/organizations/${encodeURIComponent(orgId)}/clinical-knowledge${buildQuery(query)}`,
    { auth: true },
  );
}

export async function searchClinicalKnowledge(
  orgId: string,
  q: string,
  limit = 5,
) {
  const params = new URLSearchParams({ q, limit: String(limit) });
  return api<ClinicalKnowledgeSearchResult>(
    `/organizations/${encodeURIComponent(orgId)}/clinical-knowledge/search?${params}`,
    { auth: true },
  );
}

export async function createClinicalKnowledge(
  orgId: string,
  payload: CreateClinicalKnowledgePayload,
) {
  return api<ClinicalKnowledgeArticle>(
    `/organizations/${encodeURIComponent(orgId)}/clinical-knowledge`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function updateClinicalKnowledge(
  orgId: string,
  articleId: string,
  payload: UpdateClinicalKnowledgePayload,
) {
  return api<ClinicalKnowledgeArticle>(
    `/organizations/${encodeURIComponent(orgId)}/clinical-knowledge/${encodeURIComponent(articleId)}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function publishClinicalKnowledge(
  orgId: string,
  articleId: string,
) {
  return api<ClinicalKnowledgeArticle>(
    `/organizations/${encodeURIComponent(orgId)}/clinical-knowledge/${encodeURIComponent(articleId)}/publish`,
    { method: "POST", auth: true, body: "{}" },
  );
}

export async function archiveClinicalKnowledge(
  orgId: string,
  articleId: string,
) {
  return api<ClinicalKnowledgeArticle>(
    `/organizations/${encodeURIComponent(orgId)}/clinical-knowledge/${encodeURIComponent(articleId)}/archive`,
    { method: "POST", auth: true, body: "{}" },
  );
}

export async function deleteClinicalKnowledge(
  orgId: string,
  articleId: string,
) {
  return api<{ message: string }>(
    `/organizations/${encodeURIComponent(orgId)}/clinical-knowledge/${encodeURIComponent(articleId)}`,
    { method: "DELETE", auth: true },
  );
}
