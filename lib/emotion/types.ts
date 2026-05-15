export type BaseEmotionId =
  | "joy"
  | "sadness"
  | "fear"
  | "anger"
  | "disgust"
  | "surprise";

export interface BaseEmotion {
  id: BaseEmotionId;
  name: string;
  color: string;
  energy: number;
  description: string;
  icon: string;
}

export interface CompositeEmotion {
  name: string;
  description: string;
  energy: number;
}

export interface EmotionBlend {
  a: BaseEmotionId;
  b: BaseEmotionId;
  composite: CompositeEmotion;
}

export interface DetectedBaseEmotion {
  id: BaseEmotionId;
  confidence?: number;
}

export interface EmotionalAnalysis {
  baseEmotions: DetectedBaseEmotion[];
  composite: {
    blendKey: string;
    name: string;
    description: string;
    energy: number;
  };
  insight?: string;
}

export interface AnalyzeEmotionRequest {
  text: string;
}

export type AnalyzeEmotionResponse = EmotionalAnalysis;
