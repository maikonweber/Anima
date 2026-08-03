import { api } from "../api-client";
import type {
  ClinicalNote,
  CreateClinicalNoteAddendumPayload,
  CreateClinicalNotePayload,
  ListClinicalNotesQuery,
  UpdateClinicalNotePayload,
} from "../types/clinical-notes";

function buildQuery(query: ListClinicalNotesQuery = {}): string {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.appointmentId) params.set("appointmentId", query.appointmentId);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function base(orgId: string, patientId: string) {
  return `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/clinical-notes`;
}

export async function listClinicalNotes(
  orgId: string,
  patientId: string,
  query?: ListClinicalNotesQuery,
) {
  return api<ClinicalNote[]>(`${base(orgId, patientId)}${buildQuery(query)}`, {
    auth: true,
  });
}

export async function getClinicalNote(
  orgId: string,
  patientId: string,
  noteId: string,
) {
  return api<ClinicalNote>(
    `${base(orgId, patientId)}/${encodeURIComponent(noteId)}`,
    { auth: true },
  );
}

export async function createClinicalNote(
  orgId: string,
  patientId: string,
  payload: CreateClinicalNotePayload,
) {
  return api<ClinicalNote>(base(orgId, patientId), {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateClinicalNote(
  orgId: string,
  patientId: string,
  noteId: string,
  payload: UpdateClinicalNotePayload,
) {
  return api<ClinicalNote>(
    `${base(orgId, patientId)}/${encodeURIComponent(noteId)}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function signClinicalNote(
  orgId: string,
  patientId: string,
  noteId: string,
) {
  return api<ClinicalNote>(
    `${base(orgId, patientId)}/${encodeURIComponent(noteId)}/sign`,
    { method: "POST", auth: true },
  );
}

export async function addClinicalNoteAddendum(
  orgId: string,
  patientId: string,
  noteId: string,
  payload: CreateClinicalNoteAddendumPayload,
) {
  return api<ClinicalNote>(
    `${base(orgId, patientId)}/${encodeURIComponent(noteId)}/addenda`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}
