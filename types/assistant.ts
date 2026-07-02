export type AssistantLimits = {
  messagesUsedThisMonth: number;
  messagesLimitThisMonth: number | null;
  messagesRemainingThisMonth: number | null;
  messagesUsedInSession: number;
  messagesLimitPerSession: number;
  messagesRemainingInSession: number;
};

export type ConversationGraph = {
  emotions: string[];
  topics: string[];
  turnCount: number;
};

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
  tokensUsed?: number | null;
  criadoEm: string;
};

export type AssistantChatApiResponse = {
  sessionId: string;
  message: Pick<
    AssistantMessage,
    "id" | "role" | "content" | "contextEntryIds" | "criadoEm"
  >;
  limits: AssistantLimits;
  conversationGraph?: ConversationGraph;
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
  /** Presente quando a API inclui uso da sessão/plano nesta rota — preferível para o UI. */
  limits?: AssistantLimits | null;
  conversationGraph?: ConversationGraph | null;
};

export type AssistantSuggestions = {
  suggestions: string[];
  baseadoEm: {
    periodo: { inicio: string; fim: string };
    quantidadeRegistros: number;
    tendencia: "SUBINDO" | "DESCENDO" | "ESTAVEL";
    emocaoPrincipal: string | null;
  };
};
