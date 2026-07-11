import type { MarketingDictionary } from "./types";

export const ptBR: MarketingDictionary = {
  nav: {
    about: "Sobre",
    plans: "Planos",
    psychologists: "Psicólogos",
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
      "Oferecer um segundo cérebro emocional: um diário que não só guarda textos, mas conecta significados, devolve reflexões honestas e respeita o limite entre apoio digital e cuidado clínico humano.",
    sentioTitle: "SENTIO AI e MutterCorp",
    sentioBefore: "A",
    sentioBrand: "SENTIO AI",
    sentioAfter:
      "desenvolve reflexões contextualizadas a partir das informações que você opta por registrar — com busca semântica no histórico e guardrails linguísticos. A MutterCorp agrupa esse ecossistema com privacidade (LGPD) e comunicação responsável sobre saúde emocional.",
    whatWeDoTitle: "O que fazemos",
    whatWeDo: [
      "Diário de energia emocional guiado por IA contextual.",
      "Linha do tempo com memória longitudinal e resumos semanais.",
      "Assistente focado em emoções, humor, energia e autocuidado.",
      "Painéis compartilháveis apenas com consentimento do paciente.",
      "Ferramentas de autoconhecimento — não tratamento automatizado.",
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
      "Escolha o nível de acompanhamento que faz sentido agora. Você sempre controla o que registrar, quando pedir insights da SENTIO AI e quem pode ver informações compartilhadas. Limites e preços atualizados aparecem na área autenticada, com checkout seguro.",
    plans: [
      {
        name: "Essencial",
        tagline: "Para começar a se entender.",
        points: [
          "Diário de energia emocional (texto, energia 0–100, humor e tags)",
          "Análise emocional com SENTIO AI por registro",
          "Resumo semanal da jornada emocional",
        ],
      },
      {
        name: "Pleno",
        tagline: "O segundo cérebro no seu bolso.",
        points: [
          "Tudo do Essencial",
          "Assistente emocional com memória semântica do histórico",
          "Tracking de sono, estresse, socialização e burnout",
          "Compartilhamento com um profissional de confiança",
        ],
      },
      {
        name: "Cuidado",
        tagline: "Para psicólogos e acompanhamento clínico.",
        points: [
          "Modo Cuidado com convites controlados pelo paciente",
          "Dashboards em modo leitura entre sessões",
          "Contexto longitudinal para enriquecer a escuta — sem substituí-la",
        ],
      },
    ],
    controlTitle: "Controle, privacidade e IA responsável",
    controlBody:
      "Nenhum plano transforma a EmotiveCare em terapia ou diagnóstico automático. A SENTIO AI descreve padrões a partir do que você registra; o compartilhamento com profissionais só ocorre com o seu consentimento e pode ser revogado.",
    controlFaqBefore: "Dúvidas frequentes estão na",
    controlFaqLink: "FAQ",
    controlFaqMid: ". Profissionais encontram o fluxo de convites em",
    controlPsychLink: "EmotiveCare para psicólogos",
    controlAfter: ".",
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
    title: "EmotiveCare para profissionais",
    introBefore:
      "Entre sessões, o contexto emocional do paciente costuma se perder. Com o",
    introMode: "Modo Cuidado",
    introAfter:
      ", a EmotiveCare oferece dashboards em modo leitura, tendências de energia e resumos estruturados — somente quando o paciente convida você conscientemente.",
    howTitle: "Como funciona na prática",
    howSteps: [
      "O paciente registra emoções e energia no diário.",
      "Ele envia um convite seguro para o profissional.",
      "Você acompanha a evolução em painéis dedicados (somente leitura).",
      "O paciente pode pausar ou revogar o acesso a qualquer momento.",
    ],
    idealTitle: "Ideal para",
    idealItems: [
      "Psicólogos(as) em atendimento continuado;",
      "Profissionais que querem enriquecer a pré-consulta com contexto longitudinal;",
      "Clínicas que precisam de acompanhamento digital moderado, com consentimento explícito.",
    ],
    ethicsTitle: "Limites éticos",
    ethicsBefore:
      "A SENTIO AI sintetiza o que o paciente registrou; a interpretação clínica continua sendo sua. A plataforma não diagnostica, não prescreve e não substitui a escuta. Leia também o artigo",
    ethicsLink: "Como psicólogos usam o dashboard entre sessões",
    ethicsAfter: ".",
    ethicsArticleSlug: "como-profissionais-usam-dashboard-terapeutico",
    ctaRegister: "Começar como profissional",
    ctaPlans: "Ver plano Cuidado",
    ctaFaq: "FAQ",
    flowNavAria: "Fluxo profissional",
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
