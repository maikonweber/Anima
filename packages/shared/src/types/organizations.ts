export type OrganizationRole =
  | "CLINIC_ADMIN"
  | "PROFESSIONAL"
  | "SECRETARY"
  | "PATIENT"
  | "DPO";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  mfaRequired: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export type OrganizationMembershipSummary = {
  id: string;
  role: OrganizationRole;
  status: "ACTIVE" | "REVOKED";
  criadoEm?: string;
};

export type MyOrganization = {
  organization: Organization;
  membership: OrganizationMembershipSummary;
};

export type CreateOrganizationPayload = {
  name: string;
  timezone?: string;
  mfaRequired?: boolean;
};

export type OrganizationInvite = {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationRole;
  status: "PENDENTE" | "ACEITO" | "REVOGADO" | "EXPIRADO";
  expiresAt: string;
  criadoEm: string;
  aceitoEm?: string | null;
  organizationName?: string;
};

export type CreateOrganizationInvitePayload = {
  email: string;
  role: OrganizationRole;
};

export type AcceptOrganizationInvitePayload = {
  token: string;
};

export type AcceptOrganizationInviteResponse = {
  organization: Pick<Organization, "id"> & Partial<Organization>;
  membership: OrganizationMembershipSummary;
  invite: OrganizationInvite;
};
