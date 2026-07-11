import type { EnergyCategory } from "./types";

export const ENERGY_CATEGORIES: Record<
  EnergyCategory,
  { min: number; max: number; label: string; color: string; bg: string }
> = {
  EXAUSTAO: {
    min: 0,
    max: 20,
    label: "Exaustão",
    color: "#ef4444",
    bg: "bg-red-500/15 text-red-500 border-red-500/30",
  },
  BAIXA: {
    min: 21,
    max: 40,
    label: "Baixa",
    color: "#f97316",
    bg: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  },
  INSTAVEL: {
    min: 41,
    max: 60,
    label: "Instável",
    color: "#eab308",
    bg: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  },
  FUNCIONAL: {
    min: 61,
    max: 80,
    label: "Funcional",
    color: "#22c55e",
    bg: "bg-green-500/15 text-green-500 border-green-500/30",
  },
  EXPANSIVA: {
    min: 81,
    max: 100,
    label: "Expansiva",
    color: "#8b5cf6",
    bg: "bg-violet-500/15 text-violet-500 border-violet-500/30",
  },
};

export function getCategoryFromEnergy(value: number): EnergyCategory {
  if (value <= 20) return "EXAUSTAO";
  if (value <= 40) return "BAIXA";
  if (value <= 60) return "INSTAVEL";
  if (value <= 80) return "FUNCIONAL";
  return "EXPANSIVA";
}

export function getCategoryStyle(category: EnergyCategory) {
  return ENERGY_CATEGORIES[category];
}
