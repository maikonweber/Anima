import type { SubscriptionSummary } from "@/types/subscription";

export type EnergyCategory =
  | "EXAUSTAO"
  | "BAIXA"
  | "INSTAVEL"
  | "FUNCIONAL"
  | "EXPANSIVA";

export type WeekTrend = "ESTAVEL" | "SUBINDO" | "DESCENDO";

export interface User {
  id: string;
  nome: string;
  email: string;
  emailVerified: boolean;
  criadoEm: string;
  atualizadoEm: string;
  subscription?: SubscriptionSummary;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  user: User;
}

export interface RegisterResponse extends AuthResponse {
  message?: string;
}

export interface Emotion {
  id: string;
  nome: string;
  descricao?: string;
  cor?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface DiaryEmotion {
  emotionId: string;
  intensidade?: number;
}

export interface DiaryEntryEmotion {
  id: string;
  emotionId: string;
  intensidade: number | null;
  nome: string;
  cor: string | null;
}

export interface EmotionalTracking {
  sono?: number;
  estresse?: number;
  socializacao?: number;
  motivacao?: number;
  burnout?: number;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  texto: string;
  humor?: string;
  ansiedadeInformada?: number;
  intensidadeEmocional?: number;
  tagsEmocionais?: string[];
  tracking?: EmotionalTracking;
  energiaInformada: number;
  observacoes: string | null;
  dataRegistro: string;
  criadoEm: string;
  atualizadoEm: string;
  emotions?: DiaryEntryEmotion[];
}

export type DiaryEntryDetail = DiaryEntry & {
  emotions: DiaryEntryEmotion[];
};

export interface CreateDiaryEntry {
  texto: string;
  humor?: string;
  ansiedadeInformada?: number;
  intensidadeEmocional?: number;
  tagsEmocionais?: string[];
  tracking?: EmotionalTracking;
  energiaInformada: number;
  emotions: DiaryEmotion[];
  observacoes?: string;
  dataRegistro?: string;
}

export interface UpdateDiaryEntry {
  texto?: string;
  humor?: string;
  ansiedadeInformada?: number;
  intensidadeEmocional?: number;
  tagsEmocionais?: string[];
  tracking?: EmotionalTracking;
  energiaInformada?: number;
  emotions?: DiaryEmotion[];
  observacoes?: string | null;
  dataRegistro?: string;
}

/** @deprecated Use CreateDiaryEntry */
export type DiaryEntryInput = CreateDiaryEntry;

export interface DiaryEntriesQuery {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedDiaryEntries {
  data: DiaryEntry[];
  meta: PaginatedMeta;
}

export interface DiaryAnalysis {
  id: string;
  diaryEntryId: string;
  energiaCalculada: number;
  categoriaEnergia: EnergyCategory;
  emocoesBaseDetectadas: string[];
  emocaoOculta: string;
  emocaoComposta: string;
  necessidadeIdentificada: string;
  desejoIdentificado: string;
  acaoSugerida: string;
  resumoEmocional: string;
  confianca: number;
  regulationPracticeId?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface WeekSummary {
  periodo: { inicio: string; fim: string };
  mediaEnergia: number;
  mediaSono?: number;
  mediaEstresse?: number;
  mediaSocializacao?: number;
  mediaMotivacao?: number;
  mediaBurnout?: number;
  emocoesMaisFrequentes: { nome: string; count: number }[];
  emocaoCompostaMaisFrequente: { nome: string; count: number } | null;
  quantidadeRegistros: number;
  tendenciaSemana: WeekTrend;
  principaisNecessidades: { nome: string; count: number }[];
}

export interface EmotionCombination {
  id: string;
  emotionAId: string;
  emotionBId: string;
  nomeComposto: string;
  descricao?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface RegulationPractice {
  id: string;
  nome: string;
  descricao?: string;
  tipo?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface DeleteDiaryEntryResponse {
  message: string;
}

export type CareInviteStatus = "PENDENTE" | "ACEITO" | "REVOGADO";

export interface CareInvitePublic {
  id: string;
  ownerUserId: string;
  viewerEmail: string;
  viewerUserId: string | null;
  status: CareInviteStatus;
  visualizacaoAtiva: boolean;
  criadoEm: string;
  aceitoEm: string | null;
  revogadoEm: string | null;
  ownerNome?: string;
  viewerNome?: string;
  ownerEmail?: string;
}

export interface CareInviteByToken {
  status: CareInviteStatus;
  visualizacaoAtiva: boolean;
  viewerEmail: string;
  owner: { id: string; nome: string };
  expirado: boolean;
}

export interface AccessibleUser {
  inviteId: string;
  owner: { id: string; nome: string; email: string };
  aceitoEm: string | null;
}

export interface SharedDiaryEntry {
  id: string;
  userId: string;
  texto: string;
  humor?: string;
  ansiedadeInformada?: number;
  intensidadeEmocional?: number;
  tagsEmocionais?: string[];
  tracking?: EmotionalTracking;
  energiaInformada: number;
  dataRegistro: string;
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface DashboardAlert {
  id: string;
  title: string;
  description: string;
  severity?: "low" | "medium" | "high";
}

export interface TherapyTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface LongTermPattern {
  id: string;
  title: string;
  description: string;
  theme?: string;
}

export interface PreConsultSummary {
  subtitle?: string;
  points: string[];
  note?: string;
}

export interface IntelligentReport {
  risks?: string[];
  progressHighlights?: string[];
  recommendations?: string[];
  patternsDetected?: string[];
}

export interface SharedDashboard {
  owner: { id: string; nome: string; email: string };
  weekSummary: WeekSummary;
  diaryEntries: SharedDiaryEntry[];
  alerts?: DashboardAlert[];
  therapyTimeline?: TherapyTimelineEvent[];
  longTermPatterns?: LongTermPattern[];
  preConsultSummary?: PreConsultSummary;
  intelligentReport?: IntelligentReport;
}

export interface RegisterWithInvitePayload {
  nome: string;
  email: string;
  senha: string;
  inviteToken: string;
}

export interface RegisterWithInviteResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  user: User;
  invite: CareInvitePublic;
}
