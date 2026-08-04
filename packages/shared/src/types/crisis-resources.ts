export type CrisisResourceSource = "PLATFORM" | "ORGANIZATION";

export type CrisisResource = {
  id: string | null;
  title: string;
  phone: string | null;
  url: string | null;
  note: string | null;
  sortOrder: number;
  enabled: boolean;
  source: CrisisResourceSource;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type CrisisResourcesResponse = {
  disclaimer: string;
  resources: CrisisResource[];
};

export type CreateCrisisResourcePayload = {
  title: string;
  phone?: string | null;
  url?: string | null;
  note?: string | null;
  sortOrder?: number;
  enabled?: boolean;
};

export type UpdateCrisisResourcePayload = {
  title?: string;
  phone?: string | null;
  url?: string | null;
  note?: string | null;
  sortOrder?: number;
  enabled?: boolean;
};

export type ListCrisisResourcesParams = {
  includeDisabled?: boolean;
};
