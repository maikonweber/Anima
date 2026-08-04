export const productPt = {
  common: {
    loading: "Carregando...",
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    back: "Voltar",
    search: "Buscar",
    empty: "Nada por aqui ainda.",
    error: "Algo deu errado. Tente novamente.",
    logout: "Sair",
    language: "Idioma",
    upgrade: "Fazer upgrade",
    plan: "Plano",
  },
  nav: {
    home: "Início",
    newEntry: "Novo registro",
    newEntryShort: "Registrar",
    timeline: "Linha do tempo",
    timelineShort: "Linha",
    insights: "Insights",
    achievements: "Conquistas",
    assistant: "Assistente emocional",
    assistantShort: "Assistente",
    carePatients: "Acompanhamentos",
    clinics: "Clínicas",
    invitePro: "Vincular conta",
    consents: "Consentimentos",
    reminders: "Lembretes",
    carePlan: "Plano de cuidado",
    crisis: "Apoio / crise",
    support: "Suporte",
    profile: "Perfil",
  },
  pages: {
    dashboardTitle: "Início",
    dashboardSubtitle: "Seu panorama emocional desta semana",
    dashboardNewMoment: "+ Novo momento",
    dashboardWeekError: "Não foi possível carregar o resumo semanal.",
    dashboardEmpty:
      "Você ainda não registrou momentos esta semana. Como está se sentindo hoje?",
    dashboardFirstMoment: "Registrar primeiro momento",
    dashboardSeeTimeline: "Ver linha do tempo completa →",
    greetings: {
      morning: "Bom dia",
      afternoon: "Boa tarde",
      evening: "Boa noite",
    },
    insightsTitle: "Insights",
    achievementsTitle: "Conquistas",
    profileTitle: "Perfil",
    careTitle: "Convidar profissional",
    consentsTitle: "Consentimentos",
    remindersTitle: "Lembretes",
    carePlanTitle: "Plano de cuidado",
    crisisTitle: "Apoio e crise",
    diaryTitle: "Linha do tempo",
    diaryNewTitle: "Novo registro",
    assistantTitle: "Assistente emocional",
    supportTitle: "Suporte",
    subscriptionTitle: "Assinatura",
    carePatientsTitle: "Acompanhamentos",
  },
} as const;

type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepStringify<U>[]
    : T extends object
      ? { -readonly [K in keyof T]: DeepStringify<T[K]> }
      : T;

export type ProductDictionary = DeepStringify<typeof productPt>;
