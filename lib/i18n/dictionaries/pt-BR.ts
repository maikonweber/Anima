import type { MarketingDictionary } from "./types";

export const ptBR: MarketingDictionary = {
  nav: {
    about: "Sobre",
    plans: "Planos",
    psychologists: "Cuidado",
    clinics: "Clínicas",
    faq: "FAQ",
    blog: "Blog",
    contact: "Contato",
    login: "Entrar",
    menuOpen: "Abrir menu",
    menuClose: "Fechar menu",
    ariaLabel: "Links institucionais",
  },
  footer: {
    privacy: "Privacidade",
    terms: "Termos",
    resources: "Recursos",
    disclaimer:
      "EmotiveCare · MutterCorp · SENTIO AI. Não substitui avaliação clínica especializada.",
  },
  common: {
    home: "Início",
    language: "Idioma",
    startFree: "Começar grátis",
    seePlans: "Ver planos",
  },
  about: {
    title: "Sobre a EmotiveCare",
    introBefore: "A",
    introBrand: "EmotiveCare",
    introMid:
      "existe para ser uma infraestrutura humana-tecnológica onde pessoas registram emoções, entendem padrões ao longo do tempo e mantêm vínculos seguros com profissionais quando desejarem. O produto é desenvolvido pela",
    introCompany: "MutterCorp",
    introDomain: "emotivecare.com.br",
    introAfter: ", com domínio público em",
    missionTitle: "Missão",
    missionBody:
      "Oferecer um segundo cérebro emocional para a pessoa — e, em EmotiveCare Clínicas, uma operação segura para a clínica. Diário com significado, vínculos com consentimento e ferramentas que respeitam o limite entre apoio digital e cuidado clínico humano.",
    sentioTitle: "SENTIO AI e MutterCorp",
    sentioBefore: "A",
    sentioBrand: "SENTIO AI",
    sentioAfter:
      "desenvolve reflexões contextualizadas a partir do que você registra — e, em Clínicas, rascunhos de síntese que o profissional revisa. A MutterCorp mantém privacidade (LGPD) e comunicação responsável sobre saúde emocional.",
    whatWeDoTitle: "O que fazemos",
    whatWeDo: [
      "App EmotiveCare: diário, SENTIO AI, resumos e assistente com memória (Pleno).",
      "Plano Cuidado: dashboards em leitura para profissionais convidados pelo paciente.",
      "EmotiveCare Clínicas: CRM, agenda, teleconsulta, prontuário e consentimentos por organização.",
      "Plano de cuidado, lembretes e sínteses revisáveis na operação clínica.",
      "Ferramentas de apoio — nunca tratamento automatizado nem diagnóstico por IA.",
    ],
    whatWeDontTitle: "O que não fazemos",
    whatWeDontBody:
      "Não substituímos terapia, não emitimos diagnóstico automático e não prometemos cura. Em sofrimento intenso, a plataforma orienta a buscar ajuda profissional e serviços de emergência.",
    linkPlans: "Ver planos",
    linkBlog: "Ler o blog",
    linkRegister: "Criar minha conta",
  },
  plans: {
    title: "Planos EmotiveCare",
    intro:
      "Essencial e Pleno são do app da pessoa. Cuidado é o plano do profissional no app (acompanhamento por convite). A operação da clínica — CRM, agenda, teleconsulta — fica em EmotiveCare Clínicas, produto separado. Você controla o que registrar, o que a SENTIO AI analisa e o que compartilhar.",
    plans: [
      {
        name: "Essencial",
        tagline: "Para começar a se entender.",
        points: [
          "Diário de energia emocional (texto, energia 0–100, humor e tags)",
          "Análise com SENTIO AI por registro",
          "Resumo semanal da jornada emocional",
        ],
      },
      {
        name: "Pleno",
        tagline: "R$ 9,99/mês — o segundo cérebro no seu bolso.",
        points: [
          "Tudo do Essencial, sem teto mensal de registros",
          "Assistente com memória semântica do seu histórico",
          "Tracking de sono, estresse, socialização e burnout",
          "Compartilhar dashboard com 1 profissional de confiança",
        ],
      },
      {
        name: "Cuidado",
        tagline: "Para quem acompanha entre sessões.",
        points: [
          "Até 99 dashboards de pacientes que autorizam o acesso",
          "Contexto emocional em leitura entre consultas",
          "Pacientes vinculados herdam benefícios equivalentes ao Pleno",
        ],
      },
    ],
    controlTitle: "Controle, privacidade e dois produtos",
    controlBody:
      "Nenhum plano transforma a EmotiveCare em terapia ou diagnóstico automático. O app (Essencial/Pleno/Cuidado) e EmotiveCare Clínicas são superfícies diferentes: um cuida da jornada da pessoa; o outro opera a clínica com papéis, auditoria e consentimento por propósito.",
    controlFaqBefore: "Dúvidas na",
    controlFaqLink: "FAQ",
    controlFaqMid: ". Acompanhamento por convite em",
    controlPsychLink: "plano Cuidado",
    controlAfter: "; operação da clínica em EmotiveCare Clínicas.",
    ctaRegister: "Começar agora",
    ctaLogin: "Já sou usuário · Entrar",
    ctaBlog: "Ler o blog",
    accountNavAria: "Ações de conta",
  },
  faq: {
    title: "Perguntas frequentes",
  },
  contact: {
    title: "Contato",
    intro:
      "Você já pode iniciar usando o formulário dentro do próprio aplicativo após criar conta. Para parcerias, imprensa e privacidade, utilize os endereços oficiais configurados pela MutterCorp.",
    companyLabel: "Empresa titular",
    companyValue: "MutterCorp — infraestrutura EmotiveCare & SENTIO AI.",
    securityLabel: "Suporte segurança",
    securityBefore: "Veja arquivo público",
    securityPath: "/.well-known/security.txt",
    addressNote:
      "Esta página apenas consolida contatos institucionais; não há coleta nesta rota.",
  },
  privacy: {
    title: "Privacidade",
    intro:
      "A EmotiveCare centraliza registros delicados sobre emoções, energia relatada, marcações médicas cotidianas (como hábitos) e texto livre opcionalmente compartilhado com prestadores quando autorizado pelo paciente.",
    controlTitle: "Dados sob seu controle",
    controlBody:
      "Você decide o nível de detalhes, etiquetas ou metadados. Profissionais convidados enxergam apenas o combinado através de convites e podem ver acesso pausado ou revogado imediatamente.",
    sentioTitle: "SENTIO AI",
    sentioBody:
      "Os insights automatizados partem apenas do que você já escolheu alimentar sistemicamente dentro do app — sem diagnóstico prometendo cura automatizada, apenas reflexões contextualizadas.",
    legalNote:
      "Documentação contratual detalhada pode ser atualizada assim que o time jurídico publicar políticas versionadas.",
  },
  psychologists: {
    title: "Plano Cuidado — entre sessões",
    introBefore:
      "Entre uma consulta e outra, o contexto emocional do paciente some. Com o",
    introMode: "plano Cuidado",
    introAfter:
      ", o profissional acompanha dashboards em leitura — só quando o paciente convida. Não é o prontuário da clínica: isso fica em EmotiveCare Clínicas.",
    howTitle: "Como funciona na prática",
    howSteps: [
      "O paciente registra emoções e energia no app EmotiveCare.",
      "Com Pleno (ou benefício herdado), ele envia um convite seguro.",
      "Você, no plano Cuidado, vê evolução e tendências em leitura.",
      "O paciente pausa ou revoga o acesso quando quiser.",
    ],
    idealTitle: "Ideal para",
    idealItems: [
      "Psicólogos(as) em atendimento continuado;",
      "Profissionais que querem enriquecer a pré-consulta com contexto longitudinal;",
      "Quem precisa de acompanhamento digital leve, sem operar CRM ou agenda da clínica.",
    ],
    ethicsTitle: "Limites éticos",
    ethicsBefore:
      "A SENTIO AI sintetiza o que o paciente registrou; a interpretação clínica continua sendo sua. A plataforma não diagnostica, não prescreve e não substitui a escuta. Para CRM, agenda e teleconsulta use EmotiveCare Clínicas. Leia também",
    ethicsLink: "Como psicólogos usam o dashboard entre sessões",
    ethicsAfter: ".",
    ethicsArticleSlug: "como-profissionais-usam-dashboard-terapeutico",
    ctaRegister: "Começar como profissional",
    ctaPlans: "Ver plano Cuidado",
    ctaFaq: "FAQ",
    ctaClinics: "Conhecer Clínicas",
    flowNavAria: "Fluxo profissional Cuidado",
  },
  clinics: {
    eyebrow: "Produto para profissionais de saúde",
    title: "EmotiveCare Clínicas",
    intro:
      "A suíte operacional da clínica: pacientes do tenant, agenda, teleconsulta, prontuário e consentimentos — separada do diário pessoal do app EmotiveCare.",
    splitTitle: "Clínicas ≠ Cuidado ≠ Pleno",
    splitBody:
      "Pleno é a jornada completa da pessoa no app. Cuidado é o plano do profissional para dashboards por convite. Clínicas é multi-tenant: CRM, papéis, auditoria e fluxos clínicos da organização.",
    modulesTitle: "O que já está no produto",
    modules: [
      {
        title: "CRM de pacientes",
        text: "Cadastro, funil (lead → ativo → alta), contatos e histórico de status por organização.",
      },
      {
        title: "Agenda e disponibilidade",
        text: "Sessões, confirmação, remarcação e grade semanal do profissional.",
      },
      {
        title: "Teleconsulta",
        text: "Sala autenticada com join por código — alinhada à sessão agendada.",
      },
      {
        title: "Prontuário e sínteses",
        text: "Notas clínicas com assinatura/adendo e sínteses SENTIO AI revisáveis antes de entrar no prontuário.",
      },
      {
        title: "Consentimentos e diário",
        text: "Consentimento por propósito; diário do app só entra na clínica com autorização — inclusive por registro.",
      },
      {
        title: "Plano de cuidado e lembretes",
        text: "Itens liberados ao paciente, próximas sessões e lembretes de medicação/atividade in-app.",
      },
    ],
    forWhomTitle: "Para quem",
    forWhom: [
      "Clínicas e consultórios multi-profissional",
      "Psicólogos(as) que precisam de operação além do dashboard entre sessões",
      "Equipes com secretaria, admin e DPO em papéis distintos",
    ],
    ethicsTitle: "Ética e responsabilidade",
    ethicsBody:
      "Clínicas organiza o trabalho clínico; não substitui julgamento profissional. Sínteses de IA exigem revisão humana. Consentimento e auditoria acompanham o acesso a dados sensíveis.",
    ctaOpen: "Abrir Clínicas",
    ctaPlans: "Ver planos do app",
    ctaPsych: "Plano Cuidado",
  },
  resources: {
    title: "Recursos",
    intro:
      "Materiais para autoconhecimento emocional e uso responsável de IA. A EmotiveCare é apoio complementar — em crise, priorize redes de urgência e profissionais de saúde mental.",
    articlesTitle: "Artigos EmotiveCare",
    seeAllArticles: "Ver todos os artigos →",
    externalTitle: "Apoio externo",
    external: [
      {
        name: "CVV — Centro de Valorização da Vida",
        href: "https://www.cvv.org.br/",
        note: "Apoio emocional gratuito 24h (ligue 188).",
      },
      {
        name: "Ministério da Saúde — saúde mental",
        href: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental",
        note: "Informações oficiais e rede de atenção.",
      },
    ],
    linkFaq: "FAQ institucional",
    linkPsychologists: "Para psicólogos",
    linkPlans: "Planos",
    exploreNavAria: "Explore conteúdo",
  },
  terms: {
    title: "Termos da ferramenta",
    intro:
      "Termos de Uso, Compromisso e Responsabilidade da EmotiveCare. Ao usar a plataforma, você concorda com as condições abaixo.",
  },
  auth: {
    loginTitle: "Bem-vindo de volta",
    loginSubtitle:
      "Sua porta de entrada para uma plataforma de cuidado emocional contínuo",
    registerTitle: "Criar sua conta",
    registerSubtitle:
      "Comece sua jornada na EmotiveCare, seu segundo cérebro emocional — simples e acolhedor",
    email: "Email",
    password: "Senha",
    confirmPassword: "Confirmar senha",
    name: "Nome",
    namePlaceholder: "Como podemos te chamar?",
    passwordPlaceholder: "Sua senha",
    passwordMinPlaceholder: "Mínimo 6 caracteres",
    confirmPasswordPlaceholder: "Repita sua senha",
    forgotPassword: "Esqueceu a senha?",
    submitLogin: "Entrar",
    submitRegister: "Criar conta",
    or: "ou",
    noAccount: "Ainda não tem conta?",
    createAccount: "Criar conta",
    hasAccount: "Já tem conta?",
    goLogin: "Entrar",
    forgotTitle: "Esqueci minha senha",
    forgotSubtitle: "Enviaremos um link para redefinir sua senha",
    resetTitle: "Nova senha",
    resetSubtitle: "Escolha uma senha segura para sua conta",
    newPassword: "Nova senha",
    loading: "Carregando...",
  },
  blog: {
    tocLabel: "Sumário do artigo",
    inThisArticle: "Neste artigo",
    faq: "Perguntas frequentes",
    conclusion: "Conclusão",
    keepReading: "Continue lendo",
    backToArticles: "Voltar aos artigos",
    crisisNote:
      "Se você enfrenta sofrimento persistente ou ideação de automutilação, procure imediatamente serviços de emergência e profissionais de saúde mental próximos a você.",
    languageLabel: "Idioma",
    indexTitle: "Blog EmotiveCare",
    indexIntro:
      "Materiais atualizados com foco em respostas diretas sobre autoconhecimento, burnout, ansiedade leve relatada pelo usuário e integração paciente-profissional.",
    notFoundTitle: "Artigo não encontrado",
  },
};
