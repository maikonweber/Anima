"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createClinicTrialInvites,
  getClinicTrialInviteByToken,
  listClinicTrialInvitesAdmin,
  redeemClinicTrialInvite,
  registerWithClinicTrialInvite,
  revokeClinicTrialInvite,
  sendClinicTrialInviteEmail,
} from "@/lib/api/clinic-trial-invites";
import type {
  CreateClinicTrialInvitePayload,
  RegisterWithClinicTrialInvitePayload,
} from "@anima/shared";

export function useClinicTrialInvitesAdmin() {
  return useQuery({
    queryKey: ["clinic-trial-invites-admin"],
    queryFn: listClinicTrialInvitesAdmin,
  });
}

export function useCreateClinicTrialInvites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClinicTrialInvitePayload) =>
      createClinicTrialInvites(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clinic-trial-invites-admin"],
      });
    },
  });
}

export function useRevokeClinicTrialInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revokeClinicTrialInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clinic-trial-invites-admin"],
      });
    },
  });
}

export function useSendClinicTrialInviteEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, email }: { id: string; email?: string }) =>
      sendClinicTrialInviteEmail(id, email),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clinic-trial-invites-admin"],
      });
    },
  });
}

export function useClinicTrialInviteByToken(token: string | null) {
  return useQuery({
    queryKey: ["clinic-trial-invite", token],
    queryFn: () => getClinicTrialInviteByToken(token!),
    enabled: !!token,
  });
}

export function useRedeemClinicTrialInvite() {
  return useMutation({
    mutationFn: (token: string) => redeemClinicTrialInvite(token),
  });
}

export function useRegisterWithClinicTrialInvite() {
  return useMutation({
    mutationFn: (payload: RegisterWithClinicTrialInvitePayload) =>
      registerWithClinicTrialInvite(payload),
  });
}
