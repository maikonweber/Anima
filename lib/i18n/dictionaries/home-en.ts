import type { HomeDictionary } from "./home-pt";

export const homeEn = {
  nav: {
    ariaLabel: "EmotiveCare main navigation",
    howItWorks: "How it works",
    secondBrain: "Second brain",
    plans: "Plans",
    blog: "Blog",
    login: "Sign in",
    cta: "Start free",
    languageLabel: "Language",
  },
  hero: {
    eyebrow: "Emotional energy journal with AI",
    title: "Your emotional second brain.",
    body: "EmotiveCare understands what you write, connects your patterns over time, and returns reflections made for your story — not canned answers.",
    quote: "It feels with you and remembers for you.",
    ctaPrimary: "Start free",
    ctaSecondary: "See how it works",
    trustLine: "Free to start · No card required · Your data is yours (LGPD)",
    tagline:
      "Your emotional second brain. It feels with you and remembers for you.",
  },
  howItWorks: {
    title: "How EmotiveCare works",
    subtitle:
      "From logging a moment to a personalized reflection — in four simple steps.",
    steps: [
      {
        step: "1",
        title: "Log your moment",
        text: "Write freely and mark your energy (0–100), mood, anxiety, and the emotions you are feeling right now.",
      },
      {
        step: "2",
        title: "AI understands",
        text: "Each entry is analyzed: calculated energy, detected emotions, the hidden emotion, and the need behind the moment.",
      },
      {
        step: "3",
        title: "The second brain connects",
        text: "Using semantic memory, EmotiveCare searches your full history for entries similar to what you are living now — even ones from weeks ago.",
      },
      {
        step: "4",
        title: "You get reflections and actions",
        text: "An empathetic summary and a concrete regulation action, always grounded in your own emotional trajectory.",
      },
    ],
  },
  secondBrain: {
    eyebrow: "What sets EmotiveCare apart",
    title: "A regular journal forgets. EmotiveCare remembers.",
    bodyBefore:
      "Most apps store your texts and leave them scattered, one day disconnected from the next. EmotiveCare organizes your emotions by",
    bodyEmphasis: "meaning",
    bodyAfter:
      ", not by date. When you talk with the assistant, it searches your history — with semantic memory — for moments like the one you are in now and connects dots you may have already forgotten.",
    ordinaryLabel: "A regular journal",
    ordinaryText:
      "You log that you feel anxious today. The text is saved, isolated — and nothing links that day to any other. Next week, you start from scratch.",
    withLabel: "With EmotiveCare",
    withText:
      "“Three weeks ago you felt something similar, also the night before a meeting. That day, breathing before you started helped.” EmotiveCare remembers for you.",
  },
  features: {
    title: "Everything EmotiveCare does for you",
    subtitle:
      "More than a journal: a complete system for emotional self-awareness.",
    items: [
      {
        title: "Emotional energy journal",
        description:
          "Free text plus energy level (0–100), mood, anxiety, emotional intensity, and emotion tags. Simple to log, rich to follow.",
      },
      {
        title: "AI emotional analysis",
        description:
          "Each entry reveals calculated energy, detected emotions, the hidden emotion, the compound emotion, the need and desire of the moment — with a concrete action and an empathetic summary.",
      },
      {
        title: "Emotional second brain (RAG)",
        description:
          "Semantic search with vector memory across your full history. In every conversation, the assistant brings the entries that truly matter to what you feel now.",
      },
      {
        title: "Safe emotional assistant",
        description:
          "Focused only on emotions, mood, energy, anxiety, relationships, and self-care — with protection layers (guardrails) and a suggestion to seek professional help in intense distress. Not a generic ChatGPT.",
      },
      {
        title: "Weekly summary",
        description:
          "Your average energy, the week’s trend (rising, stable, or falling), the most frequent emotions, and the main needs of the period.",
      },
      {
        title: "Well-being tracking",
        description:
          "Follow sleep, stress, socialization, motivation, and burnout over time and see how each one influences your energy.",
      },
      {
        title: "Care Mode (for psychologists)",
        description:
          "Invites to follow patients who choose to share their progress — continuous support between sessions.",
      },
    ],
  },
  audiences: {
    title: "Who EmotiveCare is for",
    items: [
      {
        eyebrow: "For you",
        title: "For people who want to understand themselves better",
        text: "People seeking to understand their own emotions, reduce anxiety and burnout, and build self-awareness at their own pace — without judgment and without rush.",
        bullets: [
          "A journal that returns meaning, not just stored text",
          "Reflections based on your story, not canned answers",
          "Light tracking of your energy, sleep, and stress",
        ],
      },
      {
        eyebrow: "For psychologists",
        title: "For people who care for others",
        text: "Professionals who want to follow patients between sessions. With Care Mode, you receive invites to accompany those who choose to share their own progress.",
        bullets: [
          "Secure invites controlled by the patient",
          "Continuous context to enrich listening",
          "Complements clinical practice — never replaces it",
        ],
      },
    ],
  },
  security: {
    title: "Real care starts with safety",
    subtitle: "Transparency about what EmotiveCare is — and what it is not.",
    items: [
      {
        title: "Does not replace therapy",
        description:
          "EmotiveCare is a self-awareness and support tool. It does not diagnose or promise a cure and, in moments of intense distress, suggests seeking professional help.",
      },
      {
        title: "Assistant with guardrails",
        description:
          "Conversation stays focused exclusively on emotions, mood, energy, anxiety, relationships, and self-care, with protection layers that keep care at the center.",
      },
      {
        title: "Your data is yours (LGPD)",
        description:
          "You decide what to log, what to review with AI, and what to share. Privacy and data care follow Brazil’s LGPD.",
      },
    ],
  },
  plans: {
    title: "Plans for every stage",
    subtitle: "Start free and upgrade when it makes sense for you.",
    highlightedBadge: "Most complete",
    detailsBefore: "You can find details and pricing for each plan on the",
    detailsLink: "Plans",
    detailsAfter: " page.",
    items: [
      {
        name: "Essential",
        price: "Free",
        tagline: "To start understanding yourself.",
        features: [
          "Emotional energy journal",
          "AI emotional analysis",
          "Weekly summary",
        ],
        cta: "Start free",
        highlighted: false,
      },
      {
        name: "Full",
        price: "Subscription",
        tagline: "The second brain in your pocket.",
        features: [
          "Everything in Essential",
          "Emotional assistant with memory of your history (RAG)",
          "Full sleep, stress, and burnout tracking",
          "Sharing with a trusted professional",
        ],
        cta: "I want Full",
        highlighted: true,
      },
      {
        name: "Care",
        price: "For psychologists",
        tagline: "Follow your patients.",
        features: [
          "Care Mode with patient invites",
          "Continuous follow-up between sessions",
          "Dashboards dedicated to the professional",
        ],
        cta: "I am a psychologist",
        highlighted: false,
      },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    entries: [
      {
        question: "Is EmotiveCare therapy?",
        answer:
          "No. EmotiveCare is a self-awareness and emotional support tool. It helps you organize and understand what you feel, but it does not diagnose, does not promise a cure, and does not replace care from psychologists or physicians. In moments of intense distress, it suggests seeking professional help.",
      },
      {
        question: "Does the platform make automatic diagnoses?",
        answer:
          "No. Insights are reflections on patterns and energy you report — or that a professional sees with authorized context. There is no automatic clinical assessment.",
      },
      {
        question: "How does SENTIO AI work?",
        answer:
          "SENTIO AI is EmotiveCare’s contextual engine. It synthesizes patterns, weekly trends, and self-care suggestions from the data you choose to log — always without promising automatic diagnosis or replacing clinical judgment.",
      },
      {
        question: "What is the emotional second brain?",
        answer:
          "It is how EmotiveCare stores and connects your emotions by meaning, not only by date. Using semantic search (embeddings and vector memory), it finds moments in your history similar to what you are living now and brings them into the conversation — like an emotional memory that remembers and connects dots for you.",
      },
      {
        question: "Does it work without writing much?",
        answer:
          "Yes. You can log only energy, mood, and a few emotion tags in seconds. The more you write, the richer the reflections become, but EmotiveCare does not require long texts to get started.",
      },
      {
        question: "Can I share entries with my psychologist?",
        answer:
          "Yes. When you want, you invite trusted professionals to view read-only dashboards, depending on the plan. The patient can pause or revoke access at any time.",
      },
      {
        question: "Is my data safe?",
        answer:
          "Yes. Your entries are yours: you decide what to write, what to review with AI, and what to share. We treat data carefully and in line with LGPD. Use strong passwords and seek emergency support whenever you need immediate help.",
      },
    ],
  },
  finalCta: {
    title: "Start understanding yourself better today",
    bodyPrefix: "Free to start.",
    cta: "Start free",
    loginLink: "I already have an account — sign in →",
  },
  footer: {
    brandBlurb:
      "your emotional second brain. A self-awareness and support tool — it does not replace clinical assessment, diagnosis, or treatment. Product developed by",
    tagline: "It feels with you and remembers for you.",
    quickLinksAria: "Footer quick links",
    about: "About",
    plans: "Plans",
    faq: "FAQ",
    blog: "Blog",
    privacy: "Privacy",
    terms: "Terms",
  },
} as const satisfies HomeDictionary;
