import type { Locale } from "@/lib/i18n/config";
import { faqEntriesEn } from "./faq-en";

/** Perguntas frequentes institucionais (SEO / AI-readable) — fonte única home + /faq. */

export interface FaqEntry {
  question: string;
  answer: string;
}

export const faqEntries: FaqEntry[] = [
  {
    question: "A EmotiveCare é terapia?",
    answer:
      "Não. É autoconhecimento e apoio emocional. Não diagnostica, não promete cura e não substitui psicólogo(a) ou médico. Em sofrimento intenso, orienta a buscar ajuda profissional.",
  },
  {
    question: "Qual a diferença entre Pleno, Cuidado e Clínicas?",
    answer:
      "Pleno é o plano completo do app para a pessoa (memória, tracking, compartilhar com 1 profissional). Cuidado é o plano do profissional no app para acompanhar pacientes que o convidam. EmotiveCare Clínicas é outro produto: CRM, agenda, teleconsulta e prontuário da organização — separado do diário pessoal.",
  },
  {
    question: "O que é EmotiveCare Clínicas?",
    answer:
      "É a suíte para profissionais e clínicas: pacientes do tenant, agenda, disponibilidade, teleconsulta, notas clínicas, consentimentos, lembretes, plano de cuidado e sínteses de IA com revisão humana. Não substitui o julgamento clínico.",
  },
  {
    question: "Como funciona a SENTIO AI?",
    answer:
      "Ela sintetiza padrões e sugestões de autocuidado a partir do que você registra — ou, em Clínicas, gera sínteses que o profissional revisa antes de integrar ao prontuário. Sem diagnóstico automático.",
  },
  {
    question: "O que é o segundo cérebro emocional?",
    answer:
      "É a forma como a EmotiveCare conecta emoções por significado, não só por data. Com busca semântica, encontra no histórico momentos parecidos com o agora e os traz para a conversa.",
  },
  {
    question: "Posso compartilhar registros com meu(a) psicólogo(a)?",
    answer:
      "Sim. No app, você convida profissionais (planos Pleno/Cuidado). Em Clínicas, o consentimento é por propósito e o paciente controla o que liberar. Dá para pausar ou revogar a qualquer momento.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. Você decide o que escrever, o que a IA analisa e o que compartilhar. Tratamos dados sob LGPD. Em urgência emocional, priorize redes de apoio e serviços de emergência.",
  },
];

export function getFaqEntries(locale: Locale): FaqEntry[] {
  return locale === "en" ? faqEntriesEn : faqEntries;
}
