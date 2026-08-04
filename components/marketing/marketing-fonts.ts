import { DM_Sans, Fraunces } from "next/font/google";

export const marketingDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-home-display",
  display: "swap",
});

export const marketingBody = DM_Sans({
  subsets: ["latin"],
  variable: "--font-home-body",
  display: "swap",
});

export const marketingFontVariables = `${marketingDisplay.variable} ${marketingBody.variable}`;
