import { normalizeSharedDashboard } from "@/lib/care/normalize-shared-dashboard";
import { api } from "@/lib/api-client";
import type {
  AccessibleUser,
  CareInviteByToken,
  CareInvitePublic,
  RegisterWithInvitePayload,
  RegisterWithInviteResponse,
  SharedDashboard,
} from "@/lib/types";

export async function getInviteByToken(token: string) {
  return api<CareInviteByToken>(`/care-invites/by-token/${encodeURIComponent(token)}`);
}

export async function createInvite(viewerEmail: string) {
  return api<CareInvitePublic>("/care-invites", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ viewerEmail }),
  });
}

export async function listSentInvites() {
  return api<CareInvitePublic[]>("/care-invites/sent", { auth: true });
}

export async function listReceivedInvites() {
  return api<CareInvitePublic[]>("/care-invites/received", { auth: true });
}

export async function listAccessibleUsers() {
  return api<AccessibleUser[]>("/care-invites/accessible-users", {
    auth: true,
  });
}

export async function acceptInvite(token: string) {
  return api<CareInvitePublic>("/care-invites/accept", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ token }),
  });
}

export async function registerWithInvite(payload: RegisterWithInvitePayload) {
  return api<RegisterWithInviteResponse>("/care-invites/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateInvite(
  id: string,
  body: { visualizacaoAtiva?: boolean; revogar?: boolean },
) {
  return api<CareInvitePublic>(`/care-invites/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(body),
  });
}

export async function getSharedDashboard(ownerUserId: string) {
  const raw = await api<SharedDashboard>(
    `/care/dashboard/${encodeURIComponent(ownerUserId)}`,
    { auth: true },
  );
  return normalizeSharedDashboard(raw);
}
