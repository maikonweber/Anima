"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMyMedication,
  listMyDueReminders,
  listMyMedications,
  listMyReminderHistory,
  listPatientMedications,
  listPatientReminderHistory,
  respondReminderOccurrence,
} from "@anima/shared";
import type {
  CreateMedicationPayload,
  RespondOccurrencePayload,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

export function useMyMedications(orgId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reminders-medications", orgId],
    queryFn: () => listMyMedications(orgId),
    enabled: !!user && !!orgId,
    retry: false,
  });
}

export function useMyDueReminders(orgId: string, days = 7) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reminders-due", orgId, days],
    queryFn: () => listMyDueReminders(orgId, days),
    enabled: !!user && !!orgId,
    retry: false,
    refetchInterval: 60_000,
  });
}

export function useMyReminderHistory(orgId: string, days = 7) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reminders-history", orgId, days],
    queryFn: () => listMyReminderHistory(orgId, days),
    enabled: !!user && !!orgId,
    retry: false,
  });
}

export function useCreateMedication(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMedicationPayload) =>
      createMyMedication(orgId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["reminders-medications", orgId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["reminders-due", orgId],
      });
    },
  });
}

export function useRespondOccurrence(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      occurrenceId,
      payload,
    }: {
      occurrenceId: string;
      payload: RespondOccurrencePayload;
    }) => respondReminderOccurrence(orgId, occurrenceId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["reminders-due", orgId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["reminders-history", orgId],
      });
    },
  });
}

export function usePatientMedications(orgId: string, patientId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["clinic-medications", orgId, patientId],
    queryFn: () => listPatientMedications(orgId, patientId),
    enabled: !!user && !!orgId && !!patientId,
    retry: false,
  });
}

export function usePatientReminderHistory(
  orgId: string,
  patientId: string,
  days = 7,
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["clinic-reminder-history", orgId, patientId, days],
    queryFn: () => listPatientReminderHistory(orgId, patientId, days),
    enabled: !!user && !!orgId && !!patientId && enabled,
    retry: false,
  });
}
