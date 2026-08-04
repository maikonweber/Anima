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

export type TeleconsultTranscriptSpeaker =
  | "PROFESSIONAL"
  | "PATIENT"
  | "UNKNOWN";

export type TeleconsultTranscriptionStatus =
  | "PENDING"
  | "RUNNING"
  | "READY"
  | "FAILED"
  | "STOPPED";

export type TeleconsultTranscriptionSegment = {
  id: string;
  speaker: TeleconsultTranscriptSpeaker;
  authorUserId?: string | null;
  startedMs?: number | null;
  endedMs?: number | null;
  text: string;
  confidence?: number | null;
  criadoEm: string;
};

export type TeleconsultTranscription = {
  id: string;
  organizationId: string;
  sessionId: string;
  status: TeleconsultTranscriptionStatus;
  language: string;
  provider: string;
  startedByUserId: string | null;
  startedAt: string | null;
  endedAt: string | null;
  error: string | null;
  criadoEm: string;
  segments: TeleconsultTranscriptionSegment[];
};

export type AppendTranscriptionSegmentsPayload = {
  segments: Array<{
    text: string;
    speaker?: TeleconsultTranscriptSpeaker;
    startedMs?: number | null;
    endedMs?: number | null;
    confidence?: number | null;
  }>;
};

export type TeleconsultMultimodalAggregatePayload = {
  voice?: {
    avgEnergy: number;
    peakEnergy: number;
    pauseRatio: number;
    speakingRatio: number;
    longPauseCount: number;
  };
  vision?: {
    facePresenceRatio: number;
    motionScore: number;
    sampleCount: number;
  };
  meta?: {
    muted?: boolean;
    videoOff?: boolean;
    source?: "local" | "remote";
  };
};

export type PostMultimodalAggregatePayload = {
  clientModelVersion: string;
  windowStartedAt?: string | null;
  windowEndedAt?: string | null;
  payload: TeleconsultMultimodalAggregatePayload;
};

export type TeleconsultMultimodalAggregate = {
  id: string;
  sessionId: string;
  clientModelVersion: string;
  windowStartedAt: string | null;
  windowEndedAt: string | null;
  payload: TeleconsultMultimodalAggregatePayload;
  criadoEm: string;
};

export type TeleconsultRecording = {
  id: string;
  objectId?: string;
  organizationId?: string;
  sessionId?: string;
  mediaType: "audio" | "video";
  contentType?: "audio/webm" | "video/webm";
  status:
    | "PENDING"
    | "RECORDING"
    | "PROCESSING"
    | "READY"
    | "FAILED"
    | "DELETED";
  durationMs?: number | null;
  startedAt?: string | null;
  endedAt?: string | null;
  criadoEm?: string;
};
