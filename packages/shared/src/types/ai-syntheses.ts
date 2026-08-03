export type AiSynthesisStatus =
  | "RASCUNHO"
  | "PENDENTE_REVISAO"
  | "APROVADA"
  | "REJEITADA";

export type AiSynthesisSourceKind = "DIARIO" | "SESSAO" | "MISTO";

export type AiSynthesisSourceRef = {
  type: "diary_entry" | "appointment" | "clinical_knowledge";
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
  dateFrom?: string;
  dateTo?: string;
  title?: string;
};

export type UpdateAiSynthesisPayload = Partial<{
  title: string | null;
  editedContent: string;
}>;

export type ApproveAiSynthesisPayload = {
  createClinicalNote?: boolean;
  noteTitle?: string;
};

export type RejectAiSynthesisPayload = {
  reason?: string | null;
};

export type ListAiSynthesesQuery = {
  status?: AiSynthesisStatus;
};
