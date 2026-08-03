export type ClinicalKnowledgeStatus =
  | "RASCUNHO"
  | "PUBLICADO"
  | "ARQUIVADO";

export type ClinicalKnowledgeScope = "PLATFORM" | "ORGANIZATION";

export type ClinicalKnowledgeArticle = {
  id: string;
  organizationId: string | null;
  scope: ClinicalKnowledgeScope;
  status: ClinicalKnowledgeStatus;
  title: string;
  body: string;
  category: string | null;
  tags: string[];
  createdByUserId: string | null;
  publishedByUserId: string | null;
  publishedAt: string | null;
  criadoEm: string;
  atualizadoEm: string;
  editable: boolean;
};

export type CreateClinicalKnowledgePayload = {
  title: string;
  body: string;
  category?: string | null;
  tags?: string[];
};

export type UpdateClinicalKnowledgePayload = Partial<{
  title: string;
  body: string;
  category: string | null;
  tags: string[];
}>;

export type ListClinicalKnowledgeQuery = {
  status?: ClinicalKnowledgeStatus;
  scope?: ClinicalKnowledgeScope;
  q?: string;
};

export type ClinicalKnowledgeSearchResult = {
  mode: "semantic" | "texto";
  data: Array<{
    id: string;
    title: string;
    body: string;
    category: string | null;
    similarity: number;
  }>;
};
