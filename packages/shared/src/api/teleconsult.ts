import { api } from "../api-client";
import type {
  PostTeleconsultSignalPayload,
  TeleconsultSession,
  TeleconsultSignalMessage,
} from "../types/teleconsult";

export async function createTeleconsult(
  orgId: string,
  appointmentId: string,
) {
  return api<TeleconsultSession>(
    `/organizations/${encodeURIComponent(orgId)}/appointments/${encodeURIComponent(appointmentId)}/teleconsult`,
    { method: "POST", auth: true },
  );
}

export async function getTeleconsultByAppointment(
  orgId: string,
  appointmentId: string,
) {
  return api<TeleconsultSession>(
    `/organizations/${encodeURIComponent(orgId)}/appointments/${encodeURIComponent(appointmentId)}/teleconsult`,
    { auth: true },
  );
}

export async function getTeleconsult(orgId: string, sessionId: string) {
  return api<TeleconsultSession>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}`,
    { auth: true },
  );
}

export async function joinTeleconsultByRoomCode(roomCode: string) {
  return api<TeleconsultSession>(
    `/teleconsult/join/${encodeURIComponent(roomCode)}`,
    { auth: true },
  );
}

export async function endTeleconsult(orgId: string, sessionId: string) {
  return api<TeleconsultSession>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/end`,
    { method: "POST", auth: true },
  );
}

export async function postTeleconsultSignal(
  orgId: string,
  sessionId: string,
  payload: PostTeleconsultSignalPayload,
) {
  return api<TeleconsultSignalMessage>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/signal`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function pullTeleconsultSignals(
  orgId: string,
  sessionId: string,
  afterId?: string,
) {
  const qs = afterId ? `?afterId=${encodeURIComponent(afterId)}` : "";
  return api<TeleconsultSignalMessage[]>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/signal${qs}`,
    { auth: true },
  );
}
