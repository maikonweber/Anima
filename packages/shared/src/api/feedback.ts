import { api } from "../api-client";
import type {
  FeedbackAttachmentReservation,
  FeedbackRequest,
  FeedbackResponse,
} from "../types/feedback";

/** POST /feedback — autenticado. Não enviar `project` nem `user`. */
export async function submitFeedback(payload: FeedbackRequest) {
  return api<FeedbackResponse>("/feedback", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function reserveFeedbackAttachment(file: File) {
  return api<FeedbackAttachmentReservation>("/storage/feedback/presign", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    }),
  });
}

export async function uploadFeedbackAttachment(
  file: File,
  reservation: FeedbackAttachmentReservation,
) {
  const response = await fetch(reservation.uploadUrl, {
    method: "PUT",
    headers: reservation.headers,
    body: file,
  });
  if (!response.ok) {
    throw new Error("Falha ao enviar imagem.");
  }
  return api(`/storage/${encodeURIComponent(reservation.objectId)}/confirm`, {
    method: "POST",
    auth: true,
    body: "{}",
  });
}

export async function deleteFeedbackAttachment(objectId: string) {
  return api(`/storage/${encodeURIComponent(objectId)}`, {
    method: "DELETE",
    auth: true,
  });
}
