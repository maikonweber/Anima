import type { Metadata } from "next";

/** Áreas privadas / transacionais: não indexação em buscas. */
export const NO_INDEX_METADATA: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};
