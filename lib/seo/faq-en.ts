import type { FaqEntry } from "./faq";

/** English institutional FAQ — mirrors `faqEntries` (SEO + GEO). */
export const faqEntriesEn: FaqEntry[] = [
  {
    question: "What is EmotiveCare?",
    answer:
      "EmotiveCare is a MutterCorp platform with two surfaces: (1) a personal emotional second-brain app with journal and SENTIO AI; (2) EmotiveCare Clinics, a B2B product for psychologists and psychiatrists with CRM, scheduling, teleconsult, clinical notes, and reviewable clinical AI. It is not therapy and does not replace assessment or treatment.",
  },
  {
    question: "How does EmotiveCare work as an emotional second brain?",
    answer:
      "For personal use (Essential and Pleno), you log emotions and energy; SENTIO AI reflects patterns; semantic memory connects similar moments in your history by meaning, not only by date. Pleno (R$ 9.99/mo) adds tracking, an assistant (up to 500 interactions/month), and sharing the dashboard with 1 professional.",
  },
  {
    question: "Is EmotiveCare therapy?",
    answer:
      "No. It is self-awareness and digital emotional support. It does not diagnose, promise a cure, or replace a psychologist, psychiatrist, or physician. In intense distress, seek professional help and emergency services.",
  },
  {
    question: "What is the difference between Pleno, Cuidado, and EmotiveCare Clinics?",
    answer:
      "Pleno is the full person plan in the app (second brain, tracking, 1 professional). Cuidado is the professional plan in the app: read-only dashboards for patients who invite you — no CRM/agenda. EmotiveCare Clinics is a separate product: clinic operations (CRM, scheduling, teleconsult, notes, consents, and human-reviewed AI syntheses).",
  },
  {
    question: "What do psychologists and psychiatrists get in EmotiveCare Clinics?",
    answer:
      "Clinical features: patient CRM, scheduling and availability, teleconsult with consent, clinical notes, purpose-based consents (LGPD), reminders, care plans, human-reviewed alerts, curated knowledge base, and SENTIO AI syntheses that clinicians review before charting. Multi-tenant with roles and audit.",
  },
  {
    question: "Does SENTIO AI replace clinical judgment?",
    answer:
      "No. In the personal app, AI suggests reflections and self-care without automatic diagnosis. In Clinics, it drafts syntheses that require human review. Psychologists and psychiatrists keep interpretation and clinical responsibility.",
  },
  {
    question: "Can psychologists and psychiatrists use the Cuidado plan?",
    answer:
      "Yes. Cuidado is for professionals in the EmotiveCare app: follow read-only dashboards when patients invite you. It fits psychologists, psychiatrists, and other authorized companions. To run the clinic (CRM, agenda, teleconsult), use EmotiveCare Clinics.",
  },
  {
    question: "Can I share records with my psychologist or psychiatrist?",
    answer:
      "Yes. In the app via Pleno/Cuidado invites with pause/revoke. In Clinics, consent is purpose-based (e.g. TELECONSULTA, PRONTUARIO, DIARIO_CHECKIN) and the patient controls what to release.",
  },
  {
    question: "Is my data secure (LGPD)?",
    answer:
      "Yes. You decide what to log, what AI analyzes, and what to share. Clinics add granular consent, roles, and audit. We treat data under Brazil’s LGPD.",
  },
];
