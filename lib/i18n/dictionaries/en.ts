import type { MarketingDictionary } from "./types";

export const en: MarketingDictionary = {
  nav: {
    about: "About",
    plans: "Plans",
    psychologists: "Cuidado",
    clinics: "Clinics",
    clinicApp: "Open Clinics",
    faq: "FAQ",
    blog: "Blog",
    contact: "Contact",
    login: "Sign in",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    ariaLabel: "Institutional links",
    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
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
      "To offer a second emotional brain for the person — and, in EmotiveCare Clinics, a safe operation for the practice. A journal with meaning, consented links, and tools that respect the boundary between digital support and human clinical care.",
    sentioTitle: "SENTIO AI and MutterCorp",
    sentioBefore: "",
    sentioBrand: "SENTIO AI",
    sentioAfter:
      "builds contextual reflections from what you log — and, in Clinics, synthesis drafts professionals review. MutterCorp holds privacy (LGPD) and responsible communication about emotional health.",
    whatWeDoTitle: "What we do",
    whatWeDo: [
      "EmotiveCare app: journal, SENTIO AI, summaries, and memory-backed assistant (Pleno).",
      "Cuidado plan: read-only dashboards for professionals invited by the patient.",
      "EmotiveCare Clinics: CRM, agenda, teleconsult, notes, and consents per organization.",
      "Care plans, reminders, and human-reviewed syntheses in clinic ops.",
      "Support tools — never automated treatment or AI diagnosis.",
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
      "Essential and Pleno are for the person in the app. Cuidado is the professional plan in the app (invite-based follow-up). Clinic operations — CRM, agenda, teleconsult — live in EmotiveCare Clinics, a separate product. You control what to log, what SENTIO AI analyzes, and what to share.",
    plans: [
      {
        name: "Essential",
        tagline: "To start understanding yourself.",
        points: [
          "Emotional energy journal (text, energy 0–100, mood, and tags)",
          "SENTIO AI analysis per entry",
          "Weekly summary of your emotional journey",
        ],
      },
      {
        name: "Pleno",
        tagline: "R$ 9.99/mo — a second brain in your pocket.",
        points: [
          "Everything in Essential, without monthly caps on journal and AI",
          "Up to 500 assistant interactions per month",
          "Tracking for sleep, stress, socialization, and burnout",
          "Share dashboard with 1 trusted professional",
        ],
      },
      {
        name: "Cuidado",
        tagline: "For those who follow between sessions.",
        points: [
          "Unlimited patient dashboards authorized by the patient",
          "Emotional context in read-only mode between appointments",
          "Linked patients inherit Pleno-equivalent benefits",
        ],
      },
    ],
    controlTitle: "Control, privacy, and two products",
    controlBody:
      "No plan turns EmotiveCare into therapy or automatic diagnosis. The app (Essential/Pleno/Cuidado) and EmotiveCare Clinics are different surfaces: one supports the person’s journey; the other runs the clinic with roles, audit, and purpose-based consent.",
    controlFaqBefore: "Questions are in the",
    controlFaqLink: "FAQ",
    controlFaqMid: ". Invite-based follow-up under",
    controlPsychLink: "Cuidado plan",
    controlAfter: "; clinic operations in EmotiveCare Clinics.",
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
    title: "Cuidado plan — between sessions",
    introBefore:
      "Between appointments, a patient’s emotional context often disappears. With the",
    introMode: "Cuidado plan",
    introAfter:
      ", professionals follow read-only dashboards — only when the patient invites them. This is not the clinic chart: that lives in EmotiveCare Clinics.",
    howTitle: "How it works in practice",
    howSteps: [
      "The patient logs emotions and energy in the EmotiveCare app.",
      "With Pleno (or an inherited benefit), they send a secure invite.",
      "On Cuidado, you see progress and trends in read-only mode.",
      "The patient pauses or revokes access whenever they want.",
    ],
    idealTitle: "Ideal for",
    idealItems: [
      "Psychologists in ongoing care;",
      "Professionals who want longitudinal context before sessions;",
      "Anyone who needs light digital follow-up without running clinic CRM or scheduling.",
    ],
    ethicsTitle: "Ethical boundaries",
    ethicsBefore:
      "SENTIO AI synthesizes what the patient recorded; clinical interpretation remains yours. The platform does not diagnose, prescribe, or replace listening. For CRM, agenda, and teleconsult use EmotiveCare Clinics. Also read",
    ethicsLink: "How psychologists use the dashboard between sessions",
    ethicsAfter: ".",
    ethicsArticleSlug: "como-profissionais-usam-dashboard-terapeutico",
    ctaRegister: "Start as a professional",
    ctaPlans: "See Cuidado plan",
    ctaFaq: "FAQ",
    ctaClinics: "Explore Clinics",
    flowNavAria: "Cuidado professional flow",
  },
  clinics: {
    eyebrow: "Product for healthcare professionals",
    title: "EmotiveCare Clinics",
    intro:
      "The clinic operations suite: tenant patients, scheduling, teleconsult, notes, and consents — separate from the personal journal in the EmotiveCare app.",
    splitTitle: "Clinics ≠ Cuidado ≠ Pleno",
    splitBody:
      "Pleno is the person’s full journey in the app. Cuidado is the professional plan for invite-based dashboards. Clinics is multi-tenant: CRM, roles, audit, and clinical workflows for the organization.",
    modulesTitle: "What is already in the product",
    modules: [
      {
        title: "Patient CRM",
        text: "Registration, funnel (lead → active → discharge), contacts, and status history per organization.",
      },
      {
        title: "Agenda and availability",
        text: "Sessions, confirmation, rescheduling, and the professional’s weekly grid.",
      },
      {
        title: "Teleconsult",
        text: "Authenticated room with join-by-code — aligned to the scheduled session.",
      },
      {
        title: "Notes and syntheses",
        text: "Clinical notes with signature/addendum and SENTIO AI syntheses reviewed before charting.",
      },
      {
        title: "Consents and diary",
        text: "Purpose-based consent; app diary only enters the clinic with authorization — including per entry.",
      },
      {
        title: "Care plans and reminders",
        text: "Items released to the patient, upcoming sessions, and in-app medication/activity reminders.",
      },
    ],
    forWhomTitle: "Who it is for",
    forWhom: [
      "Multi-professional clinics and practices",
      "Psychologists who need operations beyond between-session dashboards",
      "Teams with secretary, admin, and DPO in distinct roles",
    ],
    ethicsTitle: "Ethics and responsibility",
    ethicsBody:
      "Clinics organizes clinical work; it does not replace professional judgment. AI syntheses require human review. Consent and audit follow access to sensitive data.",
    ctaOpen: "Open Clinics",
    ctaPlans: "See app plans",
    ctaPsych: "Cuidado plan",
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
