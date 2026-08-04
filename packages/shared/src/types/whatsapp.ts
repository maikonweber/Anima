export type WhatsAppInstanceStatus =
  | "created"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type WhatsAppConversationStatus = "open" | "ai" | "human" | "closed";

export type WhatsAppMessageDirection = "in" | "out";

export type WhatsAppMessageStatus =
  | "received"
  | "queued"
  | "sent"
  | "delivered"
  | "read"
  | "failed";

export type WhatsAppInstance = {
  id: string;
  organizationId: string;
  externalName: string;
  phone: string | null;
  status: WhatsAppInstanceStatus;
  lastConnectedAt: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type WhatsAppConnectResult = {
  instance: WhatsAppInstance;
  qrcode?: string;
};

export type WhatsAppQrcodeResult = {
  qrcode?: string;
  expiresIn: number;
};

export type WhatsAppStatusResult = {
  status: WhatsAppInstanceStatus;
  phone: string | null;
  connectionState: string;
  lastConnectedAt: string | null;
};

export type WhatsAppConversation = {
  id: string;
  organizationId: string;
  patientId: string;
  instanceId: string | null;
  status: WhatsAppConversationStatus;
  aiEnabled: boolean;
  lastMessageAt: string | null;
  criadoEm: string;
  atualizadoEm: string;
  patientFullName?: string;
  patientPhone?: string | null;
  patientStatus?: string;
};

export type WhatsAppMessage = {
  id: string;
  organizationId: string;
  conversationId: string;
  direction: WhatsAppMessageDirection;
  content: string | null;
  externalId: string | null;
  status: WhatsAppMessageStatus;
  error: string | null;
  criadoEm: string;
};
