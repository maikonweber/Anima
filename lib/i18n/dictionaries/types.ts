export type NavDictionary = {
  about: string;
  plans: string;
  psychologists: string;
  clinics: string;
  clinicApp: string;
  faq: string;
  blog: string;
  contact: string;
  login: string;
  menuOpen: string;
  menuClose: string;
  ariaLabel: string;
  themeToDark: string;
  themeToLight: string;
};

export type FooterDictionary = {
  privacy: string;
  terms: string;
  resources: string;
  disclaimer: string;
};

export type CommonDictionary = {
  home: string;
  language: string;
  startFree: string;
  seePlans: string;
};

export type AboutDictionary = {
  title: string;
  introBefore: string;
  introBrand: string;
  introMid: string;
  introCompany: string;
  introDomain: string;
  introAfter: string;
  missionTitle: string;
  missionBody: string;
  sentioTitle: string;
  sentioBefore: string;
  sentioBrand: string;
  sentioAfter: string;
  whatWeDoTitle: string;
  whatWeDo: string[];
  whatWeDontTitle: string;
  whatWeDontBody: string;
  linkPlans: string;
  linkBlog: string;
  linkRegister: string;
};

export type PlanItem = {
  name: string;
  tagline: string;
  points: string[];
};

export type PlansDictionary = {
  title: string;
  intro: string;
  plans: PlanItem[];
  controlTitle: string;
  controlBody: string;
  controlFaqBefore: string;
  controlFaqLink: string;
  controlFaqMid: string;
  controlPsychLink: string;
  controlAfter: string;
  ctaRegister: string;
  ctaLogin: string;
  ctaBlog: string;
  accountNavAria: string;
};

export type FaqPageDictionary = {
  title: string;
};

export type ContactDictionary = {
  title: string;
  intro: string;
  companyLabel: string;
  companyValue: string;
  securityLabel: string;
  securityBefore: string;
  securityPath: string;
  addressNote: string;
};

export type PrivacyDictionary = {
  title: string;
  intro: string;
  controlTitle: string;
  controlBody: string;
  sentioTitle: string;
  sentioBody: string;
  legalNote: string;
};

export type PsychologistsDictionary = {
  title: string;
  introBefore: string;
  introMode: string;
  introAfter: string;
  howTitle: string;
  howSteps: string[];
  idealTitle: string;
  idealItems: string[];
  ethicsTitle: string;
  ethicsBefore: string;
  ethicsLink: string;
  ethicsAfter: string;
  ethicsArticleSlug: string;
  ctaRegister: string;
  ctaPlans: string;
  ctaFaq: string;
  ctaClinics: string;
  flowNavAria: string;
};

export type ClinicsDictionary = {
  title: string;
  eyebrow: string;
  intro: string;
  splitTitle: string;
  splitBody: string;
  modulesTitle: string;
  modules: Array<{ title: string; text: string }>;
  forWhomTitle: string;
  forWhom: string[];
  ethicsTitle: string;
  ethicsBody: string;
  ctaOpen: string;
  ctaPlans: string;
  ctaPsych: string;
};

export type ExternalResource = {
  name: string;
  href: string;
  note: string;
};

export type ResourcesDictionary = {
  title: string;
  intro: string;
  articlesTitle: string;
  seeAllArticles: string;
  externalTitle: string;
  external: ExternalResource[];
  linkFaq: string;
  linkPsychologists: string;
  linkPlans: string;
  exploreNavAria: string;
};

export type TermsDictionary = {
  title: string;
  intro: string;
};

export type AuthDictionary = {
  loginTitle: string;
  loginSubtitle: string;
  registerTitle: string;
  registerSubtitle: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  namePlaceholder: string;
  passwordPlaceholder: string;
  passwordMinPlaceholder: string;
  confirmPasswordPlaceholder: string;
  forgotPassword: string;
  submitLogin: string;
  submitRegister: string;
  or: string;
  noAccount: string;
  createAccount: string;
  hasAccount: string;
  goLogin: string;
  forgotTitle: string;
  forgotSubtitle: string;
  resetTitle: string;
  resetSubtitle: string;
  newPassword: string;
  loading: string;
};

export type BlogDictionary = {
  tocLabel: string;
  inThisArticle: string;
  faq: string;
  conclusion: string;
  keepReading: string;
  backToArticles: string;
  crisisNote: string;
  languageLabel: string;
  indexTitle: string;
  indexIntro: string;
  notFoundTitle: string;
};

export type MarketingDictionary = {
  nav: NavDictionary;
  footer: FooterDictionary;
  common: CommonDictionary;
  about: AboutDictionary;
  plans: PlansDictionary;
  faq: FaqPageDictionary;
  contact: ContactDictionary;
  privacy: PrivacyDictionary;
  psychologists: PsychologistsDictionary;
  clinics: ClinicsDictionary;
  resources: ResourcesDictionary;
  terms: TermsDictionary;
  auth: AuthDictionary;
  blog: BlogDictionary;
};
