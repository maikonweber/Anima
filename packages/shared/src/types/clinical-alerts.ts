import type { OrganizationRole } from "./organizations";

export type ClinicalAlertStatus =
  | "PENDENTE_REVISAO"
  | "APROVADA"
  | "REJEITADA"
  | "ARQUIVADA";

export type ClinicalAlertSeverity = "LOW" | "MEDIUM" | "HIGH";

export type ClinicalAlert = {
  id: string;
  organizationId: string;
  patientId: string;
  patientFullName?: string | null;
  status: ClinicalAlertStatus;
  severity: ClinicalAlertSeverity;
  source: "RULE" | "IA";
  code: string;
  title: string;
  draftMessage: string;
  editedMessage: string | null;
  approvedMessage: string | null;
  workingMessage: string;
  rejectionReason: string | null;
  evidence: Array<{ type: "diary_entry"; id: string }>;
  generatedByUserId: string | null;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  criadoEm: string;
  atualizadoEm: string;
  disclaimer: string;
};

export type ClinicalAlertScanResult = {
  created: ClinicalAlert[];
  skipped: string[];
  message: string;
};

export type ListClinicalAlertsQuery = {
  status?: ClinicalAlertStatus;
  patientId?: string;
  limit?: number;
};

export type UpdateClinicalAlertPayload = Partial<{
  title: string;
  editedMessage: string;
  severity: ClinicalAlertSeverity;
}>;

export type ClinicDashboardOverview = {
  role: OrganizationRole;
  capabilities: {
    clinicalQueues: boolean;
    invites: boolean;
    audit: boolean;
    crm: boolean;
    agenda: boolean;
  };
  today?: {
    appointments: Array<{
      id: string;
      patientId: string | null;
      startsAt: string;
      endsAt: string;
      status: string;
      modality: string;
    }>;
    total: number;
  };
  pendingAlerts?: {
    count: number;
    items: ClinicalAlert[];
  };
  pendingSyntheses?: {
    count: number;
    items: Array<{
      id: string;
      patientId: string;
      title: string | null;
      criadoEm: string;
    }>;
  };
  patientsSummary?: { total: number };
  caseloadCount?: number;
  auditSummary?: {
    recentCount: number;
    items: Array<{
      id: string;
      action: string;
      targetType: string | null;
      criadoEm: string;
    }>;
  };
  disclaimer: string;
};
