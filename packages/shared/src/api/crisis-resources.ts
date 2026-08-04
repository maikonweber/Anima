import { api } from "../api-client";
import type {
  CreateCrisisResourcePayload,
  CrisisResource,
  CrisisResourcesResponse,
  ListCrisisResourcesParams,
  UpdateCrisisResourcePayload,
} from "../types/crisis-resources";

function buildQuery(params: ListCrisisResourcesParams = {}): string {
  const search = new URLSearchParams();
  if (params.includeDisabled) search.set("includeDisabled", "true");
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function listCrisisResources(
  orgId: string,
  params: ListCrisisResourcesParams = {},
) {
  return api<CrisisResourcesResponse>(
    `/organizations/${encodeURIComponent(orgId)}/crisis-resources${buildQuery(params)}`,
    { auth: true },
  );
}

export async function createCrisisResource(
  orgId: string,
  payload: CreateCrisisResourcePayload,
) {
  return api<CrisisResource>(
    `/organizations/${encodeURIComponent(orgId)}/crisis-resources`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function updateCrisisResource(
  orgId: string,
  resourceId: string,
  payload: UpdateCrisisResourcePayload,
) {
  return api<CrisisResource>(
    `/organizations/${encodeURIComponent(orgId)}/crisis-resources/${encodeURIComponent(resourceId)}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteCrisisResource(orgId: string, resourceId: string) {
  return api<{ ok: boolean }>(
    `/organizations/${encodeURIComponent(orgId)}/crisis-resources/${encodeURIComponent(resourceId)}`,
    {
      method: "DELETE",
      auth: true,
    },
  );
}
