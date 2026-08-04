"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMarketingOfferByToken,
  redeemMarketingCampaign,
  registerWithMarketingCampaign,
} from "@/lib/api/marketing";
import type { RegisterWithMarketingCampaignPayload } from "@anima/shared";

export function useMarketingOfferByToken(token: string | null) {
  return useQuery({
    queryKey: ["marketing-offer-by-token", token],
    queryFn: () => getMarketingOfferByToken(token!),
    enabled: !!token,
    retry: false,
  });
}

export function useRedeemMarketingCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => redeemMarketingCampaign(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-offer-by-token"] });
    },
  });
}

export function useRegisterWithMarketingCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterWithMarketingCampaignPayload) =>
      registerWithMarketingCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-offer-by-token"] });
    },
  });
}
