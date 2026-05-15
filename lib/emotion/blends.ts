import type { BaseEmotionId, EmotionBlend } from "./types";
import { normalizePairKey } from "./utils";

const BLEND_DEFINITIONS: EmotionBlend[] = [
  {
    a: "joy",
    b: "sadness",
    composite: {
      name: "Nostalgia",
      description:
        "Uma saudade doce de momentos passados, onde alegria e tristeza coexistem em harmonia.",
      energy: 55,
    },
  },
  {
    a: "joy",
    b: "fear",
    composite: {
      name: "Excitação",
      description:
        "A energia vibrante de enfrentar o desconhecido com entusiasmo e coragem.",
      energy: 65,
    },
  },
  {
    a: "joy",
    b: "anger",
    composite: {
      name: "Triunfo",
      description:
        "A satisfação intensa de superar obstáculos e provar sua força interior.",
      energy: 72,
    },
  },
  {
    a: "joy",
    b: "disgust",
    composite: {
      name: "Ironia",
      description:
        "Um riso amargo diante do absurdo, misturando prazer com desaprovação.",
      energy: 62,
    },
  },
  {
    a: "joy",
    b: "surprise",
    composite: {
      name: "Êxtase",
      description:
        "Um momento de pura euforia quando algo maravilhoso acontece inesperadamente.",
      energy: 70,
    },
  },
  {
    a: "sadness",
    b: "fear",
    composite: {
      name: "Angústia",
      description:
        "Um aperto no peito que vem da incerteza combinada com a dor emocional.",
      energy: 45,
    },
  },
  {
    a: "sadness",
    b: "anger",
    composite: {
      name: "Mágoa",
      description:
        "Uma dor emocional causada por desgaste e conflito interno.",
      energy: 52,
    },
  },
  {
    a: "sadness",
    b: "disgust",
    composite: {
      name: "Repulsa melancólica",
      description:
        "A tristeza de se deparar com algo que fere seus valores profundos.",
      energy: 42,
    },
  },
  {
    a: "sadness",
    b: "surprise",
    composite: {
      name: "Frustração",
      description:
        "O choque de uma expectativa quebrada que deixa um gosto amargo de decepção.",
      energy: 50,
    },
  },
  {
    a: "fear",
    b: "anger",
    composite: {
      name: "Hostilidade",
      description:
        "Uma defesa agressiva que nasce do medo de ser vulnerável ou atacado.",
      energy: 62,
    },
  },
  {
    a: "fear",
    b: "disgust",
    composite: {
      name: "Aversão",
      description:
        "Uma rejeição visceral motivada pelo medo do que é percebido como ameaçador.",
      energy: 52,
    },
  },
  {
    a: "fear",
    b: "surprise",
    composite: {
      name: "Alarme",
      description:
        "O susto intenso que ativa todos os sentidos em alerta máximo.",
      energy: 60,
    },
  },
  {
    a: "anger",
    b: "disgust",
    composite: {
      name: "Desprezo",
      description:
        "Uma rejeição fria e decidida, combinando indignação com repúdio moral.",
      energy: 60,
    },
  },
  {
    a: "anger",
    b: "surprise",
    composite: {
      name: "Indignação",
      description:
        "A raiva instantânea diante de algo inesperadamente injusto ou ofensivo.",
      energy: 67,
    },
  },
  {
    a: "disgust",
    b: "surprise",
    composite: {
      name: "Choque",
      description:
        "A repulsa súbita ao se deparar com algo inesperadamente perturbador.",
      energy: 57,
    },
  },
];

export const BLEND_MAP = new Map<string, EmotionBlend>(
  BLEND_DEFINITIONS.map((b) => [normalizePairKey(b.a, b.b), b]),
);

export function getBlend(
  a: BaseEmotionId,
  b: BaseEmotionId,
): EmotionBlend | undefined {
  return BLEND_MAP.get(normalizePairKey(a, b));
}

export { BLEND_DEFINITIONS };
