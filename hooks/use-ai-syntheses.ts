"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveAiSynthesis,
  generateAiSynthesis,
  listAiSyntheses,
  rejectAiSynthesis,
  updateAiSynthesis,
} from "@anima/shared";
import type {
  ApproveAiSynthesisPayload,
  GenerateAiSynthesisPayload,
  ListAiSynthesesQuery,
  RejectAiSynthesisPayload,
  UpdateAiSynthesisPayload,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

export function useAiSyntheses(
  orgId: string,
  patientId: string,
  query: ListAiSynthesesQuery = {},
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["ai-syntheses", orgId, patientId, query],
    queryFn: () => listAiSyntheses(orgId, patientId, query),
    enabled: enabled && !!user && !!orgId && !!patientId,
    retry: false,
  });
}

export function useGenerateAiSynthesis(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GenerateAiSynthesisPayload) =>
      generateAiSynthesis(orgId, patientId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["ai-syntheses", orgId, patientId],
      });
    },
  });
}

export function useUpdateAiSynthesis(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      synthesisId,
      payload,
    }: {
      synthesisId: string;
      payload: UpdateAiSynthesisPayload;
    }) => updateAiSynthesis(orgId, patientId, synthesisId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["ai-syntheses", orgId, patientId],
      });
    },
  });
}

export function useApproveAiSynthesis(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      synthesisId,
      payload,
    }: {
      synthesisId: string;
      payload?: ApproveAiSynthesisPayload;
    }) => approveAiSynthesis(orgId, patientId, synthesisId, payload ?? {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["ai-syntheses", orgId, patientId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["clinical-notes", orgId, patientId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["care-plans", orgId, patientId],
      });
    },
  });
}

export function useRejectAiSynthesis(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      synthesisId,
      payload,
    }: {
      synthesisId: string;
      payload?: RejectAiSynthesisPayload;
    }) => rejectAiSynthesis(orgId, patientId, synthesisId, payload ?? {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["ai-syntheses", orgId, patientId],
      });
    },
  });
}
