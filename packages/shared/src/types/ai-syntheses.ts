export type AiSynthesisStatus =
  | "RASCUNHO"
  | "PENDENTE_REVISAO"
  | "APROVADA"
  | "REJEITADA";

export type AiSynthesisSourceKind =
  | "DIARIO"
  | "SESSAO"
  | "MISTO"
  | "POS_CONSULTA";

export type AiSynthesisSourceRef = {
  type:
    | "diary_entry"
    | "appointment"
    | "clinical_knowledge"
    | "manual_session_notes"
    | "teleconsult_session"
    | "teleconsult_chat"
    | "transcription_segment";
  id: string;
};

export type AiSynthesis = {
  id: string;
  organizationId: string;
  patientId: string;
  appointmentId: string | null;
  clinicalNoteId: string | null;
  status: AiSynthesisStatus;
  sourceKind: AiSynthesisSourceKind;
  title: string | null;
  draftContent: string;
  editedContent: string | null;
  approvedContent: string | null;
  workingContent: string;
  rejectionReason: string | null;
  model: string | null;
  promptVersion: string;
  sources: AiSynthesisSourceRef[];
  tokensUsed: number | null;
  generatedByUserId: string | null;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type GenerateAiSynthesisPayload = {
  sourceKind: AiSynthesisSourceKind;
  appointmentId?: string | null;
  teleconsultSessionId?: string | null;
  dateFrom?: string;
  dateTo?: string;
  title?: string;
  manualSessionNotes?: string;
  includeDiary?: boolean;
};

export type UpdateAiSynthesisPayload = Partial<{
  title: string | null;
  editedContent: string;
}>;

export type ApproveAiSynthesisPayload = {
  createClinicalNote?: boolean;
  noteTitle?: string;
  createCarePlanDraft?: boolean;
  carePlanStatus?: "RASCUNHO" | "ATIVO";
};

export type CarePlanSuggestion = {
  id: string;
  kind: "ATIVIDADE" | "OBJETIVO" | "ORIENTACAO" | "OUTRO";
  title: string;
  description: string | null;
};

export type ApplyCarePlanSuggestionsPayload = {
  suggestionIds: string[];
  planId?: string | null;
  carePlanStatus?: "RASCUNHO" | "ATIVO";
};

export type RejectAiSynthesisPayload = {
  reason?: string | null;
};

export type ListAiSynthesesQuery = {
  status?: AiSynthesisStatus;
};

export type GenerateSessionIntelligencePayload = {
  manualSessionNotes?: string;
  title?: string;
  includeDiary?: boolean;
};

export type SessionIntelligenceResult = {
  session: import("./teleconsult").TeleconsultSession;
  synthesis: AiSynthesis;
};
