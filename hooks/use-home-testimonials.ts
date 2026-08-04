"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHomeTestimonial,
  createHomeTestimonialInvites,
  deleteHomeTestimonial,
  listHomeTestimonialInvitesAdmin,
  listHomeTestimonialsAdmin,
  listHomeTestimonialsPublic,
  revokeHomeTestimonialInvite,
  sendHomeTestimonialInviteEmail,
  getHomeTestimonialInviteByToken,
  submitHomeTestimonialInvite,
  updateHomeTestimonial,
  uploadHomeTestimonialPhoto,
} from "@/lib/api/home-testimonials";
import type {
  CreateHomeTestimonialInvitePayload,
  CreateHomeTestimonialPayload,
  SubmitHomeTestimonialInvitePayload,
  UpdateHomeTestimonialPayload,
} from "@anima/shared";

export function useHomeTestimonialsPublic() {
  return useQuery({
    queryKey: ["home-testimonials-public"],
    queryFn: listHomeTestimonialsPublic,
    staleTime: 60_000,
  });
}

export function useHomeTestimonialsAdmin() {
  return useQuery({
    queryKey: ["home-testimonials-admin"],
    queryFn: listHomeTestimonialsAdmin,
  });
}

export function useCreateHomeTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateHomeTestimonialPayload) =>
      createHomeTestimonial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-testimonials-admin"] });
      queryClient.invalidateQueries({ queryKey: ["home-testimonials-public"] });
    },
  });
}

export function useUpdateHomeTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateHomeTestimonialPayload;
    }) => updateHomeTestimonial(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-testimonials-admin"] });
      queryClient.invalidateQueries({ queryKey: ["home-testimonials-public"] });
    },
  });
}

export function useDeleteHomeTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHomeTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-testimonials-admin"] });
      queryClient.invalidateQueries({ queryKey: ["home-testimonials-public"] });
    },
  });
}

export function useUploadHomeTestimonialPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, photoBase64 }: { id: string; photoBase64: string }) =>
      uploadHomeTestimonialPhoto(id, photoBase64),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-testimonials-admin"] });
      queryClient.invalidateQueries({ queryKey: ["home-testimonials-public"] });
    },
  });
}

export function useHomeTestimonialInvitesAdmin() {
  return useQuery({
    queryKey: ["home-testimonial-invites-admin"],
    queryFn: listHomeTestimonialInvitesAdmin,
  });
}

export function useCreateHomeTestimonialInvites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateHomeTestimonialInvitePayload) =>
      createHomeTestimonialInvites(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["home-testimonial-invites-admin"],
      });
    },
  });
}

export function useRevokeHomeTestimonialInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revokeHomeTestimonialInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["home-testimonial-invites-admin"],
      });
    },
  });
}

export function useSendHomeTestimonialInviteEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, email }: { id: string; email?: string }) =>
      sendHomeTestimonialInviteEmail(id, email),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["home-testimonial-invites-admin"],
      });
    },
  });
}

export function useHomeTestimonialInviteByToken(token: string | null) {
  return useQuery({
    queryKey: ["home-testimonial-invite-by-token", token],
    queryFn: () => getHomeTestimonialInviteByToken(token!),
    enabled: !!token,
    retry: false,
  });
}

export function useSubmitHomeTestimonialInvite() {
  return useMutation({
    mutationFn: (payload: SubmitHomeTestimonialInvitePayload) =>
      submitHomeTestimonialInvite(payload),
  });
}
