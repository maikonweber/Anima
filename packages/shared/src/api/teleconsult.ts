import { api } from "../api-client";
import type {
  ListTeleconsultMessagesQuery,
  PostTeleconsultMessagePayload,
  PostTeleconsultSignalPayload,
  TeleconsultMessage,
  TeleconsultSession,
  TeleconsultSignalMessage,
} from "../types/teleconsult";
import type { AiSynthesis } from "../types/ai-syntheses";

export async function createTeleconsult(
  orgId: string,
  appointmentId: string,
) {
  return api<TeleconsultSession>(
    `/organizations/${encodeURIComponent(orgId)}/appointments/${encodeURIComponent(appointmentId)}/teleconsult`,
    { method: "POST", auth: true, body: "{}" },
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
    { method: "POST", auth: true, body: "{}" },
  );
}

export async function generateSessionIntelligence(
  orgId: string,
  sessionId: string,
  payload: {
    manualSessionNotes?: string;
    title?: string;
    includeDiary?: boolean;
  },
) {
  return api<{
    session: TeleconsultSession;
    synthesis: AiSynthesis;
  }>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/session-intelligence`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function listTeleconsultMessages(
  orgId: string,
  sessionId: string,
  query: ListTeleconsultMessagesQuery = {},
) {
  const params = new URLSearchParams();
  if (query.afterId) params.set("afterId", query.afterId);
  if (query.limit != null) params.set("limit", String(query.limit));
  const qs = params.toString();
  return api<TeleconsultMessage[]>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/messages${qs ? `?${qs}` : ""}`,
    { auth: true },
  );
}

export async function postTeleconsultMessage(
  orgId: string,
  sessionId: string,
  payload: PostTeleconsultMessagePayload,
) {
  return api<TeleconsultMessage>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/messages`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteTeleconsultMessage(
  orgId: string,
  sessionId: string,
  messageId: string,
) {
  return api<TeleconsultMessage>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/messages/${encodeURIComponent(messageId)}`,
    { method: "DELETE", auth: true },
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
