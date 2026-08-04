"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  connectWhatsApp,
  disconnectWhatsApp,
  getWhatsAppQrcode,
  getWhatsAppStatus,
  handoffWhatsAppConversation,
  listWhatsAppConversations,
  listWhatsAppInstances,
  listWhatsAppMessages,
  sendWhatsAppConversationMessage,
  setWhatsAppConversationAi,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

export function useWhatsAppInstances(orgId: string, enabled = true) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["whatsapp-instances", orgId],
    queryFn: () => listWhatsAppInstances(orgId),
    enabled: !!user && !!orgId && enabled,
    refetchInterval: 10_000,
  });
}

export function useWhatsAppStatus(
  orgId: string,
  instanceId: string | undefined,
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["whatsapp-status", orgId, instanceId],
    queryFn: () => getWhatsAppStatus(orgId, instanceId!),
    enabled: !!user && !!orgId && !!instanceId && enabled,
    refetchInterval: 5_000,
  });
}

export function useWhatsAppQrcode(
  orgId: string,
  instanceId: string | undefined,
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["whatsapp-qrcode", orgId, instanceId],
    queryFn: () => getWhatsAppQrcode(orgId, instanceId!),
    enabled: !!user && !!orgId && !!instanceId && enabled,
    refetchInterval: 5_000,
  });
}

export function useWhatsAppConversations(orgId: string, enabled = true) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["whatsapp-conversations", orgId],
    queryFn: () => listWhatsAppConversations(orgId),
    enabled: !!user && !!orgId && enabled,
    refetchInterval: 8_000,
  });
}

export function useWhatsAppMessages(
  orgId: string,
  conversationId: string | undefined,
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["whatsapp-messages", orgId, conversationId],
    queryFn: () => listWhatsAppMessages(orgId, conversationId!),
    enabled: !!user && !!orgId && !!conversationId && enabled,
    refetchInterval: 4_000,
  });
}

export function useConnectWhatsApp(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => connectWhatsApp(orgId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["whatsapp-instances", orgId],
      });
    },
  });
}

export function useDisconnectWhatsApp(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (instanceId: string) => disconnectWhatsApp(orgId, instanceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["whatsapp-instances", orgId],
      });
    },
  });
}

export function useSendWhatsAppMessage(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { conversationId: string; body: string }) =>
      sendWhatsAppConversationMessage(orgId, vars.conversationId, vars.body),
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({
        queryKey: ["whatsapp-messages", orgId, vars.conversationId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["whatsapp-conversations", orgId],
      });
    },
  });
}

export function useHandoffWhatsApp(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) =>
      handoffWhatsAppConversation(orgId, conversationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["whatsapp-conversations", orgId],
      });
    },
  });
}

export function useToggleWhatsAppAi(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { conversationId: string; enabled: boolean }) =>
      setWhatsAppConversationAi(orgId, vars.conversationId, vars.enabled),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["whatsapp-conversations", orgId],
      });
    },
  });
}
