export type CarePlanStatus = "RASCUNHO" | "ATIVO" | "ARQUIVADO";
export type CarePlanItemKind =
  | "ATIVIDADE"
  | "OBJETIVO"
  | "ORIENTACAO"
  | "OUTRO";
export type CarePlanItemStatus =
  | "PENDENTE"
  | "EM_ANDAMENTO"
  | "CONCLUIDO"
  | "CANCELADO";

export type CarePlan = {
  id: string;
  organizationId: string;
  patientId: string;
  title: string;
  summary: string | null;
  status: CarePlanStatus;
  startsOn: string | null;
  endsOn: string | null;
  createdByUserId: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type CarePlanItem = {
  id: string;
  carePlanId: string;
  organizationId: string;
  patientId: string;
  kind: CarePlanItemKind;
  title: string;
  description: string | null;
  sortOrder: number;
  status: CarePlanItemStatus;
  releasedToPatient: boolean;
  dueOn: string | null;
  createdByUserId: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type CarePlanWithItems = {
  plan: CarePlan | null;
  items: CarePlanItem[];
};

export type UpcomingSession = {
  id: string;
  startsAt: string;
  endsAt: string;
  status: string;
  modality: string;
  locationOrLink: string | null;
};

export type MyCarePlanView = {
  plan: CarePlan | null;
  items: CarePlanItem[];
  upcomingSessions: UpcomingSession[];
};

export type CreateCarePlanPayload = {
  title: string;
  summary?: string | null;
  status?: CarePlanStatus;
  startsOn?: string | null;
  endsOn?: string | null;
};

export type CreateCarePlanItemPayload = {
  kind?: CarePlanItemKind;
  title: string;
  description?: string | null;
  sortOrder?: number;
  status?: CarePlanItemStatus;
  releasedToPatient?: boolean;
  dueOn?: string | null;
};

export type UpdateCarePlanPayload = Partial<{
  title: string;
  summary: string | null;
  status: CarePlanStatus;
  startsOn: string | null;
  endsOn: string | null;
}>;

export type UpdateCarePlanItemPayload = Partial<{
  kind: CarePlanItemKind;
  title: string;
  description: string | null;
  sortOrder: number;
  status: CarePlanItemStatus;
  releasedToPatient: boolean;
  dueOn: string | null;
}>;
