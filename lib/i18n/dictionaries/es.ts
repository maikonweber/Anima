import type { MarketingDictionary } from "./types";

export const es: MarketingDictionary = {
  nav: {
    about: "Acerca de",
    plans: "Planes",
    psychologists: "Cuidado",
    clinics: "Clínicas",
    clinicApp: "Abrir Clínicas",
    faq: "FAQ",
    blog: "Blog",
    contact: "Contacto",
    login: "Entrar",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    ariaLabel: "Enlaces institucionales",
  },
  footer: {
    privacy: "Privacidad",
    terms: "Términos",
    resources: "Recursos",
    disclaimer:
      "EmotiveCare · MutterCorp · SENTIO AI. No sustituye una evaluación clínica especializada.",
  },
  common: {
    home: "Inicio",
    language: "Idioma",
    startFree: "Empezar gratis",
    seePlans: "Ver planes",
  },
  about: {
    title: "Acerca de EmotiveCare",
    introBefore: "",
    introBrand: "EmotiveCare",
    introMid:
      "existe para ser una infraestructura humano-tecnológica donde las personas registran emociones, entienden patrones a lo largo del tiempo y mantienen vínculos seguros con profesionales cuando lo desean. El producto lo desarrolla",
    introCompany: "MutterCorp",
    introDomain: "emotivecare.com.br",
    introAfter: ", con presencia pública en",
    missionTitle: "Misión",
    missionBody:
      "Ofrecer un segundo cerebro emocional para la persona — y, en EmotiveCare Clínicas, una operación segura para la práctica. Un diario con sentido, vínculos con consentimiento y herramientas que respetan el límite entre el apoyo digital y el cuidado clínico humano.",
    sentioTitle: "SENTIO AI y MutterCorp",
    sentioBefore: "",
    sentioBrand: "SENTIO AI",
    sentioAfter:
      "construye reflexiones contextuales a partir de lo que registras — y, en Clínicas, borradores de síntesis que el profesional revisa. MutterCorp sostiene la privacidad (LGPD) y una comunicación responsable sobre la salud emocional.",
    whatWeDoTitle: "Qué hacemos",
    whatWeDo: [
      "App EmotiveCare: diario, SENTIO AI, resúmenes y asistente con memoria (Pleno).",
      "Plan Cuidado: paneles de solo lectura para profesionales invitados por el paciente.",
      "EmotiveCare Clínicas: CRM, agenda, teleconsulta, notas y consentimientos por organización.",
      "Planes de cuidado, recordatorios y síntesis revisadas por humanos en la operación de la clínica.",
      "Herramientas de apoyo — nunca tratamiento automatizado ni diagnóstico por IA.",
    ],
    whatWeDontTitle: "Qué no hacemos",
    whatWeDontBody:
      "No sustituimos la terapia, no emitimos diagnósticos automáticos y no prometemos una cura. En un sufrimiento intenso, la plataforma te orienta a buscar ayuda profesional y servicios de emergencia.",
    linkPlans: "Ver planes",
    linkBlog: "Leer el blog",
    linkRegister: "Crear mi cuenta",
  },
  plans: {
    title: "Planes EmotiveCare",
    intro:
      "Essencial y Pleno son para la persona en la app. Cuidado es el plan profesional en la app (seguimiento por invitación). La operación de la clínica — CRM, agenda, teleconsulta — vive en EmotiveCare Clínicas, un producto aparte. Tú controlas qué registrar, qué analiza SENTIO AI y qué compartir.",
    plans: [
      {
        name: "Essencial",
        tagline: "Para empezar a entenderte.",
        points: [
          "Diario de energía emocional (texto, energía 0–100, estado de ánimo y etiquetas)",
          "Análisis con SENTIO AI por registro",
          "Resumen semanal de tu recorrido emocional",
        ],
      },
      {
        name: "Pleno",
        tagline: "R$ 9.99/mes — un segundo cerebro en el bolsillo.",
        points: [
          "Todo de Essencial, sin tope mensual de diario e IA",
          "Hasta 500 interacciones del asistente al mes",
          "Seguimiento de sueño, estrés, socialización y burnout",
          "Compartir panel con 1 profesional de confianza",
        ],
      },
      {
        name: "Cuidado",
        tagline: "Para quienes acompañan entre sesiones.",
        points: [
          "Paneles ilimitados de pacientes autorizados por el paciente",
          "Contexto emocional en solo lectura entre citas",
          "Los pacientes vinculados heredan beneficios equivalentes a Pleno",
        ],
      },
    ],
    controlTitle: "Control, privacidad y dos productos",
    controlBody:
      "Ningún plan convierte EmotiveCare en terapia o diagnóstico automático. La app (Essencial/Pleno/Cuidado) y EmotiveCare Clínicas son superficies distintas: una apoya el recorrido de la persona; la otra opera la clínica con roles, auditoría y consentimiento por propósito.",
    controlFaqBefore: "Las preguntas están en el",
    controlFaqLink: "FAQ",
    controlFaqMid: ". Seguimiento por invitación en el",
    controlPsychLink: "plan Cuidado",
    controlAfter: "; operación de la clínica en EmotiveCare Clínicas.",
    ctaRegister: "Empezar",
    ctaLogin: "Ya soy usuario · Entrar",
    ctaBlog: "Leer el blog",
    accountNavAria: "Acciones de cuenta",
  },
  faq: {
    title: "Preguntas frecuentes",
  },
  contact: {
    title: "Contacto",
    intro:
      "Ya puedes empezar usando el formulario dentro de la app después de crear una cuenta. Para alianzas, prensa y privacidad, usa las direcciones oficiales configuradas por MutterCorp.",
    companyLabel: "Empresa operadora",
    companyValue: "MutterCorp — infraestructura EmotiveCare & SENTIO AI.",
    securityLabel: "Soporte de seguridad",
    securityBefore: "Consulta el archivo público",
    securityPath: "/.well-known/security.txt",
    addressNote:
      "Esta página solo consolida contactos institucionales; no hay recolección de datos en esta ruta.",
  },
  privacy: {
    title: "Privacidad",
    intro:
      "EmotiveCare centraliza registros sensibles sobre emociones, energía reportada, marcadores cotidianos de salud (como hábitos) y texto libre opcionalmente compartido con prestadores cuando el paciente lo autoriza.",
    controlTitle: "Datos bajo tu control",
    controlBody:
      "Tú decides el nivel de detalle, etiquetas o metadatos. Los profesionales invitados ven solo lo acordado mediante invitaciones, y el acceso se puede pausar o revocar de inmediato.",
    sentioTitle: "SENTIO AI",
    sentioBody:
      "Los insights automatizados parten solo de lo que ya elegiste alimentar en la app — sin diagnóstico que prometa una cura automática, solo reflexiones contextuales.",
    legalNote:
      "La documentación contractual detallada puede actualizarse cuando el equipo legal publique políticas versionadas.",
  },
  psychologists: {
    title: "Plan Cuidado — entre sesiones",
    introBefore:
      "Entre citas, el contexto emocional del paciente a menudo desaparece. Con el",
    introMode: "plan Cuidado",
    introAfter:
      ", los profesionales siguen paneles de solo lectura — solo cuando el paciente los invita. Esto no es la historia clínica de la clínica: eso vive en EmotiveCare Clínicas.",
    howTitle: "Cómo funciona en la práctica",
    howSteps: [
      "El paciente registra emociones y energía en la app EmotiveCare.",
      "Con Pleno (o un beneficio heredado), envía una invitación segura.",
      "En Cuidado, ves el progreso y las tendencias en solo lectura.",
      "El paciente pausa o revoca el acceso cuando quiera.",
    ],
    idealTitle: "Ideal para",
    idealItems: [
      "Psicólogos en atención continua;",
      "Profesionales que quieren contexto longitudinal antes de las sesiones;",
      "Quienes necesitan un seguimiento digital ligero sin operar CRM ni agenda de la clínica.",
    ],
    ethicsTitle: "Límites éticos",
    ethicsBefore:
      "SENTIO AI sintetiza lo que el paciente registró; la interpretación clínica sigue siendo tuya. La plataforma no diagnostica, no prescribe ni sustituye la escucha. Para CRM, agenda y teleconsulta usa EmotiveCare Clínicas. Lee también",
    ethicsLink: "Cómo los psicólogos usan el panel entre sesiones",
    ethicsAfter: ".",
    ethicsArticleSlug: "como-profissionais-usam-dashboard-terapeutico",
    ctaRegister: "Empezar como profesional",
    ctaPlans: "Ver plan Cuidado",
    ctaFaq: "FAQ",
    ctaClinics: "Explorar Clínicas",
    flowNavAria: "Flujo profesional Cuidado",
  },
  clinics: {
    eyebrow: "Producto para profesionales de la salud",
    title: "EmotiveCare Clínicas",
    intro:
      "La suite operativa de la clínica: pacientes del tenant, agenda, teleconsulta, notas y consentimientos — separada del diario personal de la app EmotiveCare.",
    splitTitle: "Clínicas ≠ Cuidado ≠ Pleno",
    splitBody:
      "Pleno es el recorrido completo de la persona en la app. Cuidado es el plan profesional para paneles por invitación. Clínicas es multi-tenant: CRM, roles, auditoría y flujos clínicos de la organización.",
    modulesTitle: "Lo que ya está en el producto",
    modules: [
      {
        title: "CRM de pacientes",
        text: "Registro, embudo (lead → activo → alta), contactos e historial de estado por organización.",
      },
      {
        title: "Agenda y disponibilidad",
        text: "Sesiones, confirmación, reprogramación y la grilla semanal del profesional.",
      },
      {
        title: "Teleconsulta",
        text: "Sala autenticada con ingreso por código — alineada a la sesión agendada.",
      },
      {
        title: "Notas y síntesis",
        text: "Notas clínicas con firma/addendum y síntesis SENTIO AI revisadas antes de entrar al expediente.",
      },
      {
        title: "Consentimientos y diario",
        text: "Consentimiento por propósito; el diario de la app solo entra a la clínica con autorización — incluso por registro.",
      },
      {
        title: "Planes de cuidado y recordatorios",
        text: "Ítems liberados al paciente, próximas sesiones y recordatorios de medicación/actividad en la app.",
      },
    ],
    forWhomTitle: "Para quién es",
    forWhom: [
      "Clínicas y consultorios multiprofesionales",
      "Psicólogos que necesitan operación más allá de los paneles entre sesiones",
      "Equipos con secretaría, admin y DPO en roles distintos",
    ],
    ethicsTitle: "Ética y responsabilidad",
    ethicsBody:
      "Clínicas organiza el trabajo clínico; no sustituye el juicio profesional. Las síntesis de IA requieren revisión humana. El consentimiento y la auditoría acompañan el acceso a datos sensibles.",
    ctaOpen: "Abrir Clínicas",
    ctaPlans: "Ver planes de la app",
    ctaPsych: "Plan Cuidado",
  },
  resources: {
    title: "Recursos",
    intro:
      "Materiales para el autoconocimiento emocional y el uso responsable de la IA. EmotiveCare es apoyo complementario — en una crisis, prioriza redes de emergencia y profesionales de salud mental.",
    articlesTitle: "Artículos EmotiveCare",
    seeAllArticles: "Ver todos los artículos →",
    externalTitle: "Apoyo externo",
    external: [
      {
        name: "CVV — Centro de Valorização da Vida",
        href: "https://www.cvv.org.br/",
        note: "Apoyo emocional gratuito 24/7 en Brasil (llama al 188).",
      },
      {
        name: "Ministerio de Salud de Brasil — salud mental",
        href: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental",
        note: "Información oficial y red de atención.",
      },
    ],
    linkFaq: "FAQ institucional",
    linkPsychologists: "Para psicólogos",
    linkPlans: "Planes",
    exploreNavAria: "Explorar contenido",
  },
  terms: {
    title: "Términos de la plataforma",
    intro:
      "Términos de Uso, Compromiso y Responsabilidad de EmotiveCare. Al usar la plataforma, aceptas las condiciones siguientes.",
  },
  auth: {
    loginTitle: "Bienvenido de nuevo",
    loginSubtitle:
      "Tu puerta de entrada a una plataforma de cuidado emocional continuo",
    registerTitle: "Crea tu cuenta",
    registerSubtitle:
      "Empieza tu recorrido con EmotiveCare, tu segundo cerebro emocional — simple y acogedor",
    email: "Email",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    name: "Nombre",
    namePlaceholder: "¿Cómo te llamamos?",
    passwordPlaceholder: "Tu contraseña",
    passwordMinPlaceholder: "Al menos 6 caracteres",
    confirmPasswordPlaceholder: "Repite tu contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    submitLogin: "Entrar",
    submitRegister: "Crear cuenta",
    or: "o",
    noAccount: "¿Aún no tienes cuenta?",
    createAccount: "Crear cuenta",
    hasAccount: "¿Ya tienes cuenta?",
    goLogin: "Entrar",
    forgotTitle: "Olvidé mi contraseña",
    forgotSubtitle: "Te enviaremos un enlace para restablecer tu contraseña",
    resetTitle: "Nueva contraseña",
    resetSubtitle: "Elige una contraseña segura para tu cuenta",
    newPassword: "Nueva contraseña",
    loading: "Cargando...",
  },
  blog: {
    tocLabel: "Índice del artículo",
    inThisArticle: "En este artículo",
    faq: "Preguntas frecuentes",
    conclusion: "Conclusión",
    keepReading: "Seguir leyendo",
    backToArticles: "Volver a los artículos",
    crisisNote:
      "Si experimentas sufrimiento persistente o pensamientos de autolesión, busca de inmediato servicios de emergencia y profesionales de salud mental cerca de ti.",
    languageLabel: "Idioma",
    indexTitle: "Blog EmotiveCare",
    indexIntro:
      "Artículos actualizados con respuestas directas sobre autoconocimiento, burnout, ansiedad leve reportada por el usuario y seguimiento ético paciente–profesional.",
    notFoundTitle: "Artículo no encontrado",
  },
};
