export type ConsentPurpose =
  | "TRATAMENTO_CLINICO"
  | "PRONTUARIO"
  | "DIARIO_CHECKIN"
  | "TELECONSULTA"
  | "IA_ASSISTIVA"
  | "PESQUISA_QUALIDADE"
  | "DASHBOARD_PROFISSIONAL"
  | "LEMBRETES"
  | "TELECONSULTA_TRANSCRICAO"
  | "TELECONSULTA_MULTIMODAL"
  | "TELECONSULTA_GRAVACAO";

export type ConsentStatus =
  | "PENDENTE"
  | "CONCEDIDO"
  | "REVOGADO"
  | "EXPIRADO";

export type ConsentGrantChannel =
  | "APP"
  | "PAPER"
  | "VERBAL_RECORDED"
  | "OTHER";

export type ConsentExportStatus = "PENDENTE" | "PRONTO" | "FALHOU";

export type ConsentPurposeDefinition = {
  id: string;
  purpose: ConsentPurpose;
  versao: string;
  titulo: string;
  descricao: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export type PatientConsent = {
  id: string;
  organizationId: string;
  patientId: string;
  purpose: ConsentPurpose;
  purposeDefinitionId: string;
  status: ConsentStatus;
  grantedAt: string | null;
  revokedAt: string | null;
  expiresAt: string | null;
  criadoEm: string;
  atualizadoEm: string;
  userId?: string | null;
  grantedByUserId?: string | null;
  revokedByUserId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
};

export type ConsentPurposeStatusItem = {
  purpose: ConsentPurpose;
  titulo: string | null;
  versao: string | null;
  definitionId: string | null;
  disponivel: boolean;
  status: ConsentStatus;
  consentId: string | null;
  grantedAt: string | null;
  revokedAt: string | null;
  expiresAt: string | null;
};

export type PatientConsentStatus = {
  patientId: string;
  organizationId: string;
  todosConcedidos: boolean;
  porFinalidade: ConsentPurposeStatusItem[];
};

export type ConsentExportRequest = {
  id: string;
  organizationId: string;
  patientId: string;
  requestedByUserId: string;
  status: ConsentExportStatus;
  payloadRef: string | null;
  metadata: Record<string, unknown>;
  criadoEm: string;
  atualizadoEm: string;
};

export type GrantConsentPayload = {
  purpose: ConsentPurpose;
  expiresAt?: string | null;
  channel?: ConsentGrantChannel;
  note?: string;
};

export type RevokeConsentPayload = {
  reason?: string;
};

export type RequestConsentExportPayload = {
  note?: string;
};

export type ListConsentsQuery = {
  purpose?: ConsentPurpose;
  status?: ConsentStatus;
  currentOnly?: boolean;
};
