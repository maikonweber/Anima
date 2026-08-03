"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveClinicalAlert,
  getClinicDashboard,
  listOrgClinicalAlerts,
  listPatientClinicalAlerts,
  rejectClinicalAlert,
  scanClinicalAlerts,
  updateClinicalAlert,
} from "@anima/shared";
import type {
  ListClinicalAlertsQuery,
  UpdateClinicalAlertPayload,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

export function usePatientClinicalAlerts(
  orgId: string,
  patientId: string,
  query: ListClinicalAlertsQuery = {},
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["clinical-alerts", orgId, patientId, query],
    queryFn: () => listPatientClinicalAlerts(orgId, patientId, query),
    enabled: enabled && !!user && !!orgId && !!patientId,
    retry: false,
  });
}

export function useOrgClinicalAlerts(
  orgId: string,
  query: ListClinicalAlertsQuery = {},
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["clinical-alerts-org", orgId, query],
    queryFn: () => listOrgClinicalAlerts(orgId, query),
    enabled: enabled && !!user && !!orgId,
    retry: false,
  });
}

export function useClinicDashboard(orgId: string, enabled = true) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["clinic-dashboard", orgId],
    queryFn: () => getClinicDashboard(orgId),
    enabled: enabled && !!user && !!orgId,
    retry: false,
  });
}

export function useScanClinicalAlerts(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => scanClinicalAlerts(orgId, patientId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clinical-alerts", orgId, patientId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["clinical-alerts-org", orgId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["clinic-dashboard", orgId],
      });
    },
  });
}

export function useUpdateClinicalAlert(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      alertId,
      payload,
    }: {
      alertId: string;
      payload: UpdateClinicalAlertPayload;
    }) => updateClinicalAlert(orgId, patientId, alertId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["clinical-alerts", orgId, patientId],
      });
    },
  });
}

export function useApproveClinicalAlert(orgId: string, patientId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      alertId,
      patientId: pid,
    }: {
      alertId: string;
      patientId?: string;
    }) =>
      approveClinicalAlert(orgId, pid ?? patientId ?? "", alertId),
    onSuccess: (_data, vars) => {
      const pid = vars.patientId ?? patientId;
      if (pid) {
        void queryClient.invalidateQueries({
          queryKey: ["clinical-alerts", orgId, pid],
        });
      }
      void queryClient.invalidateQueries({
        queryKey: ["clinical-alerts-org", orgId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["clinic-dashboard", orgId],
      });
    },
  });
}

export function useRejectClinicalAlert(orgId: string, patientId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      alertId,
      reason,
      patientId: pid,
    }: {
      alertId: string;
      reason?: string;
      patientId?: string;
    }) =>
      rejectClinicalAlert(orgId, pid ?? patientId ?? "", alertId, reason),
    onSuccess: (_data, vars) => {
      const pid = vars.patientId ?? patientId;
      if (pid) {
        void queryClient.invalidateQueries({
          queryKey: ["clinical-alerts", orgId, pid],
        });
      }
      void queryClient.invalidateQueries({
        queryKey: ["clinical-alerts-org", orgId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["clinic-dashboard", orgId],
      });
    },
  });
}
