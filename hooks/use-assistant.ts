"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteAssistantSession,
  getAssistantSession,
  listAssistantSessions,
  sendAssistantChatMessage,
} from "@/lib/api/assistant";

export const ASSISTANT_SESSIONS_QUERY_KEY = "assistant-sessions";

export function assistantSessionQueryKey(sessionId: string | null | undefined) {
  return ["assistant-session", sessionId ?? "none"] as const;
}

export function useAssistantSessionsInfinite() {
  return useInfiniteQuery({
    queryKey: [ASSISTANT_SESSIONS_QUERY_KEY],
    queryFn: ({ pageParam }) =>
      listAssistantSessions(typeof pageParam === "number" ? pageParam : 1, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    placeholderData: keepPreviousData,
  });
}

export function useAssistantSessionDetail(sessionId: string | null, enabled = true) {
  return useQuery({
    queryKey: assistantSessionQueryKey(sessionId),
    queryFn: () => getAssistantSession(sessionId!),
    enabled: enabled && !!sessionId,
    placeholderData: keepPreviousData,
  });
}

export function useDeleteAssistantSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => deleteAssistantSession(sessionId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [ASSISTANT_SESSIONS_QUERY_KEY] });
    },
  });
}

export function useSendAssistantMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { message: string; sessionId?: string }) =>
      sendAssistantChatMessage(input.message, input.sessionId),
    onSuccess: (data, variables) => {
      void qc.invalidateQueries({ queryKey: [ASSISTANT_SESSIONS_QUERY_KEY] });
      void qc.invalidateQueries({
        queryKey: assistantSessionQueryKey(data.sessionId),
      });
      if (variables.sessionId && variables.sessionId !== data.sessionId) {
        void qc.invalidateQueries({
          queryKey: assistantSessionQueryKey(variables.sessionId),
        });
      }
    },
  });
}
