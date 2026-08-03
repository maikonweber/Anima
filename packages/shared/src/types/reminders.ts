export type MedicationStatus = "ATIVO" | "PAUSADO" | "ENCERRADO";
export type ReminderKind = "MEDICATION" | "APPOINTMENT" | "ACTIVITY";
export type ReminderChannel = "IN_APP" | "EMAIL";
export type ReminderOccurrenceStatus =
  | "PENDENTE"
  | "TOMADO"
  | "NAO_TOMADO"
  | "ADIADO"
  | "EXPIRADO";

export type ReminderSchedule = {
  times: string[];
  daysOfWeek?: number[];
};

export type PatientMedication = {
  id: string;
  organizationId: string;
  patientId: string;
  registeredByUserId: string | null;
  name: string;
  dose: string;
  schedule: ReminderSchedule;
  startsOn: string;
  endsOn: string | null;
  notes: string | null;
  status: MedicationStatus;
  criadoEm: string;
  atualizadoEm: string;
};

export type PatientReminder = {
  id: string;
  organizationId: string;
  patientId: string;
  kind: ReminderKind;
  medicationId: string | null;
  appointmentId: string | null;
  title: string;
  schedule: ReminderSchedule;
  timezone: string;
  channel: ReminderChannel;
  enabled: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  createdByUserId: string | null;
  startsOn: string;
  endsOn: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type ReminderOccurrence = {
  id: string;
  reminderId: string;
  organizationId: string;
  patientId: string;
  dueAt: string;
  status: ReminderOccurrenceStatus;
  respondedAt: string | null;
  snoozeUntil: string | null;
  reason: string | null;
  respondedByUserId: string | null;
  criadoEm: string;
  atualizadoEm: string;
  reminder?: PatientReminder | null;
};

export type CreateMedicationPayload = {
  name: string;
  dose: string;
  schedule: ReminderSchedule;
  startsOn: string;
  endsOn?: string | null;
  notes?: string | null;
  createReminder?: boolean;
};

export type RespondOccurrencePayload = {
  status: "TOMADO" | "NAO_TOMADO" | "ADIADO";
  reason?: string | null;
  snoozeMinutes?: number;
};

export type MedicationsListResponse = {
  disclaimer: string;
  data: PatientMedication[];
};

export type CreateMedicationResponse = {
  disclaimer: string;
  medication: PatientMedication;
  reminder: PatientReminder | null;
};
