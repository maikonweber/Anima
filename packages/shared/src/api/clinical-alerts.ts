import { api } from "../api-client";
import type {
  ClinicalAlert,
  ClinicalAlertScanResult,
  ClinicDashboardOverview,
  ListClinicalAlertsQuery,
  UpdateClinicalAlertPayload,
} from "../types/clinical-alerts";

function buildQuery(query: ListClinicalAlertsQuery = {}): string {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.patientId) params.set("patientId", query.patientId);
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function listPatientClinicalAlerts(
  orgId: string,
  patientId: string,
  query: ListClinicalAlertsQuery = {},
) {
  return api<ClinicalAlert[]>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/clinical-alerts${buildQuery(query)}`,
    { auth: true },
  );
}

export async function listOrgClinicalAlerts(
  orgId: string,
  query: ListClinicalAlertsQuery = {},
) {
  return api<ClinicalAlert[]>(
    `/organizations/${encodeURIComponent(orgId)}/clinical-alerts${buildQuery(query)}`,
    { auth: true },
  );
}

export async function scanClinicalAlerts(
  orgId: string,
  patientId: string,
  limitEntries = 30,
) {
  return api<ClinicalAlertScanResult>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/clinical-alerts/scan`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify({ limitEntries }),
    },
  );
}

export async function updateClinicalAlert(
  orgId: string,
  patientId: string,
  alertId: string,
  payload: UpdateClinicalAlertPayload,
) {
  return api<ClinicalAlert>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/clinical-alerts/${encodeURIComponent(alertId)}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function approveClinicalAlert(
  orgId: string,
  patientId: string,
  alertId: string,
) {
  return api<ClinicalAlert>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/clinical-alerts/${encodeURIComponent(alertId)}/approve`,
    { method: "POST", auth: true, body: "{}" },
  );
}

export async function rejectClinicalAlert(
  orgId: string,
  patientId: string,
  alertId: string,
  reason?: string,
) {
  return api<ClinicalAlert>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/clinical-alerts/${encodeURIComponent(alertId)}/reject`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify({ reason: reason ?? null }),
    },
  );
}

export async function getClinicDashboard(orgId: string) {
  return api<ClinicDashboardOverview>(
    `/organizations/${encodeURIComponent(orgId)}/clinic-dashboard`,
    { auth: true },
  );
}
