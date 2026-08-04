"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptOrganizationInvite,
  createOrganization,
  createOrganizationInvite,
  getOrganization,
  getOrganizationInviteByToken,
  listMyOrganizations,
  listOrganizationAuditLogs,
  listOrganizationInvites,
} from "@/lib/api/organizations";
import type {
  CreateOrganizationInvitePayload,
  CreateOrganizationPayload,
  ListOrganizationAuditLogsParams,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

export function useMyOrganizations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["organizations", "mine"],
    queryFn: listMyOrganizations,
    enabled: !!user,
  });
}

export function useOrganization(orgId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["organizations", orgId],
    queryFn: () => getOrganization(orgId),
    enabled: !!user && !!orgId,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) =>
      createOrganization(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useOrganizationInvites(orgId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["organizations", orgId, "invites"],
    queryFn: () => listOrganizationInvites(orgId),
    enabled: !!user && !!orgId,
  });
}

export function useCreateOrganizationInvite(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrganizationInvitePayload) =>
      createOrganizationInvite(orgId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["organizations", orgId, "invites"],
      });
    },
  });
}

export function useOrganizationInviteByToken(token: string | null) {
  return useQuery({
    queryKey: ["organization-invite-by-token", token],
    queryFn: () => getOrganizationInviteByToken(token!),
    enabled: !!token,
    retry: false,
  });
}

export function useAcceptOrganizationInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => acceptOrganizationInvite({ token }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useOrganizationAuditLogs(
  orgId: string,
  params: ListOrganizationAuditLogsParams = {},
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["organizations", orgId, "audit-logs", params],
    queryFn: () => listOrganizationAuditLogs(orgId, params),
    enabled: !!user && !!orgId && enabled,
  });
}
