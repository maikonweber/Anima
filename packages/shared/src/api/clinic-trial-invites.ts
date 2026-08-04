import { api } from "../api-client";
import type {
  ClinicTrialInviteByToken,
  ClinicTrialInvitePublic,
  ClinicTrialRedemptionResult,
  CreateClinicTrialInvitePayload,
  CreateClinicTrialInvitesResponse,
  RegisterWithClinicTrialInvitePayload,
  RegisterWithClinicTrialInviteResponse,
} from "../types/clinic-trial-invites";

export async function listClinicTrialInvitesAdmin() {
  return api<ClinicTrialInvitePublic[]>("/admin/clinic-trial-invites", {
    auth: true,
  });
}

export async function createClinicTrialInvites(
  payload: CreateClinicTrialInvitePayload,
) {
  return api<CreateClinicTrialInvitesResponse>("/admin/clinic-trial-invites", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function sendClinicTrialInviteEmail(id: string, email?: string) {
  return api<ClinicTrialInvitePublic>(
    `/admin/clinic-trial-invites/${id}/send`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(email ? { email } : {}),
    },
  );
}

export async function revokeClinicTrialInvite(id: string) {
  return api<ClinicTrialInvitePublic>(`/admin/clinic-trial-invites/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function getClinicTrialInviteByToken(token: string) {
  return api<ClinicTrialInviteByToken>(
    `/clinic-trial-invites/by-token/${encodeURIComponent(token)}`,
  );
}

export async function redeemClinicTrialInvite(token: string) {
  return api<ClinicTrialRedemptionResult>("/clinic-trial-invites/redeem", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ token }),
  });
}

export async function registerWithClinicTrialInvite(
  payload: RegisterWithClinicTrialInvitePayload,
) {
  return api<RegisterWithClinicTrialInviteResponse>(
    "/clinic-trial-invites/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
