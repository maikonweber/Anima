import { api } from "../api-client";
import type {
  WhatsAppConnectResult,
  WhatsAppConversation,
  WhatsAppInstance,
  WhatsAppMessage,
  WhatsAppQrcodeResult,
  WhatsAppStatusResult,
} from "../types/whatsapp";

export async function connectWhatsApp(orgId: string) {
  return api<WhatsAppConnectResult>(
    `/organizations/${encodeURIComponent(orgId)}/whatsapp/instances`,
    { method: "POST", auth: true },
  );
}

export async function listWhatsAppInstances(orgId: string) {
  return api<WhatsAppInstance[]>(
    `/organizations/${encodeURIComponent(orgId)}/whatsapp/instances`,
    { auth: true },
  );
}

export async function getWhatsAppQrcode(orgId: string, instanceId: string) {
  return api<WhatsAppQrcodeResult>(
    `/organizations/${encodeURIComponent(orgId)}/whatsapp/instances/${encodeURIComponent(instanceId)}/qrcode`,
    { auth: true },
  );
}

export async function getWhatsAppStatus(orgId: string, instanceId: string) {
  return api<WhatsAppStatusResult>(
    `/organizations/${encodeURIComponent(orgId)}/whatsapp/instances/${encodeURIComponent(instanceId)}/status`,
    { auth: true },
  );
}

export async function disconnectWhatsApp(orgId: string, instanceId: string) {
  return api<WhatsAppInstance>(
    `/organizations/${encodeURIComponent(orgId)}/whatsapp/instances/${encodeURIComponent(instanceId)}`,
    { method: "DELETE", auth: true },
  );
}

export async function listWhatsAppConversations(orgId: string) {
  return api<WhatsAppConversation[]>(
    `/organizations/${encodeURIComponent(orgId)}/whatsapp/conversations`,
    { auth: true },
  );
}

export async function listWhatsAppMessages(
  orgId: string,
  conversationId: string,
) {
  return api<WhatsAppMessage[]>(
    `/organizations/${encodeURIComponent(orgId)}/whatsapp/conversations/${encodeURIComponent(conversationId)}/messages`,
    { auth: true },
  );
}

export async function sendWhatsAppConversationMessage(
  orgId: string,
  conversationId: string,
  body: string,
) {
  return api<WhatsAppMessage>(
    `/organizations/${encodeURIComponent(orgId)}/whatsapp/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify({ body }),
    },
  );
}

export async function handoffWhatsAppConversation(
  orgId: string,
  conversationId: string,
) {
  return api<{ ok: boolean; status: string }>(
    `/organizations/${encodeURIComponent(orgId)}/whatsapp/conversations/${encodeURIComponent(conversationId)}/handoff`,
    { method: "POST", auth: true },
  );
}

export async function setWhatsAppConversationAi(
  orgId: string,
  conversationId: string,
  enabled: boolean,
) {
  return api<{ ok: boolean; aiEnabled: boolean }>(
    `/organizations/${encodeURIComponent(orgId)}/whatsapp/conversations/${encodeURIComponent(conversationId)}/ai`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ enabled }),
    },
  );
}

export async function sendWhatsAppPatientMessage(
  orgId: string,
  patientId: string,
  body: string,
) {
  return api<WhatsAppMessage>(
    `/organizations/${encodeURIComponent(orgId)}/whatsapp/patients/${encodeURIComponent(patientId)}/messages`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify({ body }),
    },
  );
}
