import type { FaqEntry } from "./faq";

/** Spanish institutional FAQ — mirrors `faqEntries` (SEO + GEO). */
export const faqEntriesEs: FaqEntry[] = [
  {
    question: "¿Qué es EmotiveCare?",
    answer:
      "EmotiveCare es una plataforma de MutterCorp con dos mundos: (1) una app personal de segundo cerebro emocional con diario y SENTIO AI; (2) EmotiveCare Clínicas, un producto B2B para psicólogos y psiquiatras con CRM, agenda, teleconsulta, notas clínicas e IA clínica revisable. No es terapia y no sustituye evaluación ni tratamiento.",
  },
  {
    question: "¿Cómo funciona EmotiveCare como segundo cerebro emocional?",
    answer:
      "En el uso personal (planes Essencial y Pleno), registras emociones y energía; SENTIO AI refleja patrones; la memoria semántica conecta momentos similares en tu historial por significado, no solo por fecha. Pleno (R$ 9.99/mes) amplía el tracking, un asistente (hasta 500 interacciones/mes) y compartir el panel con 1 profesional.",
  },
  {
    question: "¿EmotiveCare es terapia?",
    answer:
      "No. Es autoconocimiento y apoyo emocional digital. No diagnostica, no promete una cura ni sustituye a un psicólogo, psiquiatra o médico. En un sufrimiento intenso, busca ayuda profesional y servicios de emergencia.",
  },
  {
    question: "¿Cuál es la diferencia entre Pleno, Cuidado y EmotiveCare Clínicas?",
    answer:
      "Pleno es el plan completo de la persona en la app (segundo cerebro, tracking, 1 profesional). Cuidado es el plan profesional en la app: paneles de solo lectura para pacientes que te invitan — sin CRM/agenda. EmotiveCare Clínicas es otro producto: operación de la clínica (CRM, agenda, teleconsulta, notas, consentimientos y síntesis de IA con revisión humana).",
  },
  {
    question: "¿Qué encuentran psicólogos y psiquiatras en EmotiveCare Clínicas?",
    answer:
      "Funcionalidades clínicas: CRM de pacientes, agenda y disponibilidad, teleconsulta con consentimiento, notas/expediente, consentimientos por finalidad (LGPD), recordatorios, plan de cuidado, alertas con revisión humana, base de conocimiento curada y síntesis SENTIO AI que el profesional revisa antes de integrar al expediente. Multi-tenant con roles y auditoría.",
  },
  {
    question: "¿SENTIO AI sustituye el juicio clínico?",
    answer:
      "No. En la app personal, la IA sugiere reflexiones y autocuidado sin diagnóstico automático. En Clínicas, genera borradores de síntesis que exigen revisión humana. Psicólogos y psiquiatras mantienen la interpretación y la responsabilidad clínica.",
  },
  {
    question: "¿Pueden psicólogos y psiquiatras usar el plan Cuidado?",
    answer:
      "Sí. El plan Cuidado es para profesionales en la app EmotiveCare: seguir paneles de solo lectura cuando el paciente invita. Sirve a psicólogos, psiquiatras y otros acompañantes autorizados. Para operar la clínica (CRM, agenda, teleconsulta), usa EmotiveCare Clínicas.",
  },
  {
    question: "¿Cómo me registro en EmotiveCare?",
    answer:
      "Todos empiezan en el plan Essencial (gratis) con registro por e-mail o Google. No hay elección de plan en el registro — después del login mejoras a Pleno (app personal, R$ 9.99/mes) o Cuidado (app profesional, R$ 149/mes) en la suscripción.",
  },
  {
    question: "¿Cómo un paciente Pleno vincula a un profesional Cuidado?",
    answer:
      "Quien invita es el paciente en plan Pleno: envía invitación segura por e-mail (care invite). El profesional en plan Cuidado acepta y ve el panel en solo lectura — solo lo autorizado por el paciente, con pausa o revocación cuando quiera. Essencial (gratis) no envía ni acepta este vínculo.",
  },
  {
    question: "¿Cómo un profesional Cuidado concede Pleno a un paciente gratuito?",
    answer:
      "Desde la clínica (EmotiveCare Clínicas): el profesional Cuidado envía invitación al e-mail del paciente con Pleno patrocinado (grantPleno). El paciente acepta con su cuenta del app; sigue Essencial en el registro, pero gana límites equivalentes a Pleno. El profesional paga R$ 5/mes por paciente patrocinado en plan Cuidado.",
  },
  {
    question: "¿Puedo compartir registros con mi psicólogo o psiquiatra?",
    answer:
      "Sí. En la app, vía planes Pleno/Cuidado con invitación y pausa/revocación. En Clínicas, el consentimiento es por propósito (p. ej. TELECONSULTA, PRONTUARIO, DIARIO_CHECKIN) y el paciente controla qué liberar.",
  },
  {
    question: "¿Mis datos están seguros (LGPD)?",
    answer:
      "Sí. Tú decides qué registrar, qué analiza la IA y qué compartir. En Clínicas hay consentimiento granular, roles y auditoría. Tratamos los datos bajo LGPD.",
  },
];
