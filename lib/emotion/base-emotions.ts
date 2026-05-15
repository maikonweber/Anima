import type { BaseEmotion, BaseEmotionId } from "./types";

export const BASE_EMOTIONS: Record<BaseEmotionId, BaseEmotion> = {
  joy: {
    id: "joy",
    name: "Alegria",
    color: "#F5D76E",
    energy: 75,
    description: "Sensação de contentamento, prazer e bem-estar interior.",
    icon: "🙂",
  },
  sadness: {
    id: "sadness",
    name: "Tristeza",
    color: "#7EB8DA",
    energy: 35,
    description: "Sentimento de perda, vazio ou melancolia profunda.",
    icon: "😢",
  },
  fear: {
    id: "fear",
    name: "Medo",
    color: "#B8A4E8",
    energy: 55,
    description: "Resposta a ameaças percebidas, incerteza ou vulnerabilidade.",
    icon: "😨",
  },
  anger: {
    id: "anger",
    name: "Raiva",
    color: "#E88B8B",
    energy: 70,
    description: "Reação intensa a injustiças, frustrações ou limites violados.",
    icon: "😠",
  },
  disgust: {
    id: "disgust",
    name: "Nojo",
    color: "#7BC67E",
    energy: 50,
    description: "Aversão a algo que contraria valores ou sensibilidades.",
    icon: "🤢",
  },
  surprise: {
    id: "surprise",
    name: "Surpresa",
    color: "#F5A962",
    energy: 65,
    description: "Reação ao inesperado, podendo ser positiva ou negativa.",
    icon: "😮",
  },
};

export const BASE_EMOTION_IDS = Object.keys(BASE_EMOTIONS) as BaseEmotionId[];
