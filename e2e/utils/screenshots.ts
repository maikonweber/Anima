import type { Page } from "@playwright/test";
import fs from "fs";
import path from "path";
import { routeToSlug } from "./routes";

const SCREENSHOTS_DIR = path.resolve(__dirname, "..", "screenshots");

export function ensureScreenshotsDir(): void {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

export async function captureRouteScreenshot(
  page: Page,
  route: string,
  suffix = "",
): Promise<void> {
  ensureScreenshotsDir();
  const slug = routeToSlug(route);
  const fileName = suffix ? `${slug}__${suffix}.png` : `${slug}.png`;
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, fileName),
    fullPage: true,
  });
}

export async function visitAndScreenshot(
  page: Page,
  route: string,
  options?: { waitMs?: number },
): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(route, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(2_000);
    }
  }

  if (lastError) {
    throw lastError;
  }

  await page.waitForTimeout(options?.waitMs ?? 1_000);
  await captureRouteScreenshot(page, route);
}
