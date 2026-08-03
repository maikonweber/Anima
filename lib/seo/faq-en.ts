import type { FaqEntry } from "./faq";

/** English institutional FAQ — mirrors `faqEntries` in `faq.ts`. */
export const faqEntriesEn: FaqEntry[] = [
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
    question: "What is the emotional second brain?",
    answer:
      "It is how EmotiveCare connects emotions by meaning, not only by date. With semantic search, it finds moments in your history similar to now and brings them into the conversation.",
  },
  {
    question: "Can I share records with my psychologist?",
    answer:
      "Yes. In the app you invite professionals (Pleno/Cuidado). In Clinics, consent is purpose-based and the patient controls what to release. Pause or revoke anytime.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. You decide what to write, what AI analyzes, and what to share. We treat data under LGPD. In emotional emergencies, prioritize support networks and emergency services.",
  },
];
