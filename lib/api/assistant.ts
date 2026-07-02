import { api } from "@/lib/api-client";
import type {
  AssistantChatApiResponse,
  AssistantSessionDetailResponse,
  AssistantSessionListResponse,
  AssistantSuggestions,
} from "@/types/assistant";

function buildPaginationQuery(page: number, limit: number): string {
  const search = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return `?${search.toString()}`;
}

export async function sendAssistantChatMessage(
  message: string,
  sessionId?: string,
) {
  return api<AssistantChatApiResponse>("/assistant/chat", {
    method: "POST",
    auth: true,
    body: JSON.stringify(
      sessionId ? { message, sessionId } : { message },
    ),
  });
}

export async function listAssistantSessions(page = 1, limit = 20) {
  const qs = buildPaginationQuery(page, limit);
  return api<AssistantSessionListResponse>(
    `/assistant/sessions${qs}`,
    { auth: true },
  );
}

export async function getAssistantSession(sessionId: string) {
  return api<AssistantSessionDetailResponse>(
    `/assistant/sessions/${sessionId}`,
    { auth: true },
  );
}

export async function deleteAssistantSession(sessionId: string) {
  await api<{ message?: string }>(`/assistant/sessions/${sessionId}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function getAssistantSuggestions() {
  return api<AssistantSuggestions>("/assistant/suggestions", { auth: true });
}
