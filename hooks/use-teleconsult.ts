"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTeleconsult,
  endTeleconsult,
  getTeleconsult,
  getTeleconsultByAppointment,
  joinTeleconsultByRoomCode,
} from "@/lib/api/teleconsult";
import { useAuth } from "@/providers/auth-provider";

export function useTeleconsult(orgId: string, sessionId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["teleconsult", orgId, sessionId],
    queryFn: () => getTeleconsult(orgId, sessionId),
    enabled: !!user && !!orgId && !!sessionId,
    retry: false,
  });
}

export function useTeleconsultByAppointment(
  orgId: string,
  appointmentId: string,
  enabled = true,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["teleconsult-by-appointment", orgId, appointmentId],
    queryFn: () => getTeleconsultByAppointment(orgId, appointmentId),
    enabled: !!user && !!orgId && !!appointmentId && enabled,
    retry: false,
  });
}

export function useCreateTeleconsult(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointmentId: string) =>
      createTeleconsult(orgId, appointmentId),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ["teleconsult", orgId, data.id],
      });
      void queryClient.invalidateQueries({
        queryKey: ["teleconsult-by-appointment", orgId, data.appointmentId],
      });
    },
  });
}

export function useJoinTeleconsult() {
  return useMutation({
    mutationFn: (roomCode: string) => joinTeleconsultByRoomCode(roomCode),
  });
}

export function useEndTeleconsult(orgId: string, sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => endTeleconsult(orgId, sessionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["teleconsult", orgId, sessionId],
      });
    },
  });
}
