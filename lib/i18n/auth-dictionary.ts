import type { Locale } from "./config";
import { authEn } from "./dictionaries/auth-en";
import { authEs } from "./dictionaries/auth-es";
import { authPt, type AuthPageDictionary } from "./dictionaries/auth-pt";

export type { AuthPageDictionary };

export function getAuthDictionary(locale: Locale): AuthPageDictionary {
  if (locale === "en") return authEn as AuthPageDictionary;
  if (locale === "es") return authEs as AuthPageDictionary;
  return authPt as AuthPageDictionary;
}
