export type AssistantSession = {
  id: string;
  userId: string;
  titulo: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type AssistantMessage = {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  contextEntryIds: string[] | null;
  tokensUsed: number | null;
  criadoEm: string;
};

export type AssistantChatApiResponse = {
  sessionId: string;
  message: Pick<
    AssistantMessage,
    "id" | "role" | "content" | "contextEntryIds" | "criadoEm"
  >;
};

export type AssistantSessionListResponse = {
  data: AssistantSession[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AssistantSessionDetailResponse = {
  session: AssistantSession;
  messages: AssistantMessage[];
};
