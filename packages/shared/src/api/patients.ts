import { api } from "../api-client";
import type {
  CreatePatientPayload,
  ListPatientsQuery,
  PaginatedPatients,
  Patient,
  PatientContact,
  PatientDetail,
  UpdatePatientPayload,
  UpdatePatientStatusPayload,
} from "../types/patients";

function buildQuery(query: ListPatientsQuery = {}): string {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.q) params.set("q", query.q);
  if (query.primaryProfessionalUserId) {
    params.set("primaryProfessionalUserId", query.primaryProfessionalUserId);
  }
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function listPatients(orgId: string, query?: ListPatientsQuery) {
  return api<PaginatedPatients>(
    `/organizations/${encodeURIComponent(orgId)}/patients${buildQuery(query)}`,
    { auth: true },
  );
}

export async function getPatient(orgId: string, patientId: string) {
  return api<PatientDetail>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}`,
    { auth: true },
  );
}

export async function createPatient(
  orgId: string,
  payload: CreatePatientPayload,
) {
  return api<Patient & { contacts: PatientContact[] }>(
    `/organizations/${encodeURIComponent(orgId)}/patients`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function updatePatient(
  orgId: string,
  patientId: string,
  payload: UpdatePatientPayload,
) {
  return api<Patient>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function updatePatientStatus(
  orgId: string,
  patientId: string,
  payload: UpdatePatientStatusPayload,
) {
  return api<Patient>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/status`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function linkPatientAppUser(
  orgId: string,
  patientId: string,
  payload: { email: string },
) {
  return api<Patient>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/link-app-user`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function unlinkPatientAppUser(orgId: string, patientId: string) {
  return api<Patient>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/link-app-user`,
    {
      method: "DELETE",
      auth: true,
    },
  );
}
