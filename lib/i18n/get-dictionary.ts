import type { Locale } from "./config";
import { ptBR } from "./dictionaries/pt-BR";
import { en } from "./dictionaries/en";
import { es } from "./dictionaries/es";

export type Dictionary = typeof ptBR;

export function getDictionary(locale: Locale): Dictionary {
  if (locale === "en") return en;
  if (locale === "es") return es;
  return ptBR;
}
