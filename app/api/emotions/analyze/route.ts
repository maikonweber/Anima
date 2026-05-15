import { mockAnalyzeEmotions } from "@/lib/emotion/mock-analyze";

/**
 * POST /api/emotions/analyze
 *
 * Expected request body:
 *   { text: string }
 *
 * Expected response (AnalyzeEmotionResponse):
 *   {
 *     baseEmotions: [{ id: "joy"|"sadness"|"fear"|"anger"|"disgust"|"surprise", confidence?: number }],
 *     composite: { blendKey: string, name: string, description: string, energy: number },
 *     insight?: string
 *   }
 *
 * This stub uses the local mock analyzer.
 * Replace with OpenRouter integration on the backend.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";

    if (!text) {
      return Response.json(
        { error: "O campo 'text' é obrigatório." },
        { status: 400 },
      );
    }

    const analysis = mockAnalyzeEmotions(text);
    return Response.json(analysis);
  } catch {
    return Response.json(
      { error: "Não foi possível processar a solicitação." },
      { status: 500 },
    );
  }
}
