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
  criadoEm: string;
  atualizadoEm: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
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

export interface DiaryEntryEmotion {
  id: string;
  emotionId: string;
  intensidade?: number;
  nome: string;
  cor?: string;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  texto: string;
  energiaInformada: number;
  observacoes?: string;
  dataRegistro: string;
  criadoEm: string;
  atualizadoEm: string;
  emotions?: DiaryEntryEmotion[];
}

export interface DiaryEntryInput {
  userId: string;
  texto: string;
  energiaInformada: number;
  emotions: { emotionId: string; intensidade?: number }[];
  observacoes?: string;
  dataRegistro?: string;
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
