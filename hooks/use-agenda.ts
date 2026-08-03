"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAppointment,
  createAvailability,
  deleteAvailability,
  getAppointment,
  listAppointments,
  listAvailabilities,
  updateAppointment,
  updateAvailability,
} from "@/lib/api/agenda";
import type {
  CreateAppointmentPayload,
  CreateAvailabilityPayload,
  ListAppointmentsQuery,
  UpdateAppointmentPayload,
  UpdateAvailabilityPayload,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

export function useAvailabilities(orgId: string, professionalUserId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["availabilities", orgId, professionalUserId],
    queryFn: () => listAvailabilities(orgId, professionalUserId),
    enabled: !!user && !!orgId,
  });
}

export function useCreateAvailability(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAvailabilityPayload) =>
      createAvailability(orgId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["availabilities", orgId],
      });
    },
  });
}

export function useUpdateAvailability(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      availabilityId,
      payload,
    }: {
      availabilityId: string;
      payload: UpdateAvailabilityPayload;
    }) => updateAvailability(orgId, availabilityId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["availabilities", orgId],
      });
    },
  });
}

export function useDeleteAvailability(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (availabilityId: string) =>
      deleteAvailability(orgId, availabilityId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["availabilities", orgId],
      });
    },
  });
}

export function useAppointments(orgId: string, query?: ListAppointmentsQuery) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["appointments", orgId, query],
    queryFn: () => listAppointments(orgId, query),
    enabled: !!user && !!orgId,
  });
}

export function useAppointment(orgId: string, appointmentId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["appointments", orgId, appointmentId],
    queryFn: () => getAppointment(orgId, appointmentId),
    enabled: !!user && !!orgId && !!appointmentId,
  });
}

export function useCreateAppointment(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) =>
      createAppointment(orgId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments", orgId] });
    },
  });
}

export function useUpdateAppointment(orgId: string, appointmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAppointmentPayload) =>
      updateAppointment(orgId, appointmentId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["appointments", orgId, appointmentId],
      });
      void queryClient.invalidateQueries({ queryKey: ["appointments", orgId] });
    },
  });
}
