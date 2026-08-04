import type { Locale } from "@/lib/i18n/config";
import { faqEntriesEn } from "./faq-en";

/** FAQ institucional — SEO + GEO (respostas claras para buscadores e LLMs). */

export interface FaqEntry {
  question: string;
  answer: string;
}

export const faqEntries: FaqEntry[] = [
  {
    question: "O que é a EmotiveCare?",
    answer:
      "A EmotiveCare é uma plataforma da MutterCorp com dois mundos: (1) app pessoal de segundo cérebro emocional com diário e SENTIO AI; (2) EmotiveCare Clínicas, produto B2B para psicólogos e psiquiatras com CRM, agenda, teleconsulta, prontuário e IA clínica revisável. Não é terapia e não substitui avaliação ou tratamento.",
  },
  {
    question: "Como a EmotiveCare funciona como segundo cérebro emocional?",
    answer:
      "No uso pessoal (planos Essencial e Pleno), você registra emoções e energia; a SENTIO AI reflete padrões; a memória semântica conecta momentos parecidos no histórico — por significado, não só por data. O Pleno (R$ 9,99/mês) amplia tracking, assistente (até 500 interações/mês) e o direito de compartilhar o dashboard com 1 profissional.",
  },
  {
    question: "A EmotiveCare é terapia?",
    answer:
      "Não. É autoconhecimento e apoio emocional digital. Não diagnostica, não promete cura e não substitui psicólogo(a), psiquiatra ou médico. Em sofrimento intenso, oriente-se a ajuda profissional e serviços de emergência.",
  },
  {
    question: "Qual a diferença entre Pleno, Cuidado e EmotiveCare Clínicas?",
    answer:
      "Pleno é o plano completo do app para a pessoa (segundo cérebro, tracking, 1 profissional). Cuidado é o plano do profissional no app: dashboards em leitura dos pacientes que o convidam — sem CRM/agenda. EmotiveCare Clínicas é outro produto: operação da clínica (CRM, agenda, teleconsulta, prontuário, consentimentos e sínteses de IA com revisão humana).",
  },
  {
    question: "O que psicólogos e psiquiatras encontram em EmotiveCare Clínicas?",
    answer:
      "Funcionalidades clínicas: CRM de pacientes, agenda e disponibilidade, teleconsulta com consentimento, notas/prontuário, consentimentos por finalidade (LGPD), lembretes, plano de cuidado, alertas com revisão humana, base de conhecimento curada e sínteses SENTIO AI que o profissional revisa antes de integrar ao prontuário. Multi-tenant com papéis e auditoria.",
  },
  {
    question: "A SENTIO AI substitui o julgamento clínico?",
    answer:
      "Não. No app pessoal, a IA sugere reflexões e autocuidado sem diagnóstico automático. Em Clínicas, gera rascunhos de síntese que exigem revisão humana. Psicólogos e psiquiatras mantêm a interpretação e a responsabilidade clínica.",
  },
  {
    question: "Psicólogos e psiquiatras podem usar o plano Cuidado?",
    answer:
      "Sim. O plano Cuidado é para profissionais no app EmotiveCare: acompanhar dashboards em leitura quando o paciente convida. Serve a psicólogos, psiquiatras e outros acompanhantes autorizados. Para operar a clínica (CRM, agenda, teleconsulta), use EmotiveCare Clínicas.",
  },
  {
    question: "Posso compartilhar registros com meu psicólogo ou psiquiatra?",
    answer:
      "Sim. No app, via planos Pleno/Cuidado com convite e pausa/revogação. Em Clínicas, o consentimento é por propósito (ex.: TELECONSULTA, PRONTUARIO, DIARIO_CHECKIN) e o paciente controla o que liberar.",
  },
  {
    question: "Meus dados estão seguros (LGPD)?",
    answer:
      "Sim. Você decide o que registrar, o que a IA analisa e o que compartilhar. Em Clínicas há consentimento granular, papéis e auditoria. Tratamos dados sob LGPD.",
  },
];

export function getFaqEntries(locale: Locale): FaqEntry[] {
  return locale === "en" ? faqEntriesEn : faqEntries;
}
