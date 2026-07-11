export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  /** ISO date — usado no sitemap lastmod quando o artigo é revisado. */
  dateModified?: string;
  keywords?: string[];
  sections: BlogSection[];
  faq?: BlogFaqItem[];
}

/** Conteúdo editorial SEO-ready (expandir com CMS quando houver). */
export const blogPosts: BlogPost[] = [
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
        heading: "O que é a EmotiveCare",
        paragraphs: [
          "A EmotiveCare é uma plataforma de cuidado emocional contínuo: você registra o que sente, a SENTIO AI organiza padrões ao longo do tempo e devolve reflexões baseadas na sua própria história — não em respostas genéricas.",
          "O objetivo não é substituir terapia. É oferecer um segundo cérebro emocional entre sessões, no dia a dia, com privacidade e consentimento no centro.",
        ],
      },
      {
        heading: "Diário de energia emocional",
        paragraphs: [
          "Cada registro combina texto livre com energia (0–100), humor, ansiedade e tags de emoção. Em poucos segundos você deixa um rastro útil; quanto mais contexto escrever, mais ricas ficam as sínteses.",
          "Ao longo das semanas, a linha do tempo deixa de ser uma lista solta de dias e passa a mostrar tendências: energia média, emoções recorrentes e necessidades que se repetem.",
        ],
      },
      {
        heading: "Memória emocional com SENTIO AI",
        paragraphs: [
          "A SENTIO AI usa busca semântica no seu histórico para conectar o momento atual a registros parecidos — mesmo os de semanas atrás. Assim, o assistente lembra por você e sugere reflexões ancoradas na sua trajetória.",
          "Os insights são descritivos: padrões, energia relatada e sugestões de autocuidado. Não há diagnóstico automático nem promessa de cura.",
        ],
      },
      {
        heading: "Compartilhamento com profissionais",
        paragraphs: [
          "Quando quiser, você pode convidar um(a) psicólogo(a) de confiança para ver dashboards em modo leitura. O acesso é controlado por você e pode ser pausado ou revogado a qualquer momento.",
          "Para detalhes de limites e benefícios por plano, veja a página de planos. Para dúvidas éticas e de privacidade, consulte a FAQ.",
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
        heading: "O problema do intervalo entre sessões",
        paragraphs: [
          "Entre uma consulta e outra, muita informação emocional se perde: o paciente resume a semana em poucos minutos, e o profissional reconstrói o contexto sob pressão de tempo.",
          "Um dashboard longitudinal — alimentado pelo próprio paciente — pode enriquecer a escuta sem transformar a sessão em leitura de gráficos.",
        ],
      },
      {
        heading: "O que o Modo Cuidado mostra",
        paragraphs: [
          "Com consentimento explícito, o profissional vê tendências de energia, emoções frequentes e resumos estruturados. O acesso é somente leitura: quem decide compartilhar (e até quando) é o paciente.",
          "Isso acelera a pré-consulta e ajuda a identificar padrões que o paciente pode não verbalizar de imediato — sempre como hipótese a ser explorada na relação terapêutica, nunca como laudo automático.",
        ],
      },
      {
        heading: "Limites éticos claros",
        paragraphs: [
          "A EmotiveCare não diagnostica, não prescreve e não substitui julgamento clínico. A SENTIO AI sintetiza o que o paciente registrou; a interpretação permanece com o profissional e com a pessoa.",
          "Se você atende e quer conhecer o fluxo de convites e planos voltados a clínicas, veja a página para psicólogos e compare o plano Cuidado.",
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
        heading: "Comece pequeno",
        paragraphs: [
          "Muita gente abandona o diário por achar que precisa escrever páginas. Na EmotiveCare, um registro útil pode ser: energia 45, humor baixo, tag “ansiedade”, e uma frase sobre o gatilho do dia.",
          "A consistência gentil vence a perfeição. Três registros honestos na semana já geram um resumo mais útil do que um texto longo isolado.",
        ],
      },
      {
        heading: "O que a IA faz (e o que não faz)",
        paragraphs: [
          "A SENTIO AI organiza emoções detectadas, necessidades aparentes e conexões com momentos parecidos no seu histórico. Ela devolve reflexões e sugestões de regulação ancoradas na sua trajetória.",
          "Ela não faz diagnóstico, não promete cura e, em sofrimento intenso, orienta a buscar ajuda profissional. Use a ferramenta como espelho — não como substituto de cuidado humano.",
        ],
      },
      {
        heading: "Uma rotina de 2 minutos",
        paragraphs: [
          "1) Marque energia, humor e ansiedade. 2) Escolha uma ou duas emoções. 3) Escreva uma frase sobre o contexto. 4) Se quiser, peça uma reflexão ao assistente depois.",
          "Quando fizer sentido evoluir (assistente com memória, tracking de sono/estresse, compartilhamento), compare os planos Essencial, Pleno e Cuidado.",
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
        heading: "Observar não é diagnosticar",
        paragraphs: [
          "Notar que a energia cai toda segunda-feira ou que a ansiedade sobe antes de reuniões é informação útil. Transformar isso em “eu tenho X” sem avaliação profissional é outro caminho — e arriscado.",
          "A EmotiveCare trata burnout, estresse e ansiedade como dimensões que você pode acompanhar ao longo do tempo, não como laudos. Os insights descrevem padrões relatados por você.",
        ],
      },
      {
        heading: "Sinais que merecem atenção humana",
        paragraphs: [
          "Se o sofrimento é intenso, persistente ou envolve ideação de automutilação, procure serviços de emergência e profissionais de saúde mental. A plataforma sugere ajuda profissional nesses contextos e não substitui cuidado clínico.",
          "Entre sessões, o diário e o resumo semanal podem ajudar você (e, com consentimento, seu terapeuta) a ver a semana com mais clareza.",
        ],
      },
      {
        heading: "Tracking leve de bem-estar",
        paragraphs: [
          "Além da energia do momento, planos mais completos permitem acompanhar sono, estresse, socialização e motivação — e ver como cada fator se relaciona com o humor ao longo do tempo.",
          "Para dúvidas frequentes sobre privacidade e limites da IA, leia a FAQ. Para começar a registrar, crie uma conta gratuita.",
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
  },
  {
    slug: "segundo-cerebro-emocional-memoria-semantica",
    title:
      "Segundo cérebro emocional: o que é memória semântica na prática",
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
        heading: "Diário comum vs. memória por significado",
        paragraphs: [
          "Um diário tradicional guarda textos por data. Semana que vem, você começa do zero — o app não liga o que você sente agora ao que sentiu na véspera de uma reunião há três semanas.",
          "O segundo cérebro emocional da EmotiveCare busca no histórico os momentos semanticamente parecidos e traz esse contexto para a conversa e para as reflexões.",
        ],
      },
      {
        heading: "Como isso aparece no dia a dia",
        paragraphs: [
          "Ao conversar com o assistente, ele pode lembrar padrões: gatilhos recorrentes, estratégias que já ajudaram e necessidades que se repetem. A base é o que você optou por registrar.",
          "Isso exige guardrails: o foco permanece em emoções, humor, energia, relacionamentos e autocuidado — não um chatbot genérico sem limites.",
        ],
      },
      {
        heading: "Privacidade e controle",
        paragraphs: [
          "Seus registros são seus (LGPD). Você decide o que escrever, o que revisar com a IA e o que compartilhar com profissionais.",
          "Saiba mais sobre a missão da plataforma na página Sobre, ou explore artigos relacionados no blog.",
        ],
      },
    ],
    faq: [
      {
        question: "A memória semântica lê tudo automaticamente?",
        answer:
          "A busca usa o histórico que você registrou na plataforma, com o objetivo de trazer contexto relevante. Você controla o que entra nesse histórico.",
      },
    ],
  },
  {
    slug: "psicologia-e-inovacao",
    title: "Psicologia e inovação: o que muda no consultório digital",
    description:
      "Como inovação em psicologia combina ética clínica, dados longitudinais e ferramentas digitais sem substituir a escuta — e onde a EmotiveCare se encaixa.",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    keywords: [
      "inovação psicologia",
      "psicologia digital",
      "consultório inovador",
    ],
    sections: [
      {
        heading: "Inovação não é só tecnologia",
        paragraphs: [
          "Na psicologia, inovar significa melhorar a qualidade do cuidado: reduzir atrito entre sessões, dar voz ao paciente no intervalo e organizar informação sem transformar a clínica em dashboard frio.",
          "Ferramentas digitais entram como apoio — registros, tendências e memória emocional — enquanto o julgamento clínico e o vínculo terapêutico permanecem com o profissional.",
        ],
      },
      {
        heading: "Onde a inovação gera valor real",
        paragraphs: [
          "Três frentes costumam render mais: (1) continuidade entre sessões, (2) consentimento claro sobre o que é compartilhado e (3) linguagem responsável — sem diagnóstico automático nem promessas de cura.",
          "Pacientes que registram energia, humor e contexto no dia a dia chegam à sessão com material mais rico. O profissional ganha tempo de escuta, não uma lista de laudos gerados por IA.",
        ],
      },
      {
        heading: "Ética como requisito, não como anexo",
        paragraphs: [
          "Inovação em saúde emocional exige LGPD, controle do paciente sobre o acesso e transparência sobre o que a IA faz. A SENTIO AI descreve padrões a partir do que a pessoa registrou; não substitui avaliação clínica.",
          "Se você busca um caminho prático para inovar no consultório com consentimento e dashboards em modo leitura, conheça a página para psicólogos e o plano Cuidado.",
        ],
      },
    ],
    faq: [
      {
        question: "Inovar com IA compromete a ética clínica?",
        answer:
          "Não, desde que a ferramenta seja complementar, com consentimento explícito, sem diagnóstico automático e com o profissional no centro da interpretação.",
      },
      {
        question: "Por onde começar a inovar no consultório?",
        answer:
          "Pelo fluxo entre sessões: convite controlado pelo paciente, painéis em leitura e rotina leve de registro — sem mudar o método terapêutico de uma vez.",
      },
    ],
  },
  {
    slug: "plataforma-completa-para-psicologos",
    title: "Plataforma completa para psicólogos: o que realmente importa",
    description:
      "Checklist do que uma plataforma para psicólogos precisa ter: consentimento, dashboard longitudinal, privacidade e limites claros da IA — com a EmotiveCare como exemplo.",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    keywords: [
      "plataforma psicólogos",
      "software para psicólogos",
      "dashboard terapêutico",
    ],
    sections: [
      {
        heading: "Completa não significa “faz tudo sozinha”",
        paragraphs: [
          "Uma plataforma completa para psicólogos cobre o intervalo entre sessões: o paciente registra, você acompanha com permissão e a sessão ganha contexto. Ela não deve diagnosticar, prescrever ou substituir a escuta.",
          "O essencial é o trio consentimento + leitura estruturada + privacidade. Sem isso, “completo” vira risco ético e jurídico.",
        ],
      },
      {
        heading: "Funcionalidades que fazem diferença",
        paragraphs: [
          "Convites seguros controlados pelo paciente; dashboards de energia, emoções e resumos semanais; histórico longitudinal; e um assistente com guardrails focado em autocuidado — nunca em laudo clínico automático.",
          "Na EmotiveCare, o Modo Cuidado entrega esse fluxo: o paciente convida, você vê em modo leitura e o acesso pode ser revogado a qualquer momento.",
        ],
      },
      {
        heading: "Como avaliar antes de adotar",
        paragraphs: [
          "Pergunte: quem é dono dos dados? O paciente pode pausar o compartilhamento? A IA deixa claro que não diagnostica? Há planos pensados para o profissional (como o Cuidado)?",
          "Compare benefícios na página de planos e leia o artigo sobre como psicólogos usam o dashboard entre sessões. Depois, teste o fluxo de convite com um paciente que já confia no processo.",
        ],
      },
    ],
    faq: [
      {
        question: "A plataforma substitui prontuário eletrônico?",
        answer:
          "Não necessariamente. A EmotiveCare complementa o acompanhamento emocional entre sessões; o prontuário e a condução clínica continuam sob responsabilidade do profissional.",
      },
      {
        question: "Preciso de muitos pacientes para valer a pena?",
        answer:
          "Não. Mesmo com poucos convites ativos, o ganho está na qualidade do contexto pré-consulta e na continuidade do cuidado.",
      },
    ],
  },
  {
    slug: "como-profissionalizar-seu-consultorio",
    title: "Como profissionalizar seu consultório de psicologia",
    description:
      "Passos práticos para profissionalizar o consultório: processos, comunicação, consentimento digital e acompanhamento entre sessões com ferramentas éticas.",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    keywords: [
      "consultório profissional",
      "profissionalizar consultório",
      "gestão consultório psicologia",
    ],
    sections: [
      {
        heading: "Profissionalizar é criar previsibilidade",
        paragraphs: [
          "Consultório profissional não é só sala bonita: é processo claro de acolhimento, contratos, privacidade, horários e um caminho definido para o que acontece entre uma sessão e outra.",
          "Quando o paciente sabe como registrar emoções, quando pode compartilhar e o que esperar da tecnologia, a relação ganha segurança — e você ganha menos ruído operacional.",
        ],
      },
      {
        heading: "Cinco frentes para organizar agora",
        paragraphs: [
          "1) Comunicação: o que você oferece e o que não oferece (ex.: não é emergência 24h). 2) Consentimento: termos e compartilhamento de dados. 3) Rotina entre sessões: diário leve ou check-ins. 4) Ferramentas com LGPD. 5) Limites da IA explicados em linguagem simples.",
          "Essas frentes elevam a percepção de cuidado sem exigir que você vire gestor de software em tempo integral.",
        ],
      },
      {
        heading: "Digital a serviço da clínica",
        paragraphs: [
          "Use tecnologia para lembrar padrões e preparar a sessão — não para “automatizar terapia”. A EmotiveCare, por exemplo, permite que o paciente registre energia e emoções e, se quiser, compartilhe dashboards com você.",
          "Comece pequeno: um fluxo de convite, um resumo semanal e uma conversa na sessão sobre o que o paciente notou. Ajuste o processo antes de escalar para toda a agenda.",
        ],
      },
    ],
    faq: [
      {
        question: "Preciso de muitos sistemas para profissionalizar?",
        answer:
          "Não. Poucos processos bem documentados e uma ferramenta ética de acompanhamento costumam render mais do que várias apps desconectadas.",
      },
      {
        question: "Como falar de IA com o paciente?",
        answer:
          "Com transparência: explique que a IA organiza o que ele registra, não diagnostica, e que o compartilhamento é opcional e revogável.",
      },
    ],
  },
  {
    slug: "tendencias-da-psicologia-em-2026",
    title: "Tendências da psicologia em 2026",
    description:
      "Tendências da psicologia em 2026: cuidado contínuo, IA responsável, consentimento digital e acompanhamento longitudinal entre sessões.",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    keywords: [
      "tendências psicologia",
      "psicologia 2026",
      "futuro da psicologia",
    ],
    sections: [
      {
        heading: "Cuidado contínuo, não só a hora da sessão",
        paragraphs: [
          "Em 2026, a conversa deixa de ser “app versus terapia” e passa a ser “como apoiar o paciente entre encontros”. Diários emocionais, resumos semanais e memória de padrões entram como extensão do cuidado — com limites claros.",
          "Profissionais que estruturam esse intervalo com consentimento tendem a chegar mais preparados à sessão, sem transformar o setting em monitoramento invasivo.",
        ],
      },
      {
        heading: "IA responsável e linguagem YMYL",
        paragraphs: [
          "A tendência madura é IA descritiva: padrões, energia relatada, sugestões de autocuidado. Fora de moda (e de ética): diagnóstico automático, promessas de cura e chatbots genéricos sem guardrails.",
          "Pacientes e conselhos profissionais cobram transparência. Plataformas que deixam explícito o que não fazem ganham confiança mais rápido.",
        ],
      },
      {
        heading: "Dados sob controle do paciente",
        paragraphs: [
          "LGPD, revogação de acesso e compartilhamento granular deixam de ser “detalhe jurídico” e viram diferencial de marca clínica. O paciente quer saber quem vê o quê — e até quando.",
          "Ferramentas como a EmotiveCare acompanham essa curva: registro no dia a dia, SENTIO AI com limites, e Modo Cuidado só com convite. Veja planos e a FAQ para detalhes práticos.",
        ],
      },
    ],
    faq: [
      {
        question: "IA vai substituir psicólogos em 2026?",
        answer:
          "Não. A tendência é complementaridade: tecnologia organiza contexto; a escuta e o julgamento clínico continuam humanos.",
      },
      {
        question: "Qual tendência priorizar no consultório?",
        answer:
          "Continuidade entre sessões com consentimento — é a que mais melhora a qualidade da conversa sem exigir mudança de abordagem terapêutica.",
      },
    ],
  },
  {
    slug: "por-que-utilizar-a-emotivecare",
    title: "Por que utilizar a EmotiveCare",
    description:
      "Motivos para usar a EmotiveCare: diário de energia emocional, SENTIO AI com memória semântica, privacidade (LGPD) e compartilhamento ético com psicólogos.",
    datePublished: "2026-07-10",
    dateModified: "2026-07-10",
    keywords: [
      "EmotiveCare",
      "por que usar EmotiveCare",
      "diário emocional com IA",
      "SENTIO AI",
    ],
    sections: [
      {
        heading: "Porque um diário comum esquece — e você não deveria",
        paragraphs: [
          "A EmotiveCare foi feita para ser o seu segundo cérebro emocional: você registra o momento; a SENTIO AI conecta padrões ao longo do tempo e devolve reflexões ancoradas na sua história — não respostas genéricas de chatbot.",
          "Energia 0–100, humor, ansiedade e tags de emoção bastam para começar. Textos mais ricos aprofundam as sínteses, mas não são obrigatórios.",
        ],
      },
      {
        heading: "Porque a IA tem limites explícitos",
        paragraphs: [
          "Não fazemos diagnóstico automático, não prometemos cura e não substituímos terapia. Em sofrimento intenso, a plataforma orienta a buscar ajuda profissional. Isso não é marketing fraco — é cuidado responsável.",
          "O assistente foca em emoções, humor, energia, relacionamentos e autocuidado, com guardrails. Seus dados seguem a LGPD: você decide o que escrever, revisar e compartilhar.",
        ],
      },
      {
        heading: "Porque funciona para pessoas e para profissionais",
        paragraphs: [
          "Para quem busca autoconhecimento: diário, resumo semanal e memória semântica. Para psicólogos: Modo Cuidado com convites e dashboards em leitura, controlados pelo paciente.",
          "Comece no plano Essencial, evolua para o Pleno quando quiser o assistente com memória completa, ou explore o Cuidado se você atende. Compare na página de planos ou crie sua conta gratuita.",
        ],
      },
    ],
    faq: [
      {
        question: "A EmotiveCare é grátis para começar?",
        answer:
          "Sim. O plano Essencial permite iniciar o diário e a análise emocional. Recursos avançados dependem do plano escolhido.",
      },
      {
        question: "Posso usar com meu(a) psicólogo(a)?",
        answer:
          "Sim, quando você quiser: convide o profissional para ver dashboards em modo leitura e revogue o acesso quando fizer sentido.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
