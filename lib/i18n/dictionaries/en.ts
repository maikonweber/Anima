import type { MarketingDictionary } from "./types";

export const en: MarketingDictionary = {
  nav: {
    about: "About",
    plans: "Plans",
    psychologists: "Psychologists",
    faq: "FAQ",
    blog: "Blog",
    contact: "Contact",
    login: "Sign in",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    ariaLabel: "Institutional links",
  },
  footer: {
    privacy: "Privacy",
    terms: "Terms",
    resources: "Resources",
    disclaimer:
      "EmotiveCare · MutterCorp · SENTIO AI. Does not replace specialized clinical assessment.",
  },
  common: {
    home: "Home",
    language: "Language",
    startFree: "Start free",
    seePlans: "See plans",
  },
  about: {
    title: "About EmotiveCare",
    introBefore: "",
    introBrand: "EmotiveCare",
    introMid:
      "exists to be a human–technology infrastructure where people log emotions, understand patterns over time, and keep safe connections with professionals when they choose. The product is built by",
    introCompany: "MutterCorp",
    introDomain: "emotivecare.com.br",
    introAfter: ", with a public presence at",
    missionTitle: "Mission",
    missionBody:
      "To offer a second emotional brain: a journal that not only stores text, but connects meaning, returns honest reflections, and respects the boundary between digital support and human clinical care.",
    sentioTitle: "SENTIO AI and MutterCorp",
    sentioBefore: "",
    sentioBrand: "SENTIO AI",
    sentioAfter:
      "builds contextual reflections from the information you choose to record — with semantic search across your history and linguistic guardrails. MutterCorp holds this ecosystem together with privacy (LGPD) and responsible communication about emotional health.",
    whatWeDoTitle: "What we do",
    whatWeDo: [
      "Emotional energy journal guided by contextual AI.",
      "Timeline with longitudinal memory and weekly summaries.",
      "Assistant focused on emotions, mood, energy, and self-care.",
      "Shareable dashboards only with patient consent.",
      "Self-awareness tools — not automated treatment.",
    ],
    whatWeDontTitle: "What we don’t do",
    whatWeDontBody:
      "We don’t replace therapy, we don’t issue automatic diagnoses, and we don’t promise a cure. In intense distress, the platform guides you to seek professional help and emergency services.",
    linkPlans: "See plans",
    linkBlog: "Read the blog",
    linkRegister: "Create my account",
  },
  plans: {
    title: "EmotiveCare plans",
    intro:
      "Choose the level of support that makes sense right now. You always control what to record, when to ask SENTIO AI for insights, and who can see shared information. Current limits and pricing appear in the authenticated area, with secure checkout.",
    plans: [
      {
        name: "Essential",
        tagline: "To start understanding yourself.",
        points: [
          "Emotional energy journal (text, energy 0–100, mood, and tags)",
          "Emotional analysis with SENTIO AI per entry",
          "Weekly summary of your emotional journey",
        ],
      },
      {
        name: "Full",
        tagline: "A second brain in your pocket.",
        points: [
          "Everything in Essential",
          "Emotional assistant with semantic memory of your history",
          "Tracking for sleep, stress, socialization, and burnout",
          "Sharing with a trusted professional",
        ],
      },
      {
        name: "Care",
        tagline: "For psychologists and clinical follow-up.",
        points: [
          "Care Mode with invitations controlled by the patient",
          "Read-only dashboards between sessions",
          "Longitudinal context to enrich listening — without replacing it",
        ],
      },
    ],
    controlTitle: "Control, privacy, and responsible AI",
    controlBody:
      "No plan turns EmotiveCare into therapy or automatic diagnosis. SENTIO AI describes patterns from what you record; sharing with professionals only happens with your consent and can be revoked.",
    controlFaqBefore: "Common questions are in the",
    controlFaqLink: "FAQ",
    controlFaqMid: ". Professionals can find the invitation flow in",
    controlPsychLink: "EmotiveCare for psychologists",
    controlAfter: ".",
    ctaRegister: "Get started",
    ctaLogin: "Already a user · Sign in",
    ctaBlog: "Read the blog",
    accountNavAria: "Account actions",
  },
  faq: {
    title: "Frequently asked questions",
  },
  contact: {
    title: "Contact",
    intro:
      "You can already get started using the in-app form after creating an account. For partnerships, press, and privacy, use the official addresses configured by MutterCorp.",
    companyLabel: "Operating company",
    companyValue: "MutterCorp — EmotiveCare & SENTIO AI infrastructure.",
    securityLabel: "Security support",
    securityBefore: "See the public file",
    securityPath: "/.well-known/security.txt",
    addressNote:
      "This page only consolidates institutional contacts; there is no data collection on this route.",
  },
  privacy: {
    title: "Privacy",
    intro:
      "EmotiveCare centralizes sensitive records about emotions, reported energy, everyday health markers (such as habits), and free text optionally shared with providers when authorized by the patient.",
    controlTitle: "Data under your control",
    controlBody:
      "You decide the level of detail, labels, or metadata. Invited professionals see only what was agreed through invitations, and access can be paused or revoked immediately.",
    sentioTitle: "SENTIO AI",
    sentioBody:
      "Automated insights come only from what you already chose to feed into the app — with no diagnosis promising automated cure, only contextual reflections.",
    legalNote:
      "Detailed contractual documentation may be updated once the legal team publishes versioned policies.",
  },
  psychologists: {
    title: "EmotiveCare for professionals",
    introBefore:
      "Between sessions, a patient’s emotional context often gets lost. With",
    introMode: "Care Mode",
    introAfter:
      ", EmotiveCare offers read-only dashboards, energy trends, and structured summaries — only when the patient consciously invites you.",
    howTitle: "How it works in practice",
    howSteps: [
      "The patient logs emotions and energy in the journal.",
      "They send a secure invitation to the professional.",
      "You follow progress on dedicated panels (read-only).",
      "The patient can pause or revoke access at any time.",
    ],
    idealTitle: "Ideal for",
    idealItems: [
      "Psychologists in ongoing care;",
      "Professionals who want to enrich pre-session prep with longitudinal context;",
      "Clinics that need moderate digital follow-up with explicit consent.",
    ],
    ethicsTitle: "Ethical boundaries",
    ethicsBefore:
      "SENTIO AI synthesizes what the patient recorded; clinical interpretation remains yours. The platform does not diagnose, prescribe, or replace listening. Also read the article",
    ethicsLink: "How psychologists use the dashboard between sessions",
    ethicsAfter: ".",
    ethicsArticleSlug: "como-profissionais-usam-dashboard-terapeutico",
    ctaRegister: "Start as a professional",
    ctaPlans: "See Care plan",
    ctaFaq: "FAQ",
    flowNavAria: "Professional flow",
  },
  resources: {
    title: "Resources",
    intro:
      "Materials for emotional self-awareness and responsible AI use. EmotiveCare is complementary support — in a crisis, prioritize emergency networks and mental health professionals.",
    articlesTitle: "EmotiveCare articles",
    seeAllArticles: "See all articles →",
    externalTitle: "External support",
    external: [
      {
        name: "CVV — Centro de Valorização da Vida",
        href: "https://www.cvv.org.br/",
        note: "Free emotional support 24/7 in Brazil (call 188).",
      },
      {
        name: "Brazilian Ministry of Health — mental health",
        href: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental",
        note: "Official information and care network.",
      },
    ],
    linkFaq: "Institutional FAQ",
    linkPsychologists: "For psychologists",
    linkPlans: "Plans",
    exploreNavAria: "Explore content",
  },
  terms: {
    title: "Platform terms",
    intro:
      "EmotiveCare Terms of Use, Commitment, and Responsibility. By using the platform, you agree to the conditions below.",
  },
  auth: {
    loginTitle: "Welcome back",
    loginSubtitle:
      "Your gateway to a platform for continuous emotional care",
    registerTitle: "Create your account",
    registerSubtitle:
      "Start your journey with EmotiveCare, your second emotional brain — simple and welcoming",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    name: "Name",
    namePlaceholder: "What should we call you?",
    passwordPlaceholder: "Your password",
    passwordMinPlaceholder: "At least 6 characters",
    confirmPasswordPlaceholder: "Repeat your password",
    forgotPassword: "Forgot your password?",
    submitLogin: "Sign in",
    submitRegister: "Create account",
    or: "or",
    noAccount: "Don’t have an account yet?",
    createAccount: "Create account",
    hasAccount: "Already have an account?",
    goLogin: "Sign in",
    forgotTitle: "Forgot my password",
    forgotSubtitle: "We’ll send a link to reset your password",
    resetTitle: "New password",
    resetSubtitle: "Choose a secure password for your account",
    newPassword: "New password",
    loading: "Loading...",
  },
  blog: {
    tocLabel: "Article outline",
    inThisArticle: "In this article",
    faq: "Frequently asked questions",
    conclusion: "Conclusion",
    keepReading: "Keep reading",
    backToArticles: "Back to articles",
    crisisNote:
      "If you are experiencing persistent distress or thoughts of self-harm, seek emergency services and mental health professionals near you immediately.",
    languageLabel: "Language",
    indexTitle: "EmotiveCare Blog",
    indexIntro:
      "Updated articles with direct answers on self-awareness, burnout, user-reported mild anxiety, and ethical patient–professional follow-up.",
    notFoundTitle: "Article not found",
  },
};
