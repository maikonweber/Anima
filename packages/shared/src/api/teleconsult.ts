import { api } from "../api-client";
import type {
  AppendTranscriptionSegmentsPayload,
  ListTeleconsultMessagesQuery,
  PostMultimodalAggregatePayload,
  PostTeleconsultMessagePayload,
  PostTeleconsultSignalPayload,
  TeleconsultMessage,
  TeleconsultMultimodalAggregate,
  TeleconsultRecording,
  TeleconsultSession,
  TeleconsultSignalMessage,
  TeleconsultTranscription,
  TeleconsultViewerRole,
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

export async function joinTeleconsultByRoomCode(
  roomCode: string,
  options?: { as?: "PATIENT" | "PROFESSIONAL" },
) {
  const qs = options?.as
    ? `?as=${encodeURIComponent(options.as)}`
    : "";
  return api<TeleconsultSession>(
    `/teleconsult/join/${encodeURIComponent(roomCode)}${qs}`,
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
  peerRole?: TeleconsultViewerRole,
) {
  const params = new URLSearchParams();
  if (afterId) params.set("afterId", afterId);
  if (peerRole) params.set("peerRole", peerRole);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return api<TeleconsultSignalMessage[]>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/signal${qs}`,
    { auth: true },
  );
}

export async function startTeleconsultTranscription(
  orgId: string,
  sessionId: string,
) {
  return api<TeleconsultTranscription>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/transcription/start`,
    { method: "POST", auth: true, body: "{}" },
  );
}

export async function stopTeleconsultTranscription(
  orgId: string,
  sessionId: string,
) {
  return api<TeleconsultTranscription>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/transcription/stop`,
    { method: "POST", auth: true, body: "{}" },
  );
}

export async function getTeleconsultTranscription(
  orgId: string,
  sessionId: string,
) {
  return api<TeleconsultTranscription | { transcription: null; segments: [] }>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/transcription`,
    { auth: true },
  );
}

export async function appendTeleconsultTranscriptionSegments(
  orgId: string,
  sessionId: string,
  payload: AppendTranscriptionSegmentsPayload,
) {
  return api<{
    transcriptionId: string;
    inserted: number;
    segments: Array<{
      id: string;
      speaker: string;
      text: string;
      confidence: number | null;
      criadoEm: string;
    }>;
  }>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/transcription/segments`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function postTeleconsultMultimodalAggregate(
  orgId: string,
  sessionId: string,
  payload: PostMultimodalAggregatePayload,
) {
  return api<TeleconsultMultimodalAggregate>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/multimodal/aggregates`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function listTeleconsultMultimodalAggregates(
  orgId: string,
  sessionId: string,
) {
  return api<{ aggregates: TeleconsultMultimodalAggregate[] }>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/multimodal/aggregates`,
    { auth: true },
  );
}

export async function startTeleconsultRecording(
  orgId: string,
  sessionId: string,
) {
  return api<TeleconsultRecording>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/recordings/start`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        mediaType: "video",
        contentType: "video/webm",
        expectedSizeBytes: 2 * 1024 * 1024 * 1024,
      }),
    },
  );
}

export async function getTeleconsultRecordingPartUrl(
  orgId: string,
  sessionId: string,
  recordingId: string,
  partNumber: number,
) {
  return api<{ partNumber: number; uploadUrl: string; expiresAt: string }>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/recordings/${encodeURIComponent(recordingId)}/part`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify({ partNumber }),
    },
  );
}

export async function completeTeleconsultRecording(
  orgId: string,
  sessionId: string,
  recordingId: string,
  payload: {
    parts: Array<{ partNumber: number; etag: string }>;
    durationMs: number;
  },
) {
  return api<TeleconsultRecording>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/recordings/${encodeURIComponent(recordingId)}/complete`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function listTeleconsultRecordings(
  orgId: string,
  sessionId: string,
) {
  return api<TeleconsultRecording[]>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/recordings`,
    { auth: true },
  );
}

export async function getTeleconsultRecordingDownload(
  orgId: string,
  sessionId: string,
  recordingId: string,
) {
  return api<{ url: string; expiresAt: string }>(
    `/organizations/${encodeURIComponent(orgId)}/teleconsult/${encodeURIComponent(sessionId)}/recordings/${encodeURIComponent(recordingId)}/download`,
    { auth: true },
  );
}
