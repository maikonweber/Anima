export type PatientStatus =
  | "LEAD"
  | "TRIAGEM"
  | "ATIVO"
  | "PAUSADO"
  | "ALTA"
  | "INATIVO";

export type PatientContactChannel = "EMAIL" | "PHONE" | "WHATSAPP" | "NONE";

export type Patient = {
  id: string;
  organizationId: string;
  userId: string | null;
  fullName: string;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  status: PatientStatus;
  preferredContact: PatientContactChannel;
  operationalNotes: string | null;
  primaryProfessionalUserId: string | null;
  createdByUserId: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type PatientContact = {
  id: string;
  name: string;
  relationship: string | null;
  email: string | null;
  phone: string | null;
  isEmergencyContact: boolean;
  criadoEm?: string;
};

export type PatientStatusHistoryItem = {
  id: string;
  fromStatus: PatientStatus | null;
  toStatus: PatientStatus;
  reason: string | null;
  changedByUserId: string | null;
  changedByNome: string | null;
  criadoEm: string;
};

export type PatientDetail = Patient & {
  contacts: PatientContact[];
  statusHistory: PatientStatusHistoryItem[];
};

export type PaginatedPatients = {
  items: Patient[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CreatePatientPayload = {
  fullName: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  status?: PatientStatus;
  preferredContact?: PatientContactChannel;
  operationalNotes?: string;
  primaryProfessionalUserId?: string | null;
  contacts?: Array<{
    name: string;
    relationship?: string;
    email?: string;
    phone?: string;
    isEmergencyContact?: boolean;
  }>;
};

export type UpdatePatientPayload = Partial<CreatePatientPayload> & {
  status?: PatientStatus;
};

export type UpdatePatientStatusPayload = {
  status: PatientStatus;
  reason?: string;
};

export type ListPatientsQuery = {
  status?: PatientStatus;
  q?: string;
  primaryProfessionalUserId?: string;
  page?: number;
  limit?: number;
};
