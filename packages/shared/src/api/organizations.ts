import { api } from "../api-client";
import type {
  AcceptOrganizationInvitePayload,
  AcceptOrganizationInviteResponse,
  CreateOrganizationInvitePayload,
  CreateOrganizationPayload,
  ListOrganizationAuditLogsParams,
  MyOrganization,
  Organization,
  OrganizationAuditLog,
  OrganizationInvite,
} from "../types/organizations";

export async function listMyOrganizations() {
  return api<MyOrganization[]>("/organizations", { auth: true });
}

export async function createOrganization(payload: CreateOrganizationPayload) {
  return api<{
    organization: Organization;
    membership: MyOrganization["membership"];
  }>("/organizations", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function getOrganization(orgId: string) {
  return api<Organization>(`/organizations/${encodeURIComponent(orgId)}`, {
    auth: true,
  });
}

export async function createOrganizationInvite(
  orgId: string,
  payload: CreateOrganizationInvitePayload,
) {
  return api<OrganizationInvite>(
    `/organizations/${encodeURIComponent(orgId)}/invites`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function listOrganizationInvites(orgId: string) {
  return api<OrganizationInvite[]>(
    `/organizations/${encodeURIComponent(orgId)}/invites`,
    { auth: true },
  );
}

export async function getOrganizationInviteByToken(token: string) {
  return api<OrganizationInvite>(
    `/organizations/invites/by-token/${encodeURIComponent(token)}`,
  );
}

export async function acceptOrganizationInvite(
  payload: AcceptOrganizationInvitePayload,
) {
  return api<AcceptOrganizationInviteResponse>(
    "/organizations/invites/accept",
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function listOrganizationAuditLogs(
  orgId: string,
  params: ListOrganizationAuditLogsParams = {},
) {
  const search = new URLSearchParams();
  if (params.limit != null) search.set("limit", String(params.limit));
  if (params.action) search.set("action", params.action);
  const qs = search.toString();
  return api<OrganizationAuditLog[]>(
    `/organizations/${encodeURIComponent(orgId)}/audit-logs${qs ? `?${qs}` : ""}`,
    { auth: true },
  );
}
