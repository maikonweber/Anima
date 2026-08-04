export interface HomeTestimonialPublic {
  id: string;
  authorName: string;
  authorRole: string | null;
  quote: string;
  photoUrl: string | null;
  sortOrder: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface HomeTestimonialAdmin extends HomeTestimonialPublic {
  isActive: boolean;
}

export interface CreateHomeTestimonialPayload {
  authorName: string;
  authorRole?: string;
  quote: string;
  sortOrder?: number;
  isActive?: boolean;
  photoBase64?: string;
}

export type UpdateHomeTestimonialPayload = Partial<
  CreateHomeTestimonialPayload & { clearPhoto?: boolean }
>;

export type HomeTestimonialInviteStatus =
  | "PENDENTE"
  | "USADO"
  | "EXPIRADO"
  | "REVOGADO";

export interface HomeTestimonialInvitePublic {
  id: string;
  token: string;
  label: string | null;
  authorNameHint: string | null;
  authorRoleHint: string | null;
  email: string | null;
  status: HomeTestimonialInviteStatus;
  inviteUrl: string;
  expiresAt: string;
  sentAt: string | null;
  testimonialId: string | null;
  criadoEm: string;
  usadoEm: string | null;
}

export interface CreateHomeTestimonialInvitePayload {
  label?: string;
  authorNameHint?: string;
  authorRoleHint?: string;
  expiresInDays?: number;
  quantity?: number;
  emails?: string[];
}

export interface CreateHomeTestimonialInvitesResponse {
  invites: HomeTestimonialInvitePublic[];
  total: number;
  sent?: number;
  emailResults?: Array<{
    email: string;
    status: "sent" | "error";
    message?: string;
    inviteId?: string;
  }>;
}

export interface HomeTestimonialInviteByToken {
  status: HomeTestimonialInviteStatus;
  label: string | null;
  authorNameHint: string | null;
  authorRoleHint: string | null;
  expiresAt: string;
  canSubmit: boolean;
}

export interface SubmitHomeTestimonialInvitePayload {
  token: string;
  authorName: string;
  authorRole?: string;
  quote: string;
  photoBase64?: string;
}
