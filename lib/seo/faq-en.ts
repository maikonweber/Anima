import type { FaqEntry } from "./faq";

/** English institutional FAQ — mirrors `faqEntries` in `faq.ts`. */
export const faqEntriesEn: FaqEntry[] = [
  {
    question: "Is EmotiveCare therapy?",
    answer:
      "No. EmotiveCare is a self-awareness and emotional support tool. It helps you organize and understand what you feel, but it does not diagnose, promise a cure, or replace care from psychologists or physicians. In moments of intense distress, it suggests seeking professional help.",
  },
  {
    question: "Does the platform make automatic diagnoses?",
    answer:
      "No. Insights are reflections on patterns and energy you report — or that a professional sees with authorized context. There is no automatic clinical assessment.",
  },
  {
    question: "How does SENTIO AI work?",
    answer:
      "SENTIO AI is EmotiveCare’s contextual engine. It synthesizes patterns, weekly trends, and self-care suggestions from the data you choose to record — always without promising automatic diagnosis or replacing clinical judgment.",
  },
  {
    question: "What is the second emotional brain?",
    answer:
      "It is how EmotiveCare stores and connects your emotions by meaning, not only by date. Using semantic search (embeddings and vector memory), it finds moments in your history similar to what you are living now and brings them into the conversation — like an emotional memory that remembers and connects the dots for you.",
  },
  {
    question: "Does it work without writing much?",
    answer:
      "Yes. You can log just energy, mood, and a few emotion tags in a few seconds. The more you write, the richer the reflections become, but EmotiveCare does not require long texts to get started.",
  },
  {
    question: "Can I share records with my psychologist?",
    answer:
      "Yes. When you want, you invite trusted professionals to view dashboards in read-only mode, according to your plan. The patient can pause or revoke access at any time.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Your records are yours: you decide what to write, what to review with AI, and what to share. We treat data carefully and in line with LGPD. Use strong passwords and seek emergency networks whenever you need immediate support.",
  },
];
