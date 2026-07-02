export type TrendDirection = "SUBINDO" | "DESCENDO" | "ESTAVEL";
export type MonthlyTrendDirection = TrendDirection | "SEM_DADOS";

export type StreakAlertType =
  | "PARABENS"
  | "MANTER_STREAK"
  | "RETOMAR"
  | "COMECAR";

export type StreakAlert = {
  tipo: StreakAlertType;
  mensagem: string;
};

export type Streak = {
  streakAtual: number;
  maiorStreak: number;
  registrosTotais: number;
  registrosNoMes: number;
  ultimoRegistro: string | null;
  registrouHoje: boolean;
  alerta: StreakAlert;
};

export type AchievementProgress = {
  atual: number;
  meta: number;
  percentual: number;
};

export type Achievement = {
  codigo: string;
  titulo: string;
  descricao: string;
  desbloqueado: boolean;
  progresso: AchievementProgress;
};

export type Achievements = {
  resumo: {
    desbloqueadas: number;
    total: number;
    streakAtual: number;
  };
  achievements: Achievement[];
};

export type TrendPoint = {
  data: string;
  quantidade: number;
  mediaEnergia: number | null;
  mediaAnsiedade: number | null;
  sono: number | null;
  estresse: number | null;
  socializacao: number | null;
  motivacao: number | null;
  burnout: number | null;
};

export type Trends = {
  periodo: { inicio: string; fim: string; dias: number };
  totais: {
    registros: number;
    diasComRegistro: number;
    mediaEnergia: number | null;
    tendencia: TrendDirection;
  };
  serie: TrendPoint[];
};

export type CountItem = { nome: string; count: number };

export type MonthlyReport = {
  mes: string;
  periodo: { inicio: string; fim: string };
  quantidadeRegistros: number;
  diasComRegistro: number;
  mediaEnergia: number | null;
  comparacaoMesAnterior: {
    mediaEnergiaMesAnterior: number | null;
    deltaEnergia: number | null;
    tendencia: MonthlyTrendDirection;
  };
  melhorDia: { data: string; mediaEnergia: number } | null;
  piorDia: { data: string; mediaEnergia: number } | null;
  emocoesMaisFrequentes: CountItem[];
  emocaoCompostaMaisFrequente: CountItem | null;
  principaisNecessidades: CountItem[];
  tracking: {
    sono: number | null;
    estresse: number | null;
    socializacao: number | null;
    motivacao: number | null;
    burnout: number | null;
  };
};

export type Correlation = {
  metrica: string;
  coeficiente: number | null;
  amostra: number;
  interpretacao: string;
};

export type Correlations = {
  periodo: { inicio: string; fim: string };
  amostraRegistros: number;
  correlacoes: Correlation[];
};

export type DiarySearchMode = "semantic" | "texto";

export type DiarySearchResult = {
  id: string;
  dataRegistro: string;
  texto: string;
  energiaInformada: number;
  humor: string | null;
  relevancia: number | null;
};

export type DiarySearch = {
  modo: DiarySearchMode;
  resultados: DiarySearchResult[];
};
