import type { HomeDictionary } from "./home-pt";

export const homeEn = {
  nav: {
    ariaLabel: "EmotiveCare main navigation",
    howItWorks: "How it works",
    products: "Products",
    plans: "Plans",
    clinics: "Clinics",
    clinicApp: "Open Clinics",
    blog: "Blog",
    login: "Sign in",
    cta: "Start free",
    languageLabel: "Language",
  },
  hero: {
    brand: "EmotiveCare",
    eyebrow: "Continuous emotional care · SENTIO AI",
    title: "Emotional memory for people. Secure operations for clinics.",
    body: "A second brain in the person app — and EmotiveCare Clinics for CRM, scheduling, and teleconsult for the team.",
    ctaPrimary: "Start free",
    ctaSecondary: "Explore Clinics",
    ctaTertiary: "How it works",
    trustLine: "Essential free · Pleno R$ 9.99/mo · Data under LGPD",
    tagline: "It feels with you and remembers for you.",
  },
  howItWorks: {
    title: "How EmotiveCare works",
    subtitle:
      "From logging a moment to a personalized reflection — in four steps.",
    steps: [
      {
        step: "1",
        title: "Log your moment",
        text: "Free text, energy 0–100, mood, and emotions — in minutes.",
      },
      {
        step: "2",
        title: "SENTIO AI understands",
        text: "Each entry becomes patterns, needs, and a concrete action — no automatic diagnosis.",
      },
      {
        step: "3",
        title: "The second brain connects",
        text: "Semantic memory finds similar moments in your history, even weeks later.",
      },
      {
        step: "4",
        title: "You choose the next step",
        text: "Reflections in the app, share with 1 professional (Pleno), or full ops in Clinics.",
      },
    ],
  },
  secondBrain: {
    eyebrow: "The difference",
    title: "A regular journal forgets. EmotiveCare remembers.",
    bodyBefore:
      "Most apps store scattered texts. EmotiveCare organizes emotions by",
    bodyEmphasis: "meaning",
    bodyAfter: " — and the assistant brings back what matters now.",
    ordinaryLabel: "A regular journal",
    ordinaryText:
      "You log anxiety today. The text sits alone. Next week, you start from scratch.",
    withLabel: "With EmotiveCare",
    withText:
      "“Three weeks ago you felt something similar, the night before a meeting. Breathing helped.” Memory works for you.",
  },
  products: {
    title: "Three products. One brand.",
    subtitle:
      "Person app, professional between-sessions plan, and the clinic B2B suite — each in its place.",
    items: [
      {
        id: "pleno",
        eyebrow: "App · Pleno",
        title: "For people who want to understand themselves",
        text: "Journal, SENTIO AI, second brain, and share with 1 professional — R$ 9.99/mo after free Essential.",
        bullets: [
          "Unlimited journal and insights",
          "Up to 500 assistant interactions/month",
          "Sleep, stress, and burnout tracking",
        ],
        cta: "Start in the app",
        href: "register",
        tone: "person",
      },
      {
        id: "cuidado",
        eyebrow: "App · Cuidado",
        title: "For those who follow between sessions",
        text: "Professional plan in the app: read-only dashboards for patients who invite you — not the clinic chart.",
        bullets: [
          "Unlimited invite-based dashboards",
          "Sponsored Pleno (+ R$ 5/mo per linked patient)",
          "Email invite to link to the app",
        ],
        cta: "Subscribe to Cuidado",
        href: "cuidado-checkout",
        tone: "care",
      },
      {
        id: "clinicas",
        eyebrow: "EmotiveCare Clinics",
        title: "For those who run the clinic",
        text: "CRM, agenda, teleconsult, notes, consents, reminders, care plans, and human-reviewed syntheses.",
        bullets: [
          "Multi-tenant with roles and audit",
          "Teleconsult with TELECONSULTA consent",
          "Reviewable SENTIO AI syntheses",
        ],
        cta: "Explore Clinics",
        href: "clinicas",
        tone: "clinic",
      },
    ],
    clinicLoginBefore: "Already part of an organization?",
    clinicLoginCta: "Open the Clinics app →",
  },
  security: {
    title: "Real care starts with safety",
    subtitle: "Transparency about what EmotiveCare is — and what it is not.",
    items: [
      {
        title: "Does not replace therapy",
        description:
          "Self-awareness and support. No automatic diagnosis. In intense distress, seek professional help.",
      },
      {
        title: "Assistant with guardrails",
        description:
          "Focused on emotions, mood, energy, and self-care — with layers that keep care at the center.",
      },
      {
        title: "Your data is yours (LGPD)",
        description:
          "You decide what to log, what AI analyzes, and what to share — in the app and in Clinics.",
      },
    ],
  },
  plans: {
    title: "App plans",
    subtitle:
      "Essential and Pleno for the person. Cuidado for the professional in the app. Clinic ops live in EmotiveCare Clinics.",
    highlightedBadge: "Most complete",
    detailsBefore: "Details on the",
    detailsLink: "Plans",
    detailsAfter: " page.",
    clinicsBefore: "CRM, scheduling, and teleconsult:",
    clinicsLink: "EmotiveCare Clinics",
    clinicsAfter: " — or open the app directly.",
    clinicAppCta: "Open Clinics",
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
        price: "R$ 9.99/mo",
        tagline: "The second brain in your pocket.",
        features: [
          "Unlimited journal and AI",
          "Up to 500 assistant interactions/month",
          "Sleep, stress, and burnout tracking",
          "Share with 1 professional",
        ],
        cta: "I want Pleno",
        highlighted: true,
      },
      {
        name: "Cuidado",
        price: "Professional",
        tagline: "Follow those who invite you.",
        features: [
          "Unlimited invite-based dashboards",
          "Sponsored Pleno (+ R$ 5/mo per patient)",
          "Email invite to link patients",
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
          "No. It is self-awareness and emotional support. It does not diagnose, promise a cure, or replace a clinician.",
      },
      {
        question: "What is the difference between Pleno, Cuidado, and Clinics?",
        answer:
          "Pleno is the full person plan in the app. Cuidado is the professional plan in the app (invite dashboards). EmotiveCare Clinics is the B2B product: CRM, agenda, teleconsult, and notes.",
      },
      {
        question: "What is EmotiveCare Clinics?",
        answer:
          "The clinic operations suite: tenant patients, agenda, teleconsult, notes, consents, reminders, care plans, and reviewable syntheses. It does not replace clinical judgment.",
      },
      {
        question: "How does SENTIO AI work?",
        answer:
          "It synthesizes patterns and suggestions from what you log — or, in Clinics, drafts professionals review before charting.",
      },
      {
        question: "Can I share with my psychologist?",
        answer:
          "Yes. In the app via Pleno/Cuidado. In Clinics, purpose-based consent. Pause or revoke anytime.",
      },
      {
        question: "Is my data safe?",
        answer:
          "Yes. You control what to write, analyze, and share. We treat data under LGPD.",
      },
    ],
  },
  finalCta: {
    title: "Start understanding yourself — or run the clinic",
    bodyPrefix:
      "Essential free. Pleno when it makes sense. Clinics when the team needs operations.",
    cta: "Start free",
    ctaClinics: "Go to Clinics",
    loginLink: "I already have an account — sign in →",
  },
  footer: {
    brandBlurb:
      "supports the person’s journey; Clinics runs the clinic. Self-awareness and support — they do not replace assessment, diagnosis, or treatment. Built by",
    tagline: "It feels with you and remembers for you.",
    quickLinksAria: "Footer quick links",
    about: "About",
    plans: "Plans",
    clinics: "Clinics",
    clinicApp: "Open Clinics",
    faq: "FAQ",
    blog: "Blog",
    privacy: "Privacy",
    terms: "Terms",
  },
} as const satisfies HomeDictionary;
