import type { ClinicUiDictionary } from "./clinic-ui-pt";

export const clinicUiEn = {
  common: {
    loading: "Loading...",
    logout: "Sign out",
    language: "Language",
    backToApp: "Personal app",
    organizations: "Organizations",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  brand: {
    product: "EmotiveCare",
    clinics: "Clinics",
  },
  nav: {
    overview: "Overview",
    overviewShort: "Home",
    patients: "Patients",
    patientsShort: "CRM",
    agenda: "Schedule",
    availability: "Availability",
    availabilityShort: "Hours",
    knowledge: "Knowledge",
    knowledgeShort: "RAG",
    alerts: "Alerts",
    crisis: "Crisis resources",
    crisisShort: "Crisis",
    audit: "Audit",
    auditShort: "Logs",
  },
  patientTabs: {
    summary: "Summary",
    diary: "Journal",
    notes: "Clinical notes",
    consents: "Consents",
    reminders: "Reminders",
    carePlan: "Care plan",
    syntheses: "AI syntheses",
    alerts: "Alerts",
    appLink: "App link",
  },
  pages: {
    overview: "Overview",
    patients: "Patients",
    agenda: "Schedule",
    alerts: "Pending alerts",
    crisis: "Crisis resources",
    knowledge: "Clinical knowledge",
    audit: "Audit",
  },
  roles: {
    professional: "Professional",
    secretary: "Secretary",
    admin: "Administrator",
    dpo: "DPO",
    patient: "Patient",
  },
  quickActions: {
    patients: {
      title: "Patient CRM",
      subtitle: "Registration, funnel, and contacts",
    },
    agenda: {
      title: "Schedule",
      subtitle: "Sessions, confirmation, and availability",
    },
    alerts: {
      title: "Pending alerts",
      subtitle: "Human review (RF-072)",
    },
    knowledge: {
      title: "Clinical knowledge",
      subtitle: "Curated base for syntheses",
    },
    crisis: {
      title: "Crisis resources",
      subtitle: "Support channels (RF-042)",
    },
    audit: {
      title: "Audit",
      subtitle: "Organization action trail",
    },
  },
} as const satisfies ClinicUiDictionary;
