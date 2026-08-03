"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCarePlan,
  createCarePlanItem,
  deleteCarePlanItem,
  getActiveCarePlan,
  getMyCarePlan,
  updateCarePlan,
  updateCarePlanItem,
} from "@anima/shared";
import type {
  CreateCarePlanItemPayload,
  CreateCarePlanPayload,
  UpdateCarePlanItemPayload,
  UpdateCarePlanPayload,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

export function useActiveCarePlan(orgId: string, patientId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["care-plan-active", orgId, patientId],
    queryFn: () => getActiveCarePlan(orgId, patientId),
    enabled: !!user && !!orgId && !!patientId,
    retry: false,
  });
}

export function useMyCarePlan(orgId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["care-plan-me", orgId],
    queryFn: () => getMyCarePlan(orgId),
    enabled: !!user && !!orgId,
    retry: false,
  });
}

export function useCreateCarePlan(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCarePlanPayload) =>
      createCarePlan(orgId, patientId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["care-plan-active", orgId, patientId],
      });
    },
  });
}

export function useUpdateCarePlan(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      planId,
      payload,
    }: {
      planId: string;
      payload: UpdateCarePlanPayload;
    }) => updateCarePlan(orgId, patientId, planId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["care-plan-active", orgId, patientId],
      });
    },
  });
}

export function useCreateCarePlanItem(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      planId,
      payload,
    }: {
      planId: string;
      payload: CreateCarePlanItemPayload;
    }) => createCarePlanItem(orgId, patientId, planId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["care-plan-active", orgId, patientId],
      });
    },
  });
}

export function useUpdateCarePlanItem(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: UpdateCarePlanItemPayload;
    }) => updateCarePlanItem(orgId, patientId, itemId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["care-plan-active", orgId, patientId],
      });
    },
  });
}

export function useDeleteCarePlanItem(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) =>
      deleteCarePlanItem(orgId, patientId, itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["care-plan-active", orgId, patientId],
      });
    },
  });
}
