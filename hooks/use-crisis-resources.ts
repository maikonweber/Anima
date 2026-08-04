"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCrisisResource,
  deleteCrisisResource,
  listCrisisResources,
  updateCrisisResource,
} from "@/lib/api/crisis-resources";
import type {
  CreateCrisisResourcePayload,
  ListCrisisResourcesParams,
  UpdateCrisisResourcePayload,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

export function useCrisisResources(
  orgId: string,
  params: ListCrisisResourcesParams = {},
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["crisis-resources", orgId, params],
    queryFn: () => listCrisisResources(orgId, params),
    enabled: !!user && !!orgId && enabled,
  });
}

export function useCreateCrisisResource(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCrisisResourcePayload) =>
      createCrisisResource(orgId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["crisis-resources", orgId],
      });
    },
  });
}

export function useUpdateCrisisResource(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      resourceId,
      payload,
    }: {
      resourceId: string;
      payload: UpdateCrisisResourcePayload;
    }) => updateCrisisResource(orgId, resourceId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["crisis-resources", orgId],
      });
    },
  });
}

export function useDeleteCrisisResource(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resourceId: string) => deleteCrisisResource(orgId, resourceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["crisis-resources", orgId],
      });
    },
  });
}
