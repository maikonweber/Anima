import { api } from "../api-client";
import type {
  CreateHomeTestimonialPayload,
  CreateHomeTestimonialInvitePayload,
  CreateHomeTestimonialInvitesResponse,
  HomeTestimonialAdmin,
  HomeTestimonialInviteByToken,
  HomeTestimonialInvitePublic,
  HomeTestimonialPublic,
  SubmitHomeTestimonialInvitePayload,
  UpdateHomeTestimonialPayload,
} from "../types/home-testimonials";

export async function listHomeTestimonialsPublic() {
  return api<HomeTestimonialPublic[]>("/home-testimonials");
}

export async function listHomeTestimonialsAdmin() {
  return api<HomeTestimonialAdmin[]>("/admin/home-testimonials", {
    auth: true,
  });
}

export async function createHomeTestimonial(
  payload: CreateHomeTestimonialPayload,
) {
  return api<HomeTestimonialAdmin>("/admin/home-testimonials", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateHomeTestimonial(
  id: string,
  payload: UpdateHomeTestimonialPayload,
) {
  return api<HomeTestimonialAdmin>(`/admin/home-testimonials/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteHomeTestimonial(id: string) {
  return api<{ deleted: boolean }>(`/admin/home-testimonials/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function uploadHomeTestimonialPhoto(
  id: string,
  photoBase64: string,
) {
  return api<HomeTestimonialAdmin>(`/admin/home-testimonials/${id}/photo`, {
    method: "POST",
    auth: true,
    body: JSON.stringify({ photoBase64 }),
  });
}

export async function listHomeTestimonialInvitesAdmin() {
  return api<HomeTestimonialInvitePublic[]>("/admin/home-testimonial-invites", {
    auth: true,
  });
}

export async function createHomeTestimonialInvites(
  payload: CreateHomeTestimonialInvitePayload,
) {
  return api<CreateHomeTestimonialInvitesResponse>(
    "/admin/home-testimonial-invites",
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function sendHomeTestimonialInviteEmail(
  id: string,
  email?: string,
) {
  return api<HomeTestimonialInvitePublic>(
    `/admin/home-testimonial-invites/${id}/send`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(email ? { email } : {}),
    },
  );
}

export async function revokeHomeTestimonialInvite(id: string) {
  return api<HomeTestimonialInvitePublic>(
    `/admin/home-testimonial-invites/${id}`,
    {
      method: "DELETE",
      auth: true,
    },
  );
}

export async function getHomeTestimonialInviteByToken(token: string) {
  return api<HomeTestimonialInviteByToken>(
    `/home-testimonials/invites/by-token/${encodeURIComponent(token)}`,
  );
}

export async function submitHomeTestimonialInvite(
  payload: SubmitHomeTestimonialInvitePayload,
) {
  return api<{ message: string; testimonialId: string }>(
    "/home-testimonials/invites/submit",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
