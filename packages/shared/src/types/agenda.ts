export type AppointmentModality = "PRESENCIAL" | "ONLINE" | "HIBRIDO";

export type AppointmentStatus =
  | "AGENDADA"
  | "CONFIRMADA"
  | "REMARCADA"
  | "CANCELADA"
  | "CONCLUIDA"
  | "NO_SHOW";

export type ProfessionalAvailability = {
  id: string;
  organizationId: string;
  professionalUserId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  modality: AppointmentModality;
  timezone: string;
  active: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export type Appointment = {
  id: string;
  organizationId: string;
  patientId: string;
  professionalUserId: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  modality: AppointmentModality;
  timezone: string;
  locationOrLink: string | null;
  operationalNotes: string | null;
  createdByUserId: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type PaginatedAppointments = {
  items: Appointment[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CreateAvailabilityPayload = {
  professionalUserId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes?: number;
  modality?: AppointmentModality;
  timezone?: string;
  active?: boolean;
};

export type UpdateAvailabilityPayload = Partial<
  Omit<CreateAvailabilityPayload, "professionalUserId" | "dayOfWeek">
> & {
  dayOfWeek?: number;
};

export type CreateAppointmentPayload = {
  patientId: string;
  professionalUserId?: string;
  startsAt: string;
  endsAt: string;
  modality?: AppointmentModality;
  timezone?: string;
  locationOrLink?: string;
  operationalNotes?: string;
};

export type UpdateAppointmentPayload = {
  startsAt?: string;
  endsAt?: string;
  modality?: AppointmentModality;
  locationOrLink?: string | null;
  operationalNotes?: string | null;
  status?: AppointmentStatus;
  cancelReason?: string;
};

export type ListAppointmentsQuery = {
  from?: string;
  to?: string;
  professionalUserId?: string;
  patientId?: string;
  status?: AppointmentStatus;
  page?: number;
  limit?: number;
};
