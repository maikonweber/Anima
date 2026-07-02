"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptTerms,
  getTermByType,
  getTerms,
  getTermsAcceptances,
  getTermsStatus,
} from "@/lib/api/terms";
import { useAuth } from "@/providers/auth-provider";
import type { TermsStatus, TermsType } from "@/types/terms";

export const termsKeys = {
  all: ["terms"] as const,
  list: ["terms", "list"] as const,
  byType: (tipo: TermsType) => ["terms", "by-type", tipo] as const,
  status: ["terms", "me", "status"] as const,
  acceptances: ["terms", "me", "acceptances"] as const,
};

/** Termos ativos (público). */
export function useTerms() {
  return useQuery({
    queryKey: termsKeys.list,
    queryFn: getTerms,
  });
}

/** Um termo por tipo (público). */
export function useTermByType(tipo: TermsType | null) {
  return useQuery({
    queryKey: termsKeys.byType(tipo!),
    queryFn: () => getTermByType(tipo!),
    enabled: !!tipo,
    retry: false,
  });
}

/** Status de aceite do usuário logado. */
export function useTermsStatus() {
  const { user } = useAuth();
  return useQuery({
    queryKey: termsKeys.status,
    queryFn: getTermsStatus,
    enabled: !!user,
  });
}

/** Histórico de aceites do usuário logado. */
export function useTermsAcceptances() {
  const { user } = useAuth();
  return useQuery({
    queryKey: termsKeys.acceptances,
    queryFn: getTermsAcceptances,
    enabled: !!user,
  });
}

/** Registra o aceite dos termos e sincroniza o status em cache. */
export function useAcceptTerms() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (termIds: string[]) => acceptTerms(termIds),
    onSuccess: (status: TermsStatus) => {
      queryClient.setQueryData(termsKeys.status, status);
      queryClient.invalidateQueries({ queryKey: termsKeys.acceptances });
    },
  });
}
