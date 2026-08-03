"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPatient,
  getPatient,
  listPatients,
  updatePatientStatus,
} from "@/lib/api/patients";
import type {
  CreatePatientPayload,
  ListPatientsQuery,
  UpdatePatientStatusPayload,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

export function usePatients(orgId: string, query?: ListPatientsQuery) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["patients", orgId, query],
    queryFn: () => listPatients(orgId, query),
    enabled: !!user && !!orgId,
  });
}

export function usePatient(orgId: string, patientId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["patients", orgId, patientId],
    queryFn: () => getPatient(orgId, patientId),
    enabled: !!user && !!orgId && !!patientId,
  });
}

export function useCreatePatient(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePatientPayload) =>
      createPatient(orgId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["patients", orgId] });
    },
  });
}

export function useUpdatePatientStatus(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePatientStatusPayload) =>
      updatePatientStatus(orgId, patientId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["patients", orgId, patientId],
      });
      void queryClient.invalidateQueries({ queryKey: ["patients", orgId] });
    },
  });
}
