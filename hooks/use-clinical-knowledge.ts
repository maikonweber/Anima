"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveClinicalKnowledge,
  createClinicalKnowledge,
  deleteClinicalKnowledge,
  listClinicalKnowledge,
  publishClinicalKnowledge,
  updateClinicalKnowledge,
} from "@anima/shared";
import type {
  CreateClinicalKnowledgePayload,
  ListClinicalKnowledgeQuery,
  UpdateClinicalKnowledgePayload,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

export function useClinicalKnowledge(
  orgId: string,
  query: ListClinicalKnowledgeQuery = {},
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["clinical-knowledge", orgId, query],
    queryFn: () => listClinicalKnowledge(orgId, query),
    enabled: enabled && !!user && !!orgId,
    retry: false,
  });
}

export function useCreateClinicalKnowledge(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClinicalKnowledgePayload) =>
      createClinicalKnowledge(orgId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clinical-knowledge", orgId],
      });
    },
  });
}

export function useUpdateClinicalKnowledge(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      articleId,
      payload,
    }: {
      articleId: string;
      payload: UpdateClinicalKnowledgePayload;
    }) => updateClinicalKnowledge(orgId, articleId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clinical-knowledge", orgId],
      });
    },
  });
}

export function usePublishClinicalKnowledge(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articleId: string) =>
      publishClinicalKnowledge(orgId, articleId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clinical-knowledge", orgId],
      });
    },
  });
}

export function useArchiveClinicalKnowledge(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articleId: string) =>
      archiveClinicalKnowledge(orgId, articleId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clinical-knowledge", orgId],
      });
    },
  });
}

export function useDeleteClinicalKnowledge(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articleId: string) =>
      deleteClinicalKnowledge(orgId, articleId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clinical-knowledge", orgId],
      });
    },
  });
}
