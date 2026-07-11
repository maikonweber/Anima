import type { BlogPost } from "./types";

/** Artigos editoriais curtos (legado). */
export const legacyPosts: BlogPost[] = [
  {
    slug: "bem-vindo-a-emotivecare",
    title:
      "Bem-vindo à EmotiveCare: acompanhamento emocional contínuo com SENTIO AI",
    description:
      "Entenda como unir registros diários inteligentes, memória emocional e dashboards terapêuticos em uma única rotina ética.",
    datePublished: "2026-05-01",
    dateModified: "2026-07-10",
    keywords: ["EmotiveCare", "SENTIO AI", "bem-estar", "diário emocional"],
    sections: [
      {
        id: "o-que-e",
        heading: "O que é a EmotiveCare",
        paragraphs: [
          "A EmotiveCare é uma plataforma de cuidado emocional contínuo: você registra o que sente, a SENTIO AI organiza padrões ao longo do tempo e devolve reflexões baseadas na sua própria história — não em respostas genéricas.",
          "O objetivo não é substituir terapia. É oferecer um segundo cérebro emocional entre sessões, no dia a dia, com privacidade e consentimento no centro.",
        ],
      },
      {
        id: "diario",
        heading: "Diário de energia emocional",
        paragraphs: [
          "Cada registro combina texto livre com energia (0–100), humor, ansiedade e tags de emoção. Em poucos segundos você deixa um rastro útil; quanto mais contexto escrever, mais ricas ficam as sínteses.",
          "Ao longo das semanas, a linha do tempo deixa de ser uma lista solta de dias e passa a mostrar tendências: energia média, emoções recorrentes e necessidades que se repetem.",
        ],
      },
      {
        id: "memoria",
        heading: "Memória emocional com SENTIO AI",
        paragraphs: [
          "A SENTIO AI usa busca semântica no seu histórico para conectar o momento atual a registros parecidos — mesmo os de semanas atrás. Assim, o assistente lembra por você e sugere reflexões ancoradas na sua trajetória.",
          "Os insights são descritivos: padrões, energia relatada e sugestões de autocuidado. Não há diagnóstico automático nem promessa de cura.",
        ],
      },
      {
        id: "compartilhamento",
        heading: "Compartilhamento com profissionais",
        paragraphs: [
          "Quando quiser, você pode convidar um(a) psicólogo(a) de confiança para ver dashboards em modo leitura. O acesso é controlado por você e pode ser pausado ou revogado a qualquer momento.",
          "Para detalhes de limites e benefícios por plano, veja a página de [planos](/plans). Para dúvidas éticas e de privacidade, consulte a [FAQ](/faq).",
        ],
      },
    ],
    faq: [
      {
        question: "A EmotiveCare substitui terapia?",
        answer:
          "Não. É apoio ao autoconhecimento e acompanhamento complementar entre sessões. Em sofrimento intenso, busque ajuda profissional e serviços de emergência.",
      },
      {
        question: "Preciso escrever textos longos?",
        answer:
          "Não. Energia, humor e algumas tags já ajudam. Textos mais ricos melhoram as reflexões, mas não são obrigatórios para começar.",
      },
    ],
    cta: {
      heading: "Comece na EmotiveCare",
      body: "Crie sua conta gratuita e experimente o diário de energia emocional com SENTIO AI.",
      links: [
        { href: "/register", label: "Começar grátis" },
        { href: "/plans", label: "Ver planos" },
      ],
    },
    relatedSlugs: [
      "diario-emocional-com-ia-como-comecar",
      "por-que-utilizar-a-emotivecare",
    ],
  },
  {
    slug: "como-profissionais-usam-dashboard-terapeutico",
    title:
      "Como psicólogos usam o dashboard entre sessões (sem substituir a escuta clínica)",
    description:
      "Contexto longitudinal, pré-consulta inteligente e compartilhamento controlado pelo paciente.",
    datePublished: "2026-05-08",
    dateModified: "2026-07-10",
    keywords: [
      "psicologia digital",
      "acompanhamento longitudinal",
      "dashboard terapêutico",
    ],
    sections: [
      {
        id: "intervalo",
        heading: "O problema do intervalo entre sessões",
        paragraphs: [
          "Entre uma consulta e outra, muita informação emocional se perde: o paciente resume a semana em poucos minutos, e o profissional reconstrói o contexto sob pressão de tempo.",
          "Um dashboard longitudinal — alimentado pelo próprio paciente — pode enriquecer a escuta sem transformar a sessão em leitura de gráficos.",
        ],
      },
      {
        id: "modo-cuidado",
        heading: "O que o Modo Cuidado mostra",
        paragraphs: [
          "Com consentimento explícito, o profissional vê tendências de energia, emoções frequentes e resumos estruturados. O acesso é somente leitura: quem decide compartilhar (e até quando) é o paciente.",
          "Isso acelera a pré-consulta e ajuda a identificar padrões que o paciente pode não verbalizar de imediato — sempre como hipótese a ser explorada na relação terapêutica, nunca como laudo automático.",
        ],
      },
      {
        id: "limites",
        heading: "Limites éticos claros",
        paragraphs: [
          "A EmotiveCare não diagnostica, não prescreve e não substitui julgamento clínico. A SENTIO AI sintetiza o que o paciente registrou; a interpretação permanece com o profissional e com a pessoa.",
          "Se você atende e quer conhecer o fluxo de convites, veja a página [para psicólogos](/psychologists) e compare o plano Cuidado em [planos](/plans).",
        ],
      },
    ],
    faq: [
      {
        question: "O paciente pode revogar o acesso?",
        answer:
          "Sim. O compartilhamento é opcional e pode ser pausado ou revogado a qualquer momento pelo paciente.",
      },
      {
        question: "Isso substitui a anamnese?",
        answer:
          "Não. O dashboard complementa a escuta com contexto entre sessões; a condução clínica continua sendo do profissional.",
      },
    ],
    cta: {
      heading: "Modo Cuidado na EmotiveCare",
      body: "Conheça o fluxo de convites e dashboards em modo leitura para profissionais.",
      links: [
        { href: "/psychologists", label: "Para psicólogos" },
        { href: "/plans", label: "Plano Cuidado" },
      ],
    },
    relatedSlugs: [
      "plataforma-completa-para-psicologos",
      "psicologia-e-inovacao",
    ],
  },
  {
    slug: "diario-emocional-com-ia-como-comecar",
    title: "Diário emocional com IA: como começar sem se cobrar demais",
    description:
      "Rotina leve de registro, energia 0–100 e o que a SENTIO AI realmente faz com o que você escreve — sem promessas clínicas.",
    datePublished: "2026-06-12",
    dateModified: "2026-07-10",
    keywords: [
      "diário emocional com IA",
      "autoconhecimento",
      "registro emocional",
    ],
    sections: [
      {
        id: "comece-pequeno",
        heading: "Comece pequeno",
        paragraphs: [
          "Muita gente abandona o diário por achar que precisa escrever páginas. Na EmotiveCare, um registro útil pode ser: energia 45, humor baixo, tag “ansiedade”, e uma frase sobre o gatilho do dia.",
          "A consistência gentil vence a perfeição. Três registros honestos na semana já geram um resumo mais útil do que um texto longo isolado.",
        ],
      },
      {
        id: "o-que-ia-faz",
        heading: "O que a IA faz (e o que não faz)",
        paragraphs: [
          "A SENTIO AI organiza emoções detectadas, necessidades aparentes e conexões com momentos parecidos no seu histórico. Ela devolve reflexões e sugestões de regulação ancoradas na sua trajetória.",
          "Ela não faz diagnóstico, não promete cura e, em sofrimento intenso, orienta a buscar ajuda profissional.",
        ],
      },
      {
        id: "rotina",
        heading: "Uma rotina de 2 minutos",
        paragraphs: [
          "1) Marque energia, humor e ansiedade. 2) Escolha uma ou duas emoções. 3) Escreva uma frase sobre o contexto. 4) Se quiser, peça uma reflexão ao assistente depois.",
          "Quando fizer sentido evoluir, compare os [planos](/plans) Essencial, Pleno e Cuidado.",
        ],
      },
    ],
    faq: [
      {
        question: "Preciso de plano pago para começar?",
        answer:
          "Não. O plano Essencial permite começar o diário e a análise emocional. Recursos avançados dependem do plano escolhido.",
      },
    ],
    cta: {
      heading: "Experimente o diário EmotiveCare",
      body: "Comece grátis e veja como a SENTIO AI devolve reflexões a partir da sua própria história.",
      links: [
        { href: "/register", label: "Começar grátis" },
        { href: "/faq", label: "FAQ" },
      ],
    },
    relatedSlugs: [
      "segundo-cerebro-emocional-memoria-semantica",
      "bem-vindo-a-emotivecare",
    ],
  },
  {
    slug: "burnout-e-ansiedade-acompanhar-energia-sem-autodiagnostico",
    title:
      "Burnout e ansiedade: acompanhar energia sem cair no autodiagnóstico",
    description:
      "Como usar registros de energia, sono e estresse para se observar melhor — com limites claros sobre o que a tecnologia não deve fazer.",
    datePublished: "2026-06-20",
    dateModified: "2026-07-10",
    keywords: ["burnout", "ansiedade", "energia emocional", "autocuidado"],
    sections: [
      {
        id: "observar",
        heading: "Observar não é diagnosticar",
        paragraphs: [
          "Notar que a energia cai toda segunda-feira ou que a ansiedade sobe antes de reuniões é informação útil. Transformar isso em “eu tenho X” sem avaliação profissional é outro caminho — e arriscado.",
          "A EmotiveCare trata burnout, estresse e ansiedade como dimensões que você pode acompanhar ao longo do tempo, não como laudos.",
        ],
      },
      {
        id: "sinais",
        heading: "Sinais que merecem atenção humana",
        paragraphs: [
          "Se o sofrimento é intenso, persistente ou envolve ideação de automutilação, procure serviços de emergência e profissionais de saúde mental.",
          "Entre sessões, o diário e o resumo semanal podem ajudar você (e, com consentimento, seu terapeuta) a ver a semana com mais clareza.",
        ],
      },
      {
        id: "tracking",
        heading: "Tracking leve de bem-estar",
        paragraphs: [
          "Além da energia do momento, planos mais completos permitem acompanhar sono, estresse, socialização e motivação.",
          "Para dúvidas, leia a [FAQ](/faq). Para começar, [crie uma conta](/register).",
        ],
      },
    ],
    faq: [
      {
        question: "A EmotiveCare diagnostica burnout?",
        answer:
          "Não. Não fazemos avaliações clínicas automáticas. Os insights refletem o que você registra e ajudam no autoconhecimento.",
      },
    ],
    relatedSlugs: [
      "diario-emocional-com-ia-como-comecar",
      "tendencias-da-psicologia-em-2026",
    ],
  },
  {
    slug: "segundo-cerebro-emocional-memoria-semantica",
    title: "Segundo cérebro emocional: o que é memória semântica na prática",
    description:
      "Por que organizar emoções por significado (e não só por data) muda a qualidade das reflexões do assistente.",
    datePublished: "2026-07-01",
    dateModified: "2026-07-10",
    keywords: [
      "segundo cérebro emocional",
      "memória semântica",
      "RAG emocional",
    ],
    sections: [
      {
        id: "diario-vs-memoria",
        heading: "Diário comum vs. memória por significado",
        paragraphs: [
          "Um diário tradicional guarda textos por data. Semana que vem, você começa do zero.",
          "O segundo cérebro emocional da EmotiveCare busca no histórico os momentos semanticamente parecidos e traz esse contexto para a conversa.",
        ],
      },
      {
        id: "dia-a-dia",
        heading: "Como isso aparece no dia a dia",
        paragraphs: [
          "Ao conversar com o assistente, ele pode lembrar padrões: gatilhos recorrentes, estratégias que já ajudaram e necessidades que se repetem.",
          "Isso exige guardrails: o foco permanece em emoções, humor, energia, relacionamentos e autocuidado.",
        ],
      },
      {
        id: "privacidade",
        heading: "Privacidade e controle",
        paragraphs: [
          "Seus registros são seus (LGPD). Você decide o que escrever, o que revisar com a IA e o que compartilhar.",
          "Saiba mais na página [Sobre](/about) ou no [blog](/blog).",
        ],
      },
    ],
    faq: [
      {
        question: "A memória semântica lê tudo automaticamente?",
        answer:
          "A busca usa o histórico que você registrou na plataforma. Você controla o que entra nesse histórico.",
      },
    ],
    relatedSlugs: [
      "bem-vindo-a-emotivecare",
      "por-que-utilizar-a-emotivecare",
    ],
  },
];
