export type TermsType = "USO" | "COMPROMISSO" | "RESPONSABILIDADE";

export interface Term {
  id: string;
  tipo: TermsType;
  versao: string;
  titulo: string;
  /** Texto puro; quebras de linha via "\n" (renderizar com white-space: pre-line). */
  conteudo: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface TermStatusItem {
  tipo: TermsType;
  termId: string | null;
  versao: string | null;
  /** Existe termo ativo desse tipo. */
  disponivel: boolean;
  aceito: boolean;
  aceitoEm: string | null;
}

export interface TermsStatus {
  /** true se todos os termos disponíveis foram aceitos. */
  todosAceitos: boolean;
  /** Termos disponíveis ainda não aceitos. */
  pendentes: TermStatusItem[];
  /** Situação de cada um dos 3 tipos. */
  porTipo: TermStatusItem[];
}

export interface TermAcceptance {
  id: string;
  term: Term;
  aceitoEm: string;
}
