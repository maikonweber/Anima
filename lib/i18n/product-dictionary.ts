import type { Locale } from "./config";
import { productEn } from "./dictionaries/product-en";
import { productEs } from "./dictionaries/product-es";
import { productPt, type ProductDictionary } from "./dictionaries/product-pt";

export type { ProductDictionary };

export function getProductDictionary(locale: Locale): ProductDictionary {
  if (locale === "en") return productEn;
  if (locale === "es") return productEs;
  return productPt;
}
