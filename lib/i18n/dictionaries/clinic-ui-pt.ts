export const clinicUiPt = {
  common: {
    loading: "Carregando...",
    logout: "Sair",
    language: "Idioma",
    backToApp: "App pessoal",
    organizations: "Organizações",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
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
    audit: {
      title: "Auditoria",
      subtitle: "Trilha de ações da organização",
    },
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
