import type { BaseEmotionId } from "./types";
import { BASE_EMOTION_IDS } from "./base-emotions";

export function normalizePairKey(
  a: BaseEmotionId,
  b: BaseEmotionId,
): string {
  const sorted = [a, b].sort() as [BaseEmotionId, BaseEmotionId];
  return `${sorted[0]}+${sorted[1]}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.round(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function mixColors(
  colorA: string,
  colorB: string,
  ratio = 0.5,
): string {
  const [r1, g1, b1] = hexToRgb(colorA);
  const [r2, g2, b2] = hexToRgb(colorB);
  return rgbToHex(
    r1 * (1 - ratio) + r2 * ratio,
    g1 * (1 - ratio) + g2 * ratio,
    b1 * (1 - ratio) + b2 * ratio,
  );
}

export function isValidEmotionId(id: string): id is BaseEmotionId {
  return (BASE_EMOTION_IDS as string[]).includes(id);
}
