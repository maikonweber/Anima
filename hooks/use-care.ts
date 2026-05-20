"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptInvite,
  createInvite,
  getInviteByToken,
  getSharedDashboard,
  listAccessibleUsers,
  listSentInvites,
  registerWithInvite,
  updateInvite,
} from "@/lib/api/care";
import type { RegisterWithInvitePayload } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";

export function useInviteByToken(token: string | null) {
  return useQuery({
    queryKey: ["care-invite-by-token", token],
    queryFn: () => getInviteByToken(token!),
    enabled: !!token,
    retry: false,
  });
}

export function useSentInvites() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["care-invites-sent"],
    queryFn: listSentInvites,
    enabled: !!user,
  });
}

export function useAccessibleUsers() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["care-accessible-users"],
    queryFn: listAccessibleUsers,
    enabled: !!user,
  });
}

export function useSharedDashboard(ownerUserId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["care-shared-dashboard", ownerUserId],
    queryFn: () => getSharedDashboard(ownerUserId),
    enabled: !!user && !!ownerUserId,
  });
}

export function useCreateInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (viewerEmail: string) => createInvite(viewerEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["care-invites-sent"] });
    },
  });
}

export function useAcceptInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => acceptInvite(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["care-invite-by-token"] });
      queryClient.invalidateQueries({ queryKey: ["care-accessible-users"] });
      queryClient.invalidateQueries({ queryKey: ["care-invites-sent"] });
    },
  });
}

export function useRegisterWithInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterWithInvitePayload) =>
      registerWithInvite(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["care-accessible-users"] });
    },
  });
}

export function useUpdateInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { visualizacaoAtiva?: boolean; revogar?: boolean };
    }) => updateInvite(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["care-invites-sent"] });
      queryClient.invalidateQueries({ queryKey: ["care-accessible-users"] });
    },
  });
}
