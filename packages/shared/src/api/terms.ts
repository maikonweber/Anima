import { api } from "../api-client";
import type {
  Term,
  TermAcceptance,
  TermsStatus,
  TermsType,
} from "../types/terms";

/** GET /terms — público. Retorna os termos ativos. */
export async function getTerms() {
  return api<Term[]>("/terms");
}

/** GET /terms/:tipo — público. 404 se não houver termo ativo; 400 se tipo inválido. */
export async function getTermByType(tipo: TermsType) {
  return api<Term>(`/terms/${tipo}`);
}

/** POST /terms/accept — autenticado. Idempotente. Retorna o status atualizado. */
export async function acceptTerms(termIds: string[]) {
  return api<TermsStatus>("/terms/accept", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ termIds }),
  });
}

/** GET /terms/me/status — autenticado. */
export async function getTermsStatus() {
  return api<TermsStatus>("/terms/me/status", { auth: true });
}

/** GET /terms/me/acceptances — autenticado. Histórico de aceites. */
export async function getTermsAcceptances() {
  return api<TermAcceptance[]>("/terms/me/acceptances", { auth: true });
}
