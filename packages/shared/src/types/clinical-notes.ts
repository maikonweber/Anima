export type ClinicalNoteStatus = "RASCUNHO" | "ASSINADA";

export type ClinicalNoteAddendum = {
  id: string;
  organizationId: string;
  clinicalNoteId: string;
  authorUserId: string;
  content: string;
  contentHash: string;
  criadoEm: string;
};

export type ClinicalNote = {
  id: string;
  organizationId: string;
  patientId: string;
  authorUserId: string;
  appointmentId: string | null;
  status: ClinicalNoteStatus;
  title: string | null;
  content: string;
  contentHash: string | null;
  signedAt: string | null;
  signedByUserId: string | null;
  criadoEm: string;
  atualizadoEm: string;
  addenda: ClinicalNoteAddendum[];
};

export type CreateClinicalNotePayload = {
  title?: string | null;
  content: string;
  appointmentId?: string | null;
};

export type UpdateClinicalNotePayload = {
  title?: string | null;
  content?: string;
  appointmentId?: string | null;
};

export type CreateClinicalNoteAddendumPayload = {
  content: string;
};

export type ListClinicalNotesQuery = {
  status?: ClinicalNoteStatus;
  appointmentId?: string;
};
