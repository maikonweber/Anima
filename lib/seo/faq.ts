/** Perguntas frequentes institucionais (SEO / AI-readable) — fonte única home + /faq. */

export interface FaqEntry {
  question: string;
  answer: string;
}

export const faqEntries: FaqEntry[] = [
  {
    question: "A EmotiveCare é terapia?",
    answer:
      "Não. A EmotiveCare é uma ferramenta de autoconhecimento e apoio emocional. Ela ajuda você a organizar e entender o que sente, mas não faz diagnóstico, não promete cura e não substitui o acompanhamento de psicólogos(as) ou médicos. Em momentos de sofrimento intenso, sugere buscar ajuda profissional.",
  },
  {
    question: "A plataforma faz diagnóstico automático?",
    answer:
      "Não. Os insights são reflexões sobre padrões e energia que você relata — ou que um profissional vê com contexto autorizado. Não há avaliação clínica automática.",
  },
  {
    question: "Como funciona a SENTIO AI?",
    answer:
      "A SENTIO AI é o motor contextual da EmotiveCare. Ela sintetiza padrões, tendências semanais e sugestões de autocuidado a partir dos dados que você opta por registrar — sempre sem prometer diagnóstico automático nem substituir julgamento clínico.",
  },
  {
    question: "O que é o segundo cérebro emocional?",
    answer:
      "É a forma como a EmotiveCare guarda e conecta suas emoções por significado, e não apenas por data. Usando busca semântica (embeddings e memória vetorial), encontra no seu histórico os momentos parecidos com o que você vive agora e os traz para a conversa — como uma memória emocional que lembra e conecta pontos por você.",
  },
  {
    question: "Funciona sem escrever muito?",
    answer:
      "Sim. Você pode registrar apenas a energia, o humor e algumas tags de emoção em poucos segundos. Quanto mais você escreve, mais ricas ficam as reflexões, mas a EmotiveCare não exige textos longos para começar.",
  },
  {
    question: "Posso compartilhar registros com meu(a) psicólogo(a)?",
    answer:
      "Sim. Quando quiser, você convida profissionais de confiança para visualizar dashboards em modo somente leitura, conforme o plano. O paciente pode pausar ou revogar o acesso a qualquer momento.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. Seus registros são seus: você decide o que escrever, o que revisar com a IA e o que compartilhar. Tratamos os dados com cuidado e em conformidade com a LGPD. Use senhas fortes e busque rede de urgência sempre que precisar de suporte imediato.",
  },
];
