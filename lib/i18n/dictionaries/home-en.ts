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
    title: "Two products under one brand",
    subtitle:
      "EmotiveCare supports the person’s emotional journey. EmotiveCare Clinics runs the professional and clinic operation.",
    items: [
      {
        title: "Emotional energy journal",
        description:
          "Log in minutes: free text, energy 0–100, mood, and emotions. Simple to use, rich to follow over time.",
      },
      {
        title: "SENTIO AI at your pace",
        description:
          "Each entry becomes a contextual reflection — patterns, needs, and a concrete action — without automatic diagnosis or miracle-cure language.",
      },
      {
        title: "Emotional second brain (Pleno)",
        description:
          "Semantic memory of your history: the assistant brings moments like now and connects dots you had already forgotten.",
      },
      {
        title: "Pleno plan — full journey",
        description:
          "Unlimited journal, sleep/stress/burnout tracking, memory-backed assistant, and the right to share your dashboard with one trusted professional.",
      },
      {
        title: "Cuidado plan — between sessions",
        description:
          "For professionals: follow up to 99 patients who invite you to see emotional progress in read-only mode — pause and revoke anytime.",
      },
      {
        title: "EmotiveCare Clinics — operations",
        description:
          "A separate product for clinics: patient CRM, scheduling, availability, teleconsult, clinical notes, consents, reminders, care plans, and human-reviewed AI syntheses.",
      },
      {
        title: "Consent and privacy",
        description:
          "You decide what to log, what AI analyzes, and what a professional may see — by purpose, by entry, always under LGPD.",
      },
    ],
  },
  audiences: {
    title: "Three ways to use EmotiveCare",
    items: [
      {
        eyebrow: "Patient app · Pleno",
        title: "For people who want to understand themselves",
        text: "Start on Essential and move to Pleno when you want continuous memory, full tracking, and a professional watching along — only if you authorize it.",
        bullets: [
          "Journal + SENTIO AI without turning emotion into a diagnosis",
          "Pleno: second brain, tracking, and safe sharing",
          "Reminders and care-plan items released by a professional when linked",
        ],
      },
      {
        eyebrow: "Cuidado plan",
        title: "For those who follow between sessions",
        text: "Cuidado is the professional plan inside the EmotiveCare app: read-only dashboards for patients who invite you — continuous context, not the clinic chart.",
        bullets: [
          "Up to 99 patient dashboards authorized by the patient",
          "Emotional trends between appointments",
          "Complements clinical listening — never replaces it",
        ],
      },
      {
        eyebrow: "EmotiveCare Clinics",
        title: "For those who run the clinic",
        text: "Clinics is the B2B product: multi-tenant CRM, agenda, teleconsult, and notes with roles and audit. Separate from the personal journal — built for the care team.",
        bullets: [
          "CRM, funnel, and contacts per organization",
          "Scheduling, availability, and teleconsult",
          "Clinical notes, consents, reminders, care plans, and human-reviewed syntheses",
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
    title: "EmotiveCare app plans",
    subtitle:
      "Essential and Pleno are for the person. Cuidado is for the professional in the app. Clinic operations live in EmotiveCare Clinics — a separate product.",
    highlightedBadge: "Most complete",
    detailsBefore: "Details and pricing on the",
    detailsLink: "Plans",
    detailsAfter: " page. For CRM, scheduling, and teleconsult, see EmotiveCare Clinics.",
    items: [
      {
        name: "Essential",
        price: "Free",
        tagline: "To start understanding yourself.",
        features: [
          "Emotional energy journal",
          "SENTIO AI analysis per entry",
          "Weekly journey summary",
        ],
        cta: "Start free",
        highlighted: false,
      },
      {
        name: "Pleno",
        price: "Subscription",
        tagline: "The second brain in your pocket.",
        features: [
          "Everything in Essential, without monthly entry caps",
          "Assistant with semantic memory of your history",
          "Sleep, stress, socialization, and burnout tracking",
          "Share dashboard with 1 trusted professional",
        ],
        cta: "I want Pleno",
        highlighted: true,
      },
      {
        name: "Cuidado",
        price: "For professionals",
        tagline: "Follow those who invite you.",
        features: [
          "Up to 99 authorized patient dashboards",
          "Emotional context between sessions (read-only)",
          "Linked patients inherit Pleno benefits",
        ],
        cta: "I am a professional",
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
          "No. It is self-awareness and emotional support. It does not diagnose, does not promise a cure, and does not replace a psychologist or physician. In intense distress, it points you to professional help.",
      },
      {
        question: "What is the difference between Pleno, Cuidado, and Clinics?",
        answer:
          "Pleno is the full person plan in the app (memory, tracking, share with 1 professional). Cuidado is the professional plan in the app to follow patients who invite you. EmotiveCare Clinics is another product: organization CRM, scheduling, teleconsult, and clinical notes — separate from the personal journal.",
      },
      {
        question: "What is EmotiveCare Clinics?",
        answer:
          "The suite for professionals and clinics: tenant patients, agenda, availability, teleconsult, clinical notes, consents, reminders, care plans, and AI syntheses with human review. It does not replace clinical judgment.",
      },
      {
        question: "How does SENTIO AI work?",
        answer:
          "It synthesizes patterns and self-care suggestions from what you log — or, in Clinics, drafts syntheses that professionals review before charting. No automatic diagnosis.",
      },
      {
        question: "Can I share entries with my psychologist?",
        answer:
          "Yes. In the app you invite professionals (Pleno/Cuidado). In Clinics, consent is purpose-based and the patient controls what to release. Pause or revoke anytime.",
      },
      {
        question: "Is my data safe?",
        answer:
          "Yes. You decide what to write, what AI analyzes, and what to share. We treat data under LGPD. In emotional emergencies, prioritize support networks and emergency services.",
      },
    ],
  },
  finalCta: {
    title: "Start understanding yourself better today",
    bodyPrefix: "Free on Essential. Move to Pleno when it makes sense.",
    cta: "Start free",
    loginLink: "I already have an account — sign in →",
  },
  footer: {
    brandBlurb:
      "supports the person’s emotional journey; Clinics runs the clinic. Self-awareness and support — they do not replace clinical assessment, diagnosis, or treatment. Built by",
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
