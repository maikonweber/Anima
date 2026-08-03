import { api } from "../api-client";
import type {
  CreateMedicationPayload,
  CreateMedicationResponse,
  MedicationsListResponse,
  PatientReminder,
  ReminderOccurrence,
  RespondOccurrencePayload,
} from "../types/reminders";

export async function listMyMedications(orgId: string) {
  return api<MedicationsListResponse>(
    `/organizations/${encodeURIComponent(orgId)}/reminders/medications`,
    { auth: true },
  );
}

export async function createMyMedication(
  orgId: string,
  payload: CreateMedicationPayload,
) {
  return api<CreateMedicationResponse>(
    `/organizations/${encodeURIComponent(orgId)}/reminders/medications`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function listMyReminders(orgId: string) {
  return api<PatientReminder[]>(
    `/organizations/${encodeURIComponent(orgId)}/reminders`,
    { auth: true },
  );
}

export async function listMyDueReminders(orgId: string, days = 7) {
  return api<ReminderOccurrence[]>(
    `/organizations/${encodeURIComponent(orgId)}/reminders/due?days=${days}`,
    { auth: true },
  );
}

export async function listMyReminderHistory(orgId: string, days = 7) {
  return api<ReminderOccurrence[]>(
    `/organizations/${encodeURIComponent(orgId)}/reminders/history?days=${days}`,
    { auth: true },
  );
}

export async function respondReminderOccurrence(
  orgId: string,
  occurrenceId: string,
  payload: RespondOccurrencePayload,
) {
  return api<ReminderOccurrence>(
    `/organizations/${encodeURIComponent(orgId)}/reminders/occurrences/${encodeURIComponent(occurrenceId)}/respond`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function listPatientMedications(
  orgId: string,
  patientId: string,
) {
  return api<MedicationsListResponse>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/medications`,
    { auth: true },
  );
}

export async function listPatientReminderHistory(
  orgId: string,
  patientId: string,
  days = 7,
) {
  return api<ReminderOccurrence[]>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/reminders/history?days=${days}`,
    { auth: true },
  );
}
