import { test } from "@playwright/test";
import { AUTHENTICATED_ROUTES, PUBLIC_ROUTES } from "./utils/routes";
import { captureRouteScreenshot } from "./utils/screenshots";

const DESTRUCTIVE_PATTERN =
  /excluir|deletar|remover conta|logout.?all|sair de todos|pagar|checkout|confirmar exclus|gravar consulta|encerrar chamada|apagar/i;

const SAFE_PATTERN =
  /cancelar|voltar|fechar|menu|abrir|ver mais|detalhes|próximo|anterior|tab|aba/i;

function isSafeButton(label: string): boolean {
  const normalized = label.trim();
  if (!normalized || normalized.length > 80) return false;
  if (DESTRUCTIVE_PATTERN.test(normalized)) return false;
  if (SAFE_PATTERN.test(normalized)) return true;
  if (/^(ok|sim|não|nao)$/i.test(normalized)) return false;
  return normalized.length <= 40;
}

async function smokeButtonsOnPage(
  page: import("@playwright/test").Page,
  route: string,
): Promise<void> {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1_000);
  await captureRouteScreenshot(page, route, "buttons-before");

  const candidates = page.locator(
    'button:visible, a[role="button"]:visible, input[type="submit"]:visible',
  );
  const count = await candidates.count();
  const clickedLabels: string[] = [];

  for (let i = 0; i < count; i++) {
    const button = candidates.nth(i);
    const label =
      (await button.innerText().catch(() => "")) ||
      (await button.getAttribute("aria-label")) ||
      (await button.getAttribute("title")) ||
      "";

    if (!isSafeButton(label)) continue;
    if (clickedLabels.includes(label)) continue;

    const enabled = await button.isEnabled().catch(() => false);
    if (!enabled) continue;

    await button.click({ timeout: 5_000 }).catch(() => undefined);
    clickedLabels.push(label);
    await page.waitForTimeout(400);
  }

  await captureRouteScreenshot(page, route, "buttons-after");
}

test.describe("Smoke de botões — rotas públicas", () => {
  const samplePublic = PUBLIC_ROUTES.filter((r) =>
    ["/", "/login", "/register", "/plans", "/faq"].includes(r),
  );

  for (const route of samplePublic) {
    test(`botões ${route}`, async ({ page }) => {
      await smokeButtonsOnPage(page, route);
    });
  }
});

test.describe("Smoke de botões — rotas autenticadas", () => {
  const sampleAuth = AUTHENTICATED_ROUTES.filter((r) =>
    [
      "/dashboard",
      "/dashboard/perfil",
      "/diary",
      "/assistente",
      "/suporte",
      "/clinic",
    ].includes(r),
  );

  for (const route of sampleAuth) {
    test(`botões ${route}`, async ({ page }) => {
      await smokeButtonsOnPage(page, route);
    });
  }
});
