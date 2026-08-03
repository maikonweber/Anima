import { api } from "../api-client";
import type {
  Appointment,
  CreateAppointmentPayload,
  CreateAvailabilityPayload,
  ListAppointmentsQuery,
  PaginatedAppointments,
  ProfessionalAvailability,
  UpdateAppointmentPayload,
  UpdateAvailabilityPayload,
} from "../types/agenda";

function buildQuery(query: ListAppointmentsQuery = {}): string {
  const params = new URLSearchParams();
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.professionalUserId) {
    params.set("professionalUserId", query.professionalUserId);
  }
  if (query.patientId) params.set("patientId", query.patientId);
  if (query.status) params.set("status", query.status);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function listAvailabilities(
  orgId: string,
  professionalUserId?: string,
) {
  const qs = professionalUserId
    ? `?professionalUserId=${encodeURIComponent(professionalUserId)}`
    : "";
  return api<ProfessionalAvailability[]>(
    `/organizations/${encodeURIComponent(orgId)}/availabilities${qs}`,
    { auth: true },
  );
}

export async function createAvailability(
  orgId: string,
  payload: CreateAvailabilityPayload,
) {
  return api<ProfessionalAvailability>(
    `/organizations/${encodeURIComponent(orgId)}/availabilities`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function updateAvailability(
  orgId: string,
  availabilityId: string,
  payload: UpdateAvailabilityPayload,
) {
  return api<ProfessionalAvailability>(
    `/organizations/${encodeURIComponent(orgId)}/availabilities/${encodeURIComponent(availabilityId)}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteAvailability(
  orgId: string,
  availabilityId: string,
) {
  return api<{ ok: boolean }>(
    `/organizations/${encodeURIComponent(orgId)}/availabilities/${encodeURIComponent(availabilityId)}`,
    { method: "DELETE", auth: true },
  );
}

export async function listAppointments(
  orgId: string,
  query?: ListAppointmentsQuery,
) {
  return api<PaginatedAppointments>(
    `/organizations/${encodeURIComponent(orgId)}/appointments${buildQuery(query)}`,
    { auth: true },
  );
}

export async function getAppointment(orgId: string, appointmentId: string) {
  return api<Appointment>(
    `/organizations/${encodeURIComponent(orgId)}/appointments/${encodeURIComponent(appointmentId)}`,
    { auth: true },
  );
}

export async function createAppointment(
  orgId: string,
  payload: CreateAppointmentPayload,
) {
  return api<Appointment>(
    `/organizations/${encodeURIComponent(orgId)}/appointments`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function updateAppointment(
  orgId: string,
  appointmentId: string,
  payload: UpdateAppointmentPayload,
) {
  return api<Appointment>(
    `/organizations/${encodeURIComponent(orgId)}/appointments/${encodeURIComponent(appointmentId)}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}
