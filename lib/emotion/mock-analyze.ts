import type { BaseEmotionId, EmotionalAnalysis } from "./types";
import { BASE_EMOTIONS } from "./base-emotions";
import { getBlend } from "./blends";
import { normalizePairKey } from "./utils";

const KEYWORD_MAP: Record<string, BaseEmotionId> = {
  feliz: "joy",
  alegre: "joy",
  contente: "joy",
  animado: "joy",
  empolgado: "joy",
  grato: "joy",
  satisfeito: "joy",
  bem: "joy",

  triste: "sadness",
  cansado: "sadness",
  exausto: "sadness",
  desanimado: "sadness",
  sozinho: "sadness",
  vazio: "sadness",
  deprimido: "sadness",
  saudade: "sadness",
  melancólico: "sadness",

  medo: "fear",
  ansioso: "fear",
  preocupado: "fear",
  inseguro: "fear",
  nervoso: "fear",
  tenso: "fear",
  apreensivo: "fear",
  pânico: "fear",

  raiva: "anger",
  irritado: "anger",
  bravo: "anger",
  furioso: "anger",
  frustrado: "anger",
  revoltado: "anger",
  estressado: "anger",
  indignado: "anger",

  nojo: "disgust",
  enojado: "disgust",
  repulsa: "disgust",
  decepcionado: "disgust",
  enjoado: "disgust",

  surpreso: "surprise",
  chocado: "surprise",
  impressionado: "surprise",
  espantado: "surprise",
  perplexo: "surprise",
};

function detectEmotions(text: string): BaseEmotionId[] {
  const lower = text.toLowerCase();
  const found = new Set<BaseEmotionId>();
  for (const [keyword, emotionId] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) {
      found.add(emotionId);
    }
  }
  if (found.size === 0) {
    found.add("sadness");
  }
  return Array.from(found);
}

export function mockAnalyzeEmotions(text: string): EmotionalAnalysis {
  const detectedIds = detectEmotions(text);
  const baseEmotions = detectedIds.map((id) => ({ id, confidence: 0.8 }));

  const primaryPair =
    detectedIds.length >= 2
      ? ([detectedIds[0], detectedIds[1]] as [BaseEmotionId, BaseEmotionId])
      : ([detectedIds[0], detectedIds[0]] as [BaseEmotionId, BaseEmotionId]);

  const blend = getBlend(primaryPair[0], primaryPair[1]);

  if (blend) {
    return {
      baseEmotions,
      composite: {
        blendKey: normalizePairKey(primaryPair[0], primaryPair[1]),
        name: blend.composite.name,
        description: blend.composite.description,
        energy: blend.composite.energy,
      },
      insight: generateInsight(blend.composite.name),
    };
  }

  const singleEmotion = BASE_EMOTIONS[primaryPair[0]];
  return {
    baseEmotions,
    composite: {
      blendKey: singleEmotion.id,
      name: singleEmotion.name,
      description: singleEmotion.description,
      energy: singleEmotion.energy,
    },
    insight: generateInsight(singleEmotion.name),
  };
}

function generateInsight(emotionName: string): string {
  const insights: Record<string, string> = {
    Mágoa:
      "Reconhecer a mágoa é o primeiro passo para transformar dor em compreensão. Permita-se sentir sem julgamento.",
    Nostalgia:
      "A nostalgia nos lembra que já vivemos momentos bonitos — e que podemos criar novos.",
    Angústia:
      "A angústia é um sinal de que algo precisa de atenção. Respire fundo e procure apoio se necessário.",
    Excitação:
      "Essa energia vibrante é um convite para agir com coragem. Aproveite esse impulso.",
    Triunfo:
      "Você superou algo importante. Reconheça sua força e celebre essa conquista.",
    Frustração:
      "A frustração mostra que você se importa. Use-a como combustível para encontrar novos caminhos.",
    Hostilidade:
      "Quando medo e raiva se encontram, seu corpo está pedindo segurança. Busque um momento de calma.",
    Desprezo:
      "Esse sentimento pode indicar limites importantes que precisam ser respeitados.",
  };

  return (
    insights[emotionName] ??
    `Você está sentindo ${emotionName.toLowerCase()}. Acolha esse sentimento com gentileza — ele faz parte da sua jornada.`
  );
}
