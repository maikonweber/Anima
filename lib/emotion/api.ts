import type { AnalyzeEmotionRequest, AnalyzeEmotionResponse } from "./types";
import { mockAnalyzeEmotions } from "./mock-analyze";

const USE_MOCK =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_USE_MOCK_EMOTIONS === "true";

/**
 * Analyze emotional content from free text.
 * Calls the backend API, falling back to a local mock when
 * the env flag is set or the API is unavailable (404/501).
 */
export async function analyzeEmotions(
  text: string,
): Promise<AnalyzeEmotionResponse> {
  if (USE_MOCK) {
    return simulateDelay(mockAnalyzeEmotions(text));
  }

  try {
    const res = await fetch("/api/emotions/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text } satisfies AnalyzeEmotionRequest),
    });

    if (res.status === 404 || res.status === 501) {
      return simulateDelay(mockAnalyzeEmotions(text));
    }

    if (!res.ok) {
      throw new Error(`Erro ao analisar emoções (${res.status})`);
    }

    return (await res.json()) as AnalyzeEmotionResponse;
  } catch (err) {
    if (err instanceof TypeError) {
      // Network error — fallback to mock
      return simulateDelay(mockAnalyzeEmotions(text));
    }
    throw err;
  }
}

function simulateDelay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 800));
}
