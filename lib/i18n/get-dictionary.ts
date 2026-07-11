import type { Locale } from "./config";
import { ptBR } from "./dictionaries/pt-BR";
import { en } from "./dictionaries/en";

export type Dictionary = typeof ptBR;

export function getDictionary(locale: Locale): Dictionary {
  return locale === "en" ? en : ptBR;
}
