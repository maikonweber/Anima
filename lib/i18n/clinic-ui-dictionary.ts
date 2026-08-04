import type { Locale } from "./config";
import { clinicUiEn } from "./dictionaries/clinic-ui-en";
import { clinicUiEs } from "./dictionaries/clinic-ui-es";
import {
  clinicUiPt,
  type ClinicUiDictionary,
} from "./dictionaries/clinic-ui-pt";

export type { ClinicUiDictionary };

export function getClinicUiDictionary(locale: Locale): ClinicUiDictionary {
  // `as const` dictionaries are readonly; DeepStringify expects mutable strings.
  if (locale === "en") return clinicUiEn as unknown as ClinicUiDictionary;
  if (locale === "es") return clinicUiEs as unknown as ClinicUiDictionary;
  return clinicUiPt as unknown as ClinicUiDictionary;
}
