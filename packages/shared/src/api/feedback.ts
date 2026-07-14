import { api } from "../api-client";
import type { FeedbackRequest, FeedbackResponse } from "../types/feedback";

/** POST /feedback — autenticado. Não enviar `project` nem `user`. */
export async function submitFeedback(payload: FeedbackRequest) {
  return api<FeedbackResponse>("/feedback", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}
