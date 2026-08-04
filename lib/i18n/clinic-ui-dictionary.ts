import type { Locale } from "./config";
import { clinicUiEn } from "./dictionaries/clinic-ui-en";
import { clinicUiEs } from "./dictionaries/clinic-ui-es";
import {
  clinicUiPt,
  type ClinicUiDictionary,
} from "./dictionaries/clinic-ui-pt";

export type { ClinicUiDictionary };

/**
 * Dictionaries are declared with `as const`; ClinicUiDictionary widens strings.
 * Map through unknown so Next typecheck accepts the readonly → mutable widen.
 */
const byLocale = {
  en: clinicUiEn,
  es: clinicUiEs,
  pt: clinicUiPt,
} as unknown as Record<"en" | "es" | "pt", ClinicUiDictionary>;

export function getClinicUiDictionary(locale: Locale): ClinicUiDictionary {
  if (locale === "en" || locale === "es") return byLocale[locale];
  return byLocale.pt;
}
