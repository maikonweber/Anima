export const clinicUiPt = {
  common: {
    loading: "Carregando...",
    logout: "Sair",
    language: "Idioma",
    backToApp: "App pessoal",
    organizations: "Organizações",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    moreMenu: "Mais",
  },
  brand: {
    product: "EmotiveCare",
    clinics: "Clínicas",
  },
  clinicHome: {
    eyebrow: "Área profissional",
    description:
      "CRM, agenda e equipe por organização — separado do app do paciente.",
    newClinicButton: "Nova clínica",
    cancelButton: "Cancelar",
    newOrgTitle: "Nova organização",
    newOrgSubtitle:
      "Você será o administrador e poderá convidar a equipe depois.",
    clinicNameLabel: "Nome da clínica",
    clinicNamePlaceholder: "Ex.: Clínica Aurora",
    createButton: "Criar e abrir CRM",
    errorNameRequired: "Informe o nome da clínica.",
    errorCreateFailed: "Não foi possível criar a clínica.",
    loadError: "Não foi possível carregar suas clínicas.",
    emptyTitle: "Nenhuma clínica ainda",
    emptyDescription:
      "Crie uma organização para cadastrar pacientes, convidar a equipe e operar o CRM clínico.",
    emptyButton: "Criar clínica",
    yourOrganizations: "Suas organizações",
    clinicCountSingular: "clínica",
    clinicCountPlural: "clínicas",
    openButton: "Abrir",
  },
  nav: {
    overview: "Visão geral",
    overviewShort: "Início",
    patients: "Pacientes",
    patientsShort: "CRM",
    agenda: "Agenda",
    availability: "Disponibilidade",
    availabilityShort: "Horários",
    knowledge: "Conhecimento",
    knowledgeShort: "RAG",
    alerts: "Alertas",
    crisis: "Recursos de crise",
    crisisShort: "Crise",
    whatsapp: "WhatsApp",
    whatsappShort: "WA",
    audit: "Auditoria",
    auditShort: "Logs",
  },
  patientTabs: {
    summary: "Resumo",
    diary: "Diário",
    notes: "Prontuário",
    consents: "Consentimentos",
    reminders: "Lembretes",
    carePlan: "Plano",
    syntheses: "Sínteses IA",
    alerts: "Alertas",
    appLink: "Vínculo app",
  },
  pages: {
    overview: "Visão geral",
    patients: "Pacientes",
    agenda: "Agenda",
    alerts: "Alertas pendentes",
    crisis: "Recursos de crise",
    knowledge: "Conhecimento clínico",
    whatsapp: "WhatsApp da clínica",
    audit: "Auditoria",
  },
  roles: {
    professional: "Profissional",
    secretary: "Secretaria",
    admin: "Administrador",
    dpo: "DPO",
    patient: "Paciente",
  },
  quickActions: {
    patients: {
      title: "CRM de pacientes",
      subtitle: "Cadastro, funil e contatos",
    },
    agenda: {
      title: "Agenda",
      subtitle: "Sessões, confirmação e disponibilidade",
    },
    alerts: {
      title: "Alertas pendentes",
      subtitle: "Revisão humana (RF-072)",
    },
    knowledge: {
      title: "Conhecimento clínico",
      subtitle: "Base curada para sínteses",
    },
    crisis: {
      title: "Recursos de crise",
      subtitle: "Canais de apoio (RF-042)",
    },
    whatsapp: {
      title: "WhatsApp",
      subtitle: "Conexão, inbox e chat com IA",
    },
    audit: {
      title: "Auditoria",
      subtitle: "Trilha de ações da organização",
    },
  },
  whatsappPage: {
    description:
      "Conecte o número da clínica, cadastre pacientes pelo WhatsApp, envie alertas aprovados e use o chat com IA.",
    connection: "Conexão",
    connect: "Conectar WhatsApp",
    connected: "Conectado",
    disconnect: "Desconectar",
    scanQr: "Escaneie o QR no WhatsApp do celular da clínica.",
    inbox: "Conversas",
    emptyInbox: "Nenhuma conversa ainda. Quando um paciente mandar mensagem, aparece aqui.",
    selectConversation: "Selecione uma conversa para ler e responder.",
    backToInbox: "Voltar às conversas",
    replyPlaceholder: "Escreva uma resposta…",
    send: "Enviar",
    handoff: "Humano",
    enableAi: "Ligar IA",
    disableAi: "Desligar IA",
    statusLabel: "Status",
    unnamedPatient: "Paciente",
  },
  knowledgePage: {
    description:
      "Biblioteca curada da clínica — só artigos publicados entram nas sínteses da SENTIO AI.",
    purposeTitle: "Para que serve",
    purposeBody:
      "Em vez de a IA buscar a internet aberta, ela consulta esta base curada. Assim as sínteses ficam alinhadas à linha de cuidado da sua clínica: materiais educativos, critérios de encaminhamento, textos de acolhimento e orientações internas. Não é protocolo diagnóstico nem substitui o julgamento clínico.",
    workflowTitle: "Como usar (passo a passo)",
    workflowSteps: [
      "Escreva um artigo com título claro e conteúdo objetivo.",
      "Salve como rascunho, revise com a equipe e só então publique.",
      "Artigos publicados podem ser usados nas sínteses IA do paciente.",
      "Quando ficar desatualizado, arquive — a IA para de usá-lo sem apagar o histórico.",
    ],
    examplesTitle: "Exemplos do dia a dia profissional",
    examples: [
      {
        title: "Antes da sessão",
        body: "Publique um texto curto de psicoeducação sobre ansiedade (sinais, o que conversar em sessão, quando encaminhar). Ao gerar uma síntese IA, o modelo pode ancorar sugestões nesse material da clínica.",
      },
      {
        title: "Acolhimento e crise",
        body: "Cadastre o roteiro interno de acolhimento (CVV, SAMU, critérios da clínica). A equipe e a IA passam a falar a mesma linguagem — sem inventar canais ou passos.",
      },
      {
        title: "Padronizar a equipe",
        body: "Documente o fluxo de triagem ou o critério de alta do funil CRM. Novos profissionais encontram a regra aqui; a IA usa o mesmo contexto nas sínteses.",
      },
      {
        title: "Revisão periódica",
        body: "Uma vez por mês, revise artigos publicados: atualize o que mudou e arquive o obsoleto. Assim a base continua confiável.",
      },
    ],
    disclaimer:
      "Conteúdo educativo e de governança — não é prontuário. Evite dados identificáveis de pacientes. O catálogo da plataforma é somente leitura; a clínica publica os próprios artigos.",
    formTitle: "Novo artigo da clínica",
    titlePlaceholder: "Título",
    categoryPlaceholder: "Categoria (opcional) — ex.: crise, psicoeducação",
    bodyPlaceholder:
      "Conteúdo curado — o que a equipe e a IA devem lembrar (sem dados de pacientes)",
    saveDraft: "Salvar rascunho",
    publish: "Publicar",
    archive: "Arquivar",
    delete: "Excluir",
    scopePlatform: "Plataforma",
    scopeClinic: "Clínica",
    statusDraft: "Rascunho",
    statusPublished: "Publicado",
    statusArchived: "Arquivado",
    errorRequired: "Informe título e conteúdo.",
    errorCreate: "Falha ao criar artigo.",
    errorLoad: "Falha ao carregar artigos.",
    noPermission: "Sem permissão para gerenciar a base curada.",
  },
} as const;

type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepStringify<U>[]
    : T extends object
      ? { -readonly [K in keyof T]: DeepStringify<T[K]> }
      : T;

export type ClinicUiDictionary = DeepStringify<typeof clinicUiPt>;
