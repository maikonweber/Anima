export type FeedbackType =
  | "support"
  | "bug"
  | "feature"
  | "praise"
  | "other";

export type FeedbackRequest = {
  type: FeedbackType;
  subject?: string;
  message: string;
  contact?: string;
  page?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type FeedbackResponse = {
  ok: true;
  id?: string | null;
};

export const FEEDBACK_TYPE_OPTIONS: {
  value: FeedbackType;
  label: string;
}[] = [
  { value: "support", label: "Preciso de ajuda" },
  { value: "bug", label: "Encontrei um problema" },
  { value: "feature", label: "Sugestão" },
  { value: "praise", label: "Elogio" },
  { value: "other", label: "Outro" },
];
