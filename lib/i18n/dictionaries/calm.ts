import type { Locale } from "../config";

export type CalmPatternId = "box" | "478" | "coherent";

export type CalmDictionary = {
  title: string;
  subtitle: string;
  disclaimer: string;
  tabs: { breathing: string; grounding: string };
  patterns: Record<CalmPatternId, { name: string; description: string }>;
  phases: { inhale: string; hold: string; exhale: string };
  duration: string;
  minutes: (n: number) => string;
  start: string;
  pause: string;
  resume: string;
  reset: string;
  remaining: string;
  cycle: (n: number) => string;
  done: string;
  doneHint: string;
  reducedMotionHint: string;
  sessionsWeek: (n: number) => string;
  grounding: {
    intro: string;
    steps: { count: number; sense: string; prompt: string }[];
    placeholder: string;
    next: string;
    previous: string;
    finish: string;
    restart: string;
    doneTitle: string;
    doneHint: string;
    privacy: string;
    stepOf: (n: number, total: number) => string;
  };
  afterTitle: string;
  logMoment: string;
  crisisLink: string;
  dashboardCardTitle: string;
  dashboardCardText: string;
  dashboardCardCta: string;
};

const pt: CalmDictionary = {
  title: "Pausa guiada",
  subtitle:
    "Exercícios curtos de respiração e aterramento para desacelerar quando a ansiedade apertar.",
  disclaimer:
    "Se sentir tontura, volte a respirar normalmente. Estes exercícios não substituem atendimento profissional.",
  tabs: { breathing: "Respiração", grounding: "Aterramento 5-4-3-2-1" },
  patterns: {
    box: {
      name: "Respiração quadrada",
      description: "4s inspira · 4s segura · 4s solta · 4s segura. Ajuda a focar.",
    },
    "478": {
      name: "Respiração 4-7-8",
      description: "4s inspira · 7s segura · 8s solta. Boa para relaxar e dormir.",
    },
    coherent: {
      name: "Respiração coerente",
      description: "5s inspira · 5s solta. Ritmo suave para equilibrar.",
    },
  },
  phases: { inhale: "Inspire", hold: "Segure", exhale: "Solte" },
  duration: "Duração",
  minutes: (n) => (n === 1 ? "1 min" : `${n} min`),
  start: "Começar",
  pause: "Pausar",
  resume: "Continuar",
  reset: "Recomeçar",
  remaining: "restante",
  cycle: (n) => `Ciclo ${n}`,
  done: "Pausa concluída",
  doneHint: "Observe como seu corpo está agora. Sem julgamentos.",
  reducedMotionHint: "Animação reduzida conforme a preferência do seu dispositivo.",
  sessionsWeek: (n) =>
    n === 1 ? "1 pausa nos últimos 7 dias" : `${n} pausas nos últimos 7 dias`,
  grounding: {
    intro:
      "Traga a atenção para o presente usando os sentidos. Vá no seu ritmo — anotar é opcional.",
    steps: [
      { count: 5, sense: "ver", prompt: "Nomeie 5 coisas que você consegue ver." },
      { count: 4, sense: "tocar", prompt: "Perceba 4 coisas que você pode tocar." },
      { count: 3, sense: "ouvir", prompt: "Escute 3 sons ao seu redor." },
      { count: 2, sense: "cheirar", prompt: "Identifique 2 cheiros (ou lembre de cheiros que gosta)." },
      { count: 1, sense: "saborear", prompt: "Note 1 sabor — ou algo bom que você diria a si mesmo." },
    ],
    placeholder: "Anote aqui se quiser (fica só neste dispositivo e some ao sair)",
    next: "Próximo",
    previous: "Voltar",
    finish: "Concluir",
    restart: "Fazer de novo",
    doneTitle: "Você está aqui, agora.",
    doneHint: "Respire fundo mais uma vez. Se quiser, registre como está se sentindo.",
    privacy: "Nada do que você escreve aqui é enviado ou salvo.",
    stepOf: (n, total) => `Passo ${n} de ${total}`,
  },
  afterTitle: "E agora?",
  logMoment: "Registrar como estou",
  crisisLink: "Preciso de apoio agora",
  dashboardCardTitle: "Precisa de uma pausa?",
  dashboardCardText: "1 minuto de respiração guiada ou aterramento 5-4-3-2-1.",
  dashboardCardCta: "Fazer uma pausa →",
};

const en: CalmDictionary = {
  title: "Guided pause",
  subtitle:
    "Short breathing and grounding exercises to slow down when anxiety builds up.",
  disclaimer:
    "If you feel dizzy, go back to breathing normally. These exercises do not replace professional care.",
  tabs: { breathing: "Breathing", grounding: "5-4-3-2-1 grounding" },
  patterns: {
    box: {
      name: "Box breathing",
      description: "4s in · 4s hold · 4s out · 4s hold. Helps you focus.",
    },
    "478": {
      name: "4-7-8 breathing",
      description: "4s in · 7s hold · 8s out. Good to relax and fall asleep.",
    },
    coherent: {
      name: "Coherent breathing",
      description: "5s in · 5s out. A gentle rhythm to rebalance.",
    },
  },
  phases: { inhale: "Breathe in", hold: "Hold", exhale: "Breathe out" },
  duration: "Duration",
  minutes: (n) => `${n} min`,
  start: "Start",
  pause: "Pause",
  resume: "Resume",
  reset: "Restart",
  remaining: "left",
  cycle: (n) => `Cycle ${n}`,
  done: "Pause complete",
  doneHint: "Notice how your body feels now. No judgment.",
  reducedMotionHint: "Animation reduced per your device preference.",
  sessionsWeek: (n) =>
    n === 1 ? "1 pause in the last 7 days" : `${n} pauses in the last 7 days`,
  grounding: {
    intro:
      "Bring your attention back to the present using your senses. Go at your own pace — notes are optional.",
    steps: [
      { count: 5, sense: "see", prompt: "Name 5 things you can see." },
      { count: 4, sense: "touch", prompt: "Notice 4 things you can touch." },
      { count: 3, sense: "hear", prompt: "Listen for 3 sounds around you." },
      { count: 2, sense: "smell", prompt: "Identify 2 smells (or recall smells you like)." },
      { count: 1, sense: "taste", prompt: "Notice 1 taste — or one kind thing you'd tell yourself." },
    ],
    placeholder: "Jot it down if you like (stays on this device and is cleared when you leave)",
    next: "Next",
    previous: "Back",
    finish: "Finish",
    restart: "Do it again",
    doneTitle: "You are here, now.",
    doneHint: "Take one more deep breath. If you want, log how you feel.",
    privacy: "Nothing you type here is sent or saved.",
    stepOf: (n, total) => `Step ${n} of ${total}`,
  },
  afterTitle: "What next?",
  logMoment: "Log how I feel",
  crisisLink: "I need support now",
  dashboardCardTitle: "Need a pause?",
  dashboardCardText: "1 minute of guided breathing or 5-4-3-2-1 grounding.",
  dashboardCardCta: "Take a pause →",
};

const es: CalmDictionary = {
  title: "Pausa guiada",
  subtitle:
    "Ejercicios cortos de respiración y anclaje para bajar el ritmo cuando aprieta la ansiedad.",
  disclaimer:
    "Si sientes mareo, vuelve a respirar con normalidad. Estos ejercicios no sustituyen la atención profesional.",
  tabs: { breathing: "Respiración", grounding: "Anclaje 5-4-3-2-1" },
  patterns: {
    box: {
      name: "Respiración cuadrada",
      description: "4s inhala · 4s retén · 4s exhala · 4s retén. Ayuda a enfocarte.",
    },
    "478": {
      name: "Respiración 4-7-8",
      description: "4s inhala · 7s retén · 8s exhala. Buena para relajarte y dormir.",
    },
    coherent: {
      name: "Respiración coherente",
      description: "5s inhala · 5s exhala. Un ritmo suave para equilibrarte.",
    },
  },
  phases: { inhale: "Inhala", hold: "Retén", exhale: "Exhala" },
  duration: "Duración",
  minutes: (n) => `${n} min`,
  start: "Comenzar",
  pause: "Pausar",
  resume: "Continuar",
  reset: "Reiniciar",
  remaining: "restante",
  cycle: (n) => `Ciclo ${n}`,
  done: "Pausa completada",
  doneHint: "Observa cómo está tu cuerpo ahora. Sin juicios.",
  reducedMotionHint: "Animación reducida según la preferencia de tu dispositivo.",
  sessionsWeek: (n) =>
    n === 1 ? "1 pausa en los últimos 7 días" : `${n} pausas en los últimos 7 días`,
  grounding: {
    intro:
      "Trae la atención al presente usando los sentidos. Ve a tu ritmo — anotar es opcional.",
    steps: [
      { count: 5, sense: "ver", prompt: "Nombra 5 cosas que puedes ver." },
      { count: 4, sense: "tocar", prompt: "Percibe 4 cosas que puedes tocar." },
      { count: 3, sense: "oír", prompt: "Escucha 3 sonidos a tu alrededor." },
      { count: 2, sense: "oler", prompt: "Identifica 2 olores (o recuerda olores que te gustan)." },
      { count: 1, sense: "saborear", prompt: "Nota 1 sabor — o algo amable que te dirías." },
    ],
    placeholder: "Anota aquí si quieres (queda solo en este dispositivo y se borra al salir)",
    next: "Siguiente",
    previous: "Atrás",
    finish: "Terminar",
    restart: "Hacerlo de nuevo",
    doneTitle: "Estás aquí, ahora.",
    doneHint: "Respira hondo una vez más. Si quieres, registra cómo te sientes.",
    privacy: "Nada de lo que escribes aquí se envía ni se guarda.",
    stepOf: (n, total) => `Paso ${n} de ${total}`,
  },
  afterTitle: "¿Y ahora?",
  logMoment: "Registrar cómo estoy",
  crisisLink: "Necesito apoyo ahora",
  dashboardCardTitle: "¿Necesitas una pausa?",
  dashboardCardText: "1 minuto de respiración guiada o anclaje 5-4-3-2-1.",
  dashboardCardCta: "Hacer una pausa →",
};

export function getCalmDictionary(locale: Locale): CalmDictionary {
  if (locale === "en") return en;
  if (locale === "es") return es;
  return pt;
}
