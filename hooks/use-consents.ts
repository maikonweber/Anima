"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPatientConsentStatus,
  grantConsent,
  listConsentExports,
  listConsentPurposes,
  listPatientConsents,
  requestConsentExport,
  revokeConsent,
} from "@/lib/api/consents";
import type {
  GrantConsentPayload,
  ListConsentsQuery,
  RequestConsentExportPayload,
  RevokeConsentPayload,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

function invalidatePatientConsents(
  queryClient: ReturnType<typeof useQueryClient>,
  orgId: string,
  patientId: string,
) {
  void queryClient.invalidateQueries({
    queryKey: ["consents", orgId, patientId],
  });
  void queryClient.invalidateQueries({
    queryKey: ["consent-status", orgId, patientId],
  });
  void queryClient.invalidateQueries({
    queryKey: ["consent-exports", orgId, patientId],
  });
}

export function useConsentPurposes(orgId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["consent-purposes", orgId],
    queryFn: () => listConsentPurposes(orgId),
    enabled: !!user && !!orgId,
  });
}

export function usePatientConsentStatus(orgId: string, patientId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["consent-status", orgId, patientId],
    queryFn: () => getPatientConsentStatus(orgId, patientId),
    enabled: !!user && !!orgId && !!patientId,
  });
}

export function usePatientConsents(
  orgId: string,
  patientId: string,
  query?: ListConsentsQuery,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["consents", orgId, patientId, query],
    queryFn: () => listPatientConsents(orgId, patientId, query),
    enabled: !!user && !!orgId && !!patientId,
  });
}

export function useConsentExports(orgId: string, patientId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["consent-exports", orgId, patientId],
    queryFn: () => listConsentExports(orgId, patientId),
    enabled: !!user && !!orgId && !!patientId,
  });
}

export function useGrantConsent(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GrantConsentPayload) =>
      grantConsent(orgId, patientId, payload),
    onSuccess: () => invalidatePatientConsents(queryClient, orgId, patientId),
  });
}

export function useRevokeConsent(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      consentId,
      payload,
    }: {
      consentId: string;
      payload?: RevokeConsentPayload;
    }) => revokeConsent(orgId, consentId, payload),
    onSuccess: () => invalidatePatientConsents(queryClient, orgId, patientId),
  });
}

export function useRequestConsentExport(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload?: RequestConsentExportPayload) =>
      requestConsentExport(orgId, patientId, payload),
    onSuccess: () => invalidatePatientConsents(queryClient, orgId, patientId),
  });
}
