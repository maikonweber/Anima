"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptPatientAppInvite,
  createPatient,
  createPatientAppInvite,
  deletePatient,
  getPatient,
  getPatientAppInviteByToken,
  leaveClinic,
  linkPatientAppUser,
  listMyClinicLinks,
  listPatientAppInvites,
  listPatients,
  revokePatientAppInvite,
  unlinkPatientAppUser,
  updatePatientStatus,
} from "@/lib/api/patients";
import type {
  AcceptPatientAppInvitePayload,
  CreatePatientAppInvitePayload,
  CreatePatientPayload,
  LinkPatientAppUserPayload,
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

export function useLinkPatientAppUser(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LinkPatientAppUserPayload) =>
      linkPatientAppUser(orgId, patientId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["patients", orgId, patientId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["patient-diary", orgId, patientId],
      });
    },
  });
}

export function useUnlinkPatientAppUser(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => unlinkPatientAppUser(orgId, patientId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["patients", orgId, patientId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["patient-diary", orgId, patientId],
      });
      void queryClient.invalidateQueries({ queryKey: ["clinic-links"] });
    },
  });
}

export function usePatientAppInvites(
  orgId: string,
  patientId: string,
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["patient-app-invites", orgId, patientId],
    queryFn: () => listPatientAppInvites(orgId, patientId),
    enabled: !!user && !!orgId && !!patientId && enabled,
  });
}

export function useCreatePatientAppInvite(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePatientAppInvitePayload) =>
      createPatientAppInvite(orgId, patientId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["patient-app-invites", orgId, patientId],
      });
    },
  });
}

export function useRevokePatientAppInvite(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: string) =>
      revokePatientAppInvite(orgId, patientId, inviteId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["patient-app-invites", orgId, patientId],
      });
    },
  });
}

export function usePatientAppInviteByToken(token: string | null) {
  return useQuery({
    queryKey: ["patient-app-invite", token],
    queryFn: () => getPatientAppInviteByToken(token!),
    enabled: !!token,
  });
}

export function useAcceptPatientAppInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AcceptPatientAppInvitePayload) =>
      acceptPatientAppInvite(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["clinic-links"] });
      void queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
}

export function useMyClinicLinks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["clinic-links"],
    queryFn: () => listMyClinicLinks(),
    enabled: !!user,
  });
}

export function useLeaveClinic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orgId: string) => leaveClinic(orgId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["clinic-links"] });
      void queryClient.invalidateQueries({ queryKey: ["subscription"] });
      void queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useDeletePatient(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patientId: string) => deletePatient(orgId, patientId),
    onSuccess: (_data, patientId) => {
      void queryClient.invalidateQueries({ queryKey: ["patients", orgId] });
      void queryClient.removeQueries({
        queryKey: ["patients", orgId, patientId],
      });
    },
  });
}
