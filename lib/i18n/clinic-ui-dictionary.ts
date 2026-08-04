import type { Locale } from "./config";
import { clinicUiEn } from "./dictionaries/clinic-ui-en";
import { clinicUiEs } from "./dictionaries/clinic-ui-es";
import {
  clinicUiPt,
  type ClinicUiDictionary,
} from "./dictionaries/clinic-ui-pt";

export type { ClinicUiDictionary };

export function getClinicUiDictionary(locale: Locale): ClinicUiDictionary {
  if (locale === "en") return clinicUiEn;
  if (locale === "es") return clinicUiEs;
  return clinicUiPt;
}
