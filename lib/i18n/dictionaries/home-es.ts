import type { HomeDictionary } from "./home-pt";

export const homeEs = {
  nav: {
    ariaLabel: "Navegación principal de EmotiveCare",
    howItWorks: "Cómo funciona",
    products: "Productos",
    plans: "Planes",
    clinics: "Clínicas",
    clinicApp: "Abrir Clínicas",
    blog: "Blog",
    login: "Entrar",
    cta: "Empezar gratis",
    languageLabel: "Idioma",
  },
  hero: {
    brand: "EmotiveCare",
    eyebrow: "Cuidado emocional continuo · SENTIO AI",
    title: "Memoria emocional para personas. Operación segura para clínicas.",
    body: "Un segundo cerebro en la app de la persona — y EmotiveCare Clínicas para CRM, agenda y teleconsulta del equipo.",
    ctaPrimary: "Empezar gratis",
    ctaSecondary: "Explorar Clínicas",
    ctaTertiary: "Cómo funciona",
    trustLine: "Essencial gratis · Pleno R$ 9.99/mes · Datos bajo LGPD",
    tagline: "Siente contigo y recuerda por ti.",
  },
  howItWorks: {
    title: "Cómo funciona EmotiveCare",
    subtitle:
      "Del registro de un momento a una reflexión personalizada — en cuatro pasos.",
    steps: [
      {
        step: "1",
        title: "Registra tu momento",
        text: "Texto libre, energía 0–100, estado de ánimo y emociones — en minutos.",
      },
      {
        step: "2",
        title: "SENTIO AI entiende",
        text: "Cada registro se vuelve patrones, necesidades y una acción concreta — sin diagnóstico automático.",
      },
      {
        step: "3",
        title: "El segundo cerebro conecta",
        text: "La memoria semántica encuentra momentos similares en tu historial, incluso semanas después.",
      },
      {
        step: "4",
        title: "Tú eliges el siguiente paso",
        text: "Reflexiones en la app, compartir con 1 profesional (Pleno) u operación completa en Clínicas.",
      },
    ],
  },
  secondBrain: {
    eyebrow: "La diferencia",
    title: "Un diario común olvida. EmotiveCare recuerda.",
    bodyBefore:
      "La mayoría de las apps guardan textos dispersos. EmotiveCare organiza las emociones por",
    bodyEmphasis: "significado",
    bodyAfter: " — y el asistente trae de vuelta lo que importa ahora.",
    ordinaryLabel: "Un diario común",
    ordinaryText:
      "Registras ansiedad hoy. El texto queda solo. La semana siguiente, empiezas de cero.",
    withLabel: "Con EmotiveCare",
    withText:
      "“Hace tres semanas sentiste algo similar, la noche antes de una reunión. Respirar ayudó.” La memoria trabaja por ti.",
  },
  products: {
    title: "Tres productos. Una marca.",
    subtitle:
      "App de la persona, plan profesional entre sesiones y la suite B2B de la clínica — cada uno en su lugar.",
    items: [
      {
        id: "pleno",
        eyebrow: "App · Pleno",
        title: "Para personas que quieren entenderse",
        text: "Diario, SENTIO AI, segundo cerebro y compartir con 1 profesional — R$ 9.99/mes después de Essencial gratis.",
        bullets: [
          "Diario e insights ilimitados",
          "Hasta 500 interacciones del asistente/mes",
          "Seguimiento de sueño, estrés y burnout",
        ],
        cta: "Empezar en la app",
        href: "register",
        tone: "person",
      },
      {
        id: "cuidado",
        eyebrow: "App · Cuidado",
        title: "Para quienes acompañan entre sesiones",
        text: "Plan profesional en la app: paneles de solo lectura para pacientes que te invitan — no es el expediente de la clínica.",
        bullets: [
          "Paneles ilimitados por invitación",
          "Pacientes heredan Pleno (+ R$ 5/mes por vínculo)",
          "Invitación por e-mail para vincular al app",
        ],
        cta: "Suscribirse al plan Cuidado",
        href: "cuidado-checkout",
        tone: "care",
      },
      {
        id: "clinicas",
        eyebrow: "EmotiveCare Clínicas",
        title: "Para quienes operan la clínica",
        text: "CRM, agenda, teleconsulta, notas, consentimientos, recordatorios, planes de cuidado y síntesis revisadas por humanos.",
        bullets: [
          "Multi-tenant con roles y auditoría",
          "Teleconsulta con consentimiento TELECONSULTA",
          "Síntesis SENTIO AI revisables",
        ],
        cta: "Explorar Clínicas",
        href: "clinicas",
        tone: "clinic",
      },
    ],
    clinicLoginBefore: "¿Ya formas parte de una organización?",
    clinicLoginCta: "Abrir la app Clínicas →",
  },
  security: {
    title: "El cuidado real empieza con seguridad",
    subtitle: "Transparencia sobre lo que EmotiveCare es — y lo que no es.",
    items: [
      {
        title: "No sustituye la terapia",
        description:
          "Autoconocimiento y apoyo. Sin diagnóstico automático. En un sufrimiento intenso, busca ayuda profesional.",
      },
      {
        title: "Asistente con salvaguardas",
        description:
          "Enfocado en emociones, estado de ánimo, energía y autocuidado — con capas que mantienen el cuidado en el centro.",
      },
      {
        title: "Tus datos son tuyos (LGPD)",
        description:
          "Tú decides qué registrar, qué analiza la IA y qué compartir — en la app y en Clínicas.",
      },
    ],
  },
  plans: {
    title: "Planes de la app",
    subtitle:
      "Essencial y Pleno para la persona. Cuidado para el profesional en la app. La operación de la clínica vive en EmotiveCare Clínicas.",
    highlightedBadge: "El más completo",
    detailsBefore: "Detalles en la página de",
    detailsLink: "Planes",
    detailsAfter: ".",
    clinicsBefore: "CRM, agenda y teleconsulta:",
    clinicsLink: "EmotiveCare Clínicas",
    clinicsAfter: " — o abre la app directamente.",
    clinicAppCta: "Abrir Clínicas",
    items: [
      {
        name: "Essencial",
        price: "Gratis",
        tagline: "Para empezar a entenderte.",
        features: [
          "Diario de energía emocional",
          "Análisis con SENTIO AI por registro",
          "Resumen semanal del recorrido",
        ],
        cta: "Empezar gratis",
        highlighted: false,
      },
      {
        name: "Pleno",
        price: "R$ 9.99/mes",
        tagline: "El segundo cerebro en el bolsillo.",
        features: [
          "Diario e IA ilimitados",
          "Hasta 500 interacciones del asistente/mes",
          "Seguimiento de sueño, estrés y burnout",
          "Compartir con 1 profesional",
        ],
        cta: "Quiero Pleno",
        highlighted: true,
      },
      {
        name: "Cuidado",
        price: "Profesional",
        tagline: "Acompaña a quienes te invitan.",
        features: [
          "Paneles ilimitados por invitación",
          "Pleno patrocinado (+ R$ 5/mes por paciente)",
          "Invitación por e-mail para vincular",
        ],
        cta: "Soy profesional",
        highlighted: false,
      },
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    entries: [
      {
        question: "¿EmotiveCare es terapia?",
        answer:
          "No. Es autoconocimiento y apoyo emocional. No diagnostica, no promete una cura ni sustituye a un clínico.",
      },
      {
        question: "¿Cuál es la diferencia entre Pleno, Cuidado y Clínicas?",
        answer:
          "Pleno es el plan completo de la persona en la app. Cuidado es el plan profesional en la app (paneles por invitación). EmotiveCare Clínicas es el producto B2B: CRM, agenda, teleconsulta y notas.",
      },
      {
        question: "¿Qué es EmotiveCare Clínicas?",
        answer:
          "La suite operativa de la clínica: pacientes del tenant, agenda, teleconsulta, notas, consentimientos, recordatorios, planes de cuidado y síntesis revisables. No sustituye el juicio clínico.",
      },
      {
        question: "¿Cómo funciona SENTIO AI?",
        answer:
          "Sintetiza patrones y sugerencias a partir de lo que registras — o, en Clínicas, borradores que los profesionales revisan antes de documentar.",
      },
      {
        question: "¿Puedo compartir con mi psicólogo?",
        answer:
          "Sí. En la app vía Pleno/Cuidado. En Clínicas, consentimiento por propósito. Pausa o revoca cuando quieras.",
      },
      {
        question: "¿Mis datos están seguros?",
        answer:
          "Sí. Tú controlas qué escribir, analizar y compartir. Tratamos los datos bajo LGPD.",
      },
    ],
  },
  finalCta: {
    title: "Empieza a entenderte — u opera la clínica",
    bodyPrefix:
      "Essencial gratis. Pleno cuando tenga sentido. Clínicas cuando el equipo necesite operación.",
    cta: "Empezar gratis",
    ctaClinics: "Ir a Clínicas",
    loginLink: "Ya tengo cuenta — entrar →",
  },
  footer: {
    brandBlurb:
      "apoya el recorrido de la persona; Clínicas opera la clínica. Autoconocimiento y apoyo — no sustituyen evaluación, diagnóstico ni tratamiento. Desarrollado por",
    tagline: "Siente contigo y recuerda por ti.",
    quickLinksAria: "Enlaces rápidos del pie de página",
    about: "Acerca de",
    plans: "Planes",
    clinics: "Clínicas",
    clinicApp: "Abrir Clínicas",
    faq: "FAQ",
    blog: "Blog",
    privacy: "Privacidad",
    terms: "Términos",
  },
} as const satisfies HomeDictionary;
