import type { BlogPost } from "../types";

/** Short editorial articles (legacy) — English. */
export const legacyPostsEn: BlogPost[] = [
  {
    slug: "bem-vindo-a-emotivecare",
    locale: "en",
    title:
      "Welcome to EmotiveCare: continuous emotional follow-up with SENTIO AI",
    description:
      "Learn how to combine intelligent daily entries, emotional memory, and therapeutic dashboards in a single ethical routine.",
    datePublished: "2026-05-01",
    dateModified: "2026-07-10",
    keywords: ["EmotiveCare", "SENTIO AI", "well-being", "emotional diary"],
    sections: [
      {
        id: "o-que-e",
        heading: "What EmotiveCare is",
        paragraphs: [
          "EmotiveCare is a continuous emotional care platform: you record what you feel, SENTIO AI organizes patterns over time, and returns reflections based on your own history — not generic answers.",
          "The goal is not to replace therapy. It is to offer a second emotional brain between sessions, in everyday life, with privacy and consent at the center.",
          "Whether you are starting a self-knowledge journey or already in therapy, the platform gives structure to what often gets lost between one week and the next.",
        ],
      },
      {
        id: "diario",
        heading: "Emotional energy diary",
        paragraphs: [
          "Each entry combines free text with energy (0–100), mood, anxiety, and emotion tags. In a few seconds you leave a useful trail; the more context you write, the richer the summaries become.",
          "Over the weeks, the timeline stops being a loose list of days and starts showing trends: average energy, recurring emotions, and needs that repeat.",
          "That longitudinal view helps you notice what a single hard day can hide — and what a calm week may be consolidating.",
        ],
      },
      {
        id: "memoria",
        heading: "Emotional memory with SENTIO AI",
        paragraphs: [
          "SENTIO AI uses semantic search across your history to connect the present moment to similar entries — even ones from weeks ago. That way, the assistant remembers for you and suggests reflections anchored in your trajectory.",
          "Insights are descriptive: patterns, reported energy, and self-care suggestions. There is no automatic diagnosis and no promise of a cure.",
        ],
      },
      {
        id: "compartilhamento",
        heading: "Sharing with professionals",
        paragraphs: [
          "When you want, you can invite a trusted psychologist to view dashboards in read-only mode. Access is controlled by you and can be paused or revoked at any time.",
          "For details on limits and plan benefits, see the [plans](/plans) page. For ethics and privacy questions, check the [FAQ](/faq).",
        ],
      },
    ],
    faq: [
      {
        question: "Does EmotiveCare replace therapy?",
        answer:
          "No. It supports self-knowledge and complementary follow-up between sessions. In intense distress, seek professional help and emergency services.",
      },
      {
        question: "Do I need to write long texts?",
        answer:
          "No. Energy, mood, and a few tags already help. Richer texts improve reflections, but they are not required to get started.",
      },
    ],
    cta: {
      heading: "Get started on EmotiveCare",
      body: "Create your free account and try the emotional energy diary with SENTIO AI.",
      links: [
        { href: "/register", label: "Start for free" },
        { href: "/plans", label: "See plans" },
      ],
    },
    relatedSlugs: [
      "diario-emocional-com-ia-como-comecar",
      "por-que-utilizar-a-emotivecare",
    ],
  },
  {
    slug: "como-profissionais-usam-dashboard-terapeutico",
    locale: "en",
    title:
      "How psychologists use the between-session dashboard (without replacing clinical listening)",
    description:
      "Longitudinal context, smarter pre-session prep, and sharing controlled by the patient.",
    datePublished: "2026-05-08",
    dateModified: "2026-07-10",
    keywords: [
      "digital psychology",
      "longitudinal follow-up",
      "therapeutic dashboard",
    ],
    sections: [
      {
        id: "intervalo",
        heading: "The problem of the gap between sessions",
        paragraphs: [
          "Between one appointment and the next, a lot of emotional information is lost: patients summarize the week in a few minutes, and professionals rebuild context under time pressure.",
          "A longitudinal dashboard — fed by the patient themselves — can enrich listening without turning the session into chart reading.",
          "The point is not to replace the narrative, but to arrive with better hypotheses about what happened between meetings.",
        ],
      },
      {
        id: "modo-cuidado",
        heading: "What Care mode shows",
        paragraphs: [
          "With explicit consent, the professional sees energy trends, frequent emotions, and structured summaries. Access is read-only: who decides to share (and for how long) is the patient.",
          "That speeds up pre-session prep and helps identify patterns patients may not verbalize right away — always as a hypothesis to explore in the therapeutic relationship, never as an automatic report.",
        ],
      },
      {
        id: "limites",
        heading: "Clear ethical limits",
        paragraphs: [
          "EmotiveCare does not diagnose, prescribe, or replace clinical judgment. SENTIO AI synthesizes what the patient recorded; interpretation remains with the professional and the person.",
          "If you see patients and want to learn the invite flow, visit the [for psychologists](/psychologists) page and compare the Care plan on [plans](/plans).",
        ],
      },
    ],
    faq: [
      {
        question: "Can the patient revoke access?",
        answer:
          "Yes. Sharing is optional and can be paused or revoked at any time by the patient.",
      },
      {
        question: "Does this replace the clinical interview?",
        answer:
          "No. The dashboard complements listening with between-session context; clinical direction remains with the professional.",
      },
    ],
    cta: {
      heading: "Care mode on EmotiveCare",
      body: "Learn about the invite flow and read-only dashboards for professionals.",
      links: [
        { href: "/psychologists", label: "For psychologists" },
        { href: "/plans", label: "Care plan" },
      ],
    },
    relatedSlugs: [
      "plataforma-completa-para-psicologos",
      "psicologia-e-inovacao",
    ],
  },
  {
    slug: "diario-emocional-com-ia-como-comecar",
    locale: "en",
    title: "Emotional diary with AI: how to start without overdoing it",
    description:
      "A light logging routine, energy 0–100, and what SENTIO AI actually does with what you write — without clinical promises.",
    datePublished: "2026-06-12",
    dateModified: "2026-07-10",
    keywords: [
      "emotional diary with AI",
      "self-knowledge",
      "emotional logging",
    ],
    sections: [
      {
        id: "comece-pequeno",
        heading: "Start small",
        paragraphs: [
          "Many people abandon journaling because they think they need to write pages. On EmotiveCare, a useful entry can be: energy 45, low mood, “anxiety” tag, and one sentence about the day’s trigger.",
          "Gentle consistency beats perfection. Three honest entries in a week already generate a more useful summary than one long isolated text.",
          "If writing feels heavy, start with scales and tags only — and add a sentence when you have energy for it.",
        ],
      },
      {
        id: "o-que-ia-faz",
        heading: "What the AI does (and what it does not)",
        paragraphs: [
          "SENTIO AI organizes detected emotions, apparent needs, and connections to similar moments in your history. It returns reflections and regulation suggestions anchored in your trajectory.",
          "It does not diagnose, does not promise a cure, and, in intense distress, points you toward professional help.",
        ],
      },
      {
        id: "rotina",
        heading: "A 2-minute routine",
        paragraphs: [
          "1) Mark energy, mood, and anxiety. 2) Choose one or two emotions. 3) Write one sentence about the context. 4) If you want, ask the assistant for a reflection afterward.",
          "When it makes sense to level up, compare the Essential, Full, and Care [plans](/plans).",
        ],
      },
    ],
    faq: [
      {
        question: "Do I need a paid plan to start?",
        answer:
          "No. The Essential plan lets you start the diary and emotional analysis. Advanced features depend on the plan you choose.",
      },
    ],
    cta: {
      heading: "Try the EmotiveCare diary",
      body: "Start for free and see how SENTIO AI returns reflections from your own history.",
      links: [
        { href: "/register", label: "Start for free" },
        { href: "/faq", label: "FAQ" },
      ],
    },
    relatedSlugs: [
      "segundo-cerebro-emocional-memoria-semantica",
      "bem-vindo-a-emotivecare",
    ],
  },
  {
    slug: "burnout-e-ansiedade-acompanhar-energia-sem-autodiagnostico",
    locale: "en",
    title:
      "Burnout and anxiety: tracking energy without falling into self-diagnosis",
    description:
      "How to use energy, sleep, and stress logs to observe yourself better — with clear limits on what technology should not do.",
    datePublished: "2026-06-20",
    dateModified: "2026-07-10",
    keywords: ["burnout", "anxiety", "emotional energy", "self-care"],
    sections: [
      {
        id: "observar",
        heading: "Observing is not diagnosing",
        paragraphs: [
          "Noticing that energy drops every Monday or that anxiety rises before meetings is useful information. Turning that into “I have X” without a professional assessment is another path — and a risky one.",
          "EmotiveCare treats burnout, stress, and anxiety as dimensions you can track over time, not as clinical reports.",
          "The value is in the pattern: weeks of low energy, recurring triggers, and moments when rest actually helps.",
        ],
      },
      {
        id: "sinais",
        heading: "Signs that deserve human attention",
        paragraphs: [
          "If distress is intense, persistent, or involves self-harm ideation, seek emergency services and mental health professionals.",
          "Between sessions, the diary and weekly summary can help you (and, with consent, your therapist) see the week more clearly.",
        ],
      },
      {
        id: "tracking",
        heading: "Light well-being tracking",
        paragraphs: [
          "Beyond moment-to-moment energy, fuller plans let you track sleep, stress, socialization, and motivation.",
          "For questions, read the [FAQ](/faq). To get started, [create an account](/register).",
        ],
      },
    ],
    faq: [
      {
        question: "Does EmotiveCare diagnose burnout?",
        answer:
          "No. We do not run automatic clinical assessments. Insights reflect what you log and support self-knowledge.",
      },
    ],
    cta: {
      heading: "Track energy with care",
      body: "Use EmotiveCare to observe patterns over time — without turning the diary into a self-diagnosis.",
      links: [
        { href: "/register", label: "Start for free" },
        { href: "/faq", label: "FAQ" },
      ],
    },
    relatedSlugs: [
      "diario-emocional-com-ia-como-comecar",
      "tendencias-da-psicologia-em-2026",
    ],
  },
  {
    slug: "segundo-cerebro-emocional-memoria-semantica",
    locale: "en",
    title: "Second emotional brain: what semantic memory means in practice",
    description:
      "Why organizing emotions by meaning (not only by date) changes the quality of the assistant’s reflections.",
    datePublished: "2026-07-01",
    dateModified: "2026-07-10",
    keywords: [
      "second emotional brain",
      "semantic memory",
      "emotional RAG",
    ],
    sections: [
      {
        id: "diario-vs-memoria",
        heading: "Ordinary diary vs. memory by meaning",
        paragraphs: [
          "A traditional diary stores texts by date. Next week, you start from scratch.",
          "EmotiveCare’s second emotional brain searches your history for semantically similar moments and brings that context into the conversation.",
          "Instead of only “what I wrote on Tuesday,” you get “what this feels like compared with other moments like it.”",
        ],
      },
      {
        id: "dia-a-dia",
        heading: "How this shows up day to day",
        paragraphs: [
          "When you talk with the assistant, it can remember patterns: recurring triggers, strategies that already helped, and needs that repeat.",
          "That requires guardrails: the focus stays on emotions, mood, energy, relationships, and self-care.",
        ],
      },
      {
        id: "privacidade",
        heading: "Privacy and control",
        paragraphs: [
          "Your entries are yours (LGPD). You decide what to write, what to review with AI, and what to share.",
          "Learn more on the [About](/about) page or on the [blog](/blog).",
        ],
      },
    ],
    faq: [
      {
        question: "Does semantic memory read everything automatically?",
        answer:
          "Search uses the history you recorded on the platform. You control what enters that history.",
      },
    ],
    cta: {
      heading: "Build your second emotional brain",
      body: "Start logging on EmotiveCare and see how semantic memory connects your present to your own history.",
      links: [
        { href: "/register", label: "Start for free" },
        { href: "/about", label: "About EmotiveCare" },
      ],
    },
    relatedSlugs: [
      "bem-vindo-a-emotivecare",
      "por-que-utilizar-a-emotivecare",
    ],
  },
];
