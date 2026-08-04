import { api } from "../api-client";
import type {
  ConsentExportRequest,
  ConsentPurposeDefinition,
  GrantConsentPayload,
  ListConsentsQuery,
  PatientConsent,
  PatientConsentStatus,
  RequestConsentExportPayload,
  RevokeConsentPayload,
} from "../types/consents";

function buildListQuery(query: ListConsentsQuery = {}): string {
  const params = new URLSearchParams();
  if (query.purpose) params.set("purpose", query.purpose);
  if (query.status) params.set("status", query.status);
  if (query.currentOnly !== undefined) {
    params.set("currentOnly", query.currentOnly ? "true" : "false");
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function listConsentPurposes(orgId: string) {
  return api<ConsentPurposeDefinition[]>(
    `/organizations/${encodeURIComponent(orgId)}/consents/purposes`,
    { auth: true },
  );
}

export async function getMyConsentStatus(orgId: string) {
  return api<PatientConsentStatus>(
    `/organizations/${encodeURIComponent(orgId)}/consents/me`,
    { auth: true },
  );
}

export async function getPatientConsentStatus(
  orgId: string,
  patientId: string,
) {
  return api<PatientConsentStatus>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/consents/status`,
    { auth: true },
  );
}

export async function listPatientConsents(
  orgId: string,
  patientId: string,
  query?: ListConsentsQuery,
) {
  return api<PatientConsent[]>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/consents${buildListQuery(query)}`,
    { auth: true },
  );
}

export async function grantConsent(
  orgId: string,
  patientId: string,
  payload: GrantConsentPayload,
) {
  return api<PatientConsent>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/consents`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function revokeConsent(
  orgId: string,
  consentId: string,
  payload: RevokeConsentPayload = {},
) {
  return api<PatientConsent>(
    `/organizations/${encodeURIComponent(orgId)}/consents/${encodeURIComponent(consentId)}/revoke`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function requestConsentExport(
  orgId: string,
  patientId: string,
  payload: RequestConsentExportPayload = {},
) {
  return api<ConsentExportRequest>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/consents/export`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function listConsentExports(orgId: string, patientId: string) {
  return api<ConsentExportRequest[]>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/consents/export`,
    { auth: true },
  );
}

export async function getConsentExportDownload(
  orgId: string,
  patientId: string,
  exportId: string,
) {
  return api<{ url: string; expiresAt: string }>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/consents/export/${encodeURIComponent(exportId)}/download`,
    { auth: true },
  );
}
