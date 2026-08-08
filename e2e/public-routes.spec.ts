import { test } from "@playwright/test";
import { PUBLIC_ROUTES } from "./utils/routes";
import { visitAndScreenshot } from "./utils/screenshots";

test.describe("Rotas públicas", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`screenshot ${route}`, async ({ page }) => {
      await visitAndScreenshot(page, route);
    });
  }
});
