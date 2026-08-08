import { test, expect } from "@playwright/test";
import {
  ADMIN_ROUTES,
  AUTHENTICATED_ROUTES,
  CLINIC_SUBROUTES,
} from "./utils/routes";
import { apiBaseUrl } from "./utils/env";
import { visitAndScreenshot } from "./utils/screenshots";

const ACCESS_TOKEN_KEY = "anima_access_token";

async function getAccessToken(page: import("@playwright/test").Page) {
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  return page.evaluate(
    (key) => localStorage.getItem(key),
    ACCESS_TOKEN_KEY,
  );
}

async function fetchOrganizationIds(
  page: import("@playwright/test").Page,
): Promise<string[]> {
  const token = await getAccessToken(page);
  if (!token) return [];

  const response = await page.request.get(`${apiBaseUrl()}/organizations`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok()) return [];

  const data = (await response.json()) as
    | { id: string }[]
    | { organizations?: { id: string }[] }
    | { organization: { id: string } }[];

  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if ("organization" in item && item.organization?.id) {
          return item.organization.id;
        }
        if ("id" in item && item.id) {
          return item.id;
        }
        return null;
      })
      .filter((id): id is string => Boolean(id));
  }

  if (data.organizations && Array.isArray(data.organizations)) {
    return data.organizations.map((org) => org.id).filter(Boolean);
  }

  return [];
}

test.describe("Rotas autenticadas", () => {
  for (const route of AUTHENTICATED_ROUTES) {
    test(`screenshot ${route}`, async ({ page }) => {
      await visitAndScreenshot(page, route);
    });
  }

  test("screenshot rotas clinic dinâmicas", async ({ page }) => {
    const orgIds = await fetchOrganizationIds(page);
    test.skip(orgIds.length === 0, "Conta sem organizações clinic");

    const orgId = orgIds[0];
    for (const sub of CLINIC_SUBROUTES) {
      const route = `/clinic/${orgId}${sub}`;
      await visitAndScreenshot(page, route);
    }
  });

  for (const route of ADMIN_ROUTES) {
    test(`screenshot admin ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1_000);

      const url = page.url();
      const denied =
        url.includes("/login") ||
        (await page.getByText(/acesso negado|não autorizado|403/i).count()) > 0;

      if (denied) {
        test.info().annotations.push({
          type: "skip-reason",
          description: "Conta sem permissão admin",
        });
      }

      await visitAndScreenshot(page, route, denied ? "denied" : undefined);
      expect(page.url()).toBeTruthy();
    });
  }
});
