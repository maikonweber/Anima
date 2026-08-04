export type TeleconsultSessionStatus =
  | "AGENDADA"
  | "PRONTA"
  | "EM_ANDAMENTO"
  | "ENCERRADA"
  | "CANCELADA";

export type TeleconsultSession = {
  id: string;
  organizationId: string;
  appointmentId: string;
  patientId: string;
  professionalUserId: string;
  roomCode: string;
  status: TeleconsultSessionStatus;
  createdByUserId: string | null;
  startedAt: string | null;
  endedAt: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type TeleconsultSignalType = "offer" | "answer" | "ice";

export type TeleconsultSignalMessage = {
  id: string;
  fromUserId: string;
  type: TeleconsultSignalType;
  payload: unknown;
  createdAt: number;
};

export type PostTeleconsultSignalPayload = {
  type: TeleconsultSignalType;
  payload: unknown;
};

export type TeleconsultMessage = {
  id: string;
  organizationId: string;
  sessionId: string;
  authorUserId: string;
  body: string | null;
  deleted: boolean;
  criadoEm: string;
};

export type PostTeleconsultMessagePayload = {
  body: string;
};

export type ListTeleconsultMessagesQuery = {
  afterId?: string;
  limit?: number;
};
