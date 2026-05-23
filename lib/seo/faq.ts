/** Perguntas frequentes institucionais (SEO / AI-readable). */

export interface FaqEntry {
  question: string;
  answer: string;
}

export const faqEntries: FaqEntry[] = [
  {
    question: "O EmotiveCare substitui terapia?",
    answer:
      "Não. A EmotiveCare oferece apoio ao autoconhecimento, organização das emoções e acompanhamento complementar entre sessões. Ela não substitui avaliação, diagnóstico nem tratamento com psicólogos(as) ou médicos.",
  },
  {
    question: "Posso compartilhar registros emocionais com meu(a) psicólogo(a)?",
    answer:
      "Sim, quando você quiser pode convidar profissionais de confiança para visualizar dashboards em modo somente leitura, conforme permissões dos planos. O paciente pode pausar ou revogar o acesso a qualquer momento.",
  },
  {
    question: "Como funciona a SENTIO AI?",
    answer:
      "A SENTIO AI é o motor contextual da EmotiveCare. Ela sintetiza padrões, tendências semanais e sugestões de autocuidado a partir dos dados que você opta registrar — sempre sem prometer diagnóstico automático nem substituir julgamento clínico.",
  },
  {
    question: "A plataforma faz diagnóstico automático?",
    answer:
      "Não fazemos avaliações clínicas automáticas. Os insights tratam-se de reflexões sobre padrões e energia relatados por você ou por profissionais com contexto autorizado.",
  },
  {
    question: "Minhas informações ficam sob meu controle?",
    answer:
      "Sim. Você decide o que escrever, o que revisar em IA e quando compartilhar com outros. Use senhas fortes em dispositivos pessoais e busque rede de urgência sempre que precisar de suporte imediato.",
  },
];
