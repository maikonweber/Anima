import { test as setup } from "@playwright/test";
import fs from "fs";
import path from "path";
import { apiBaseUrl, requireE2ECredentials } from "./utils/env";

const authFile = path.resolve(__dirname, ".auth", "user.json");

const TOKEN_KEY = "anima_access_token";
const REFRESH_TOKEN_KEY = "anima_refresh_token";
const EXPIRES_AT_KEY = "anima_access_token_expires_at";
const USER_KEY = "anima_user";

setup("authenticate", async ({ page, request }) => {
  const { email, password } = requireE2ECredentials();

  const loginResponse = await request.post(`${apiBaseUrl()}/auth/login`, {
    data: { email, senha: password },
  });

  if (!loginResponse.ok()) {
    throw new Error(
      `Login API falhou (${loginResponse.status()}): ${await loginResponse.text()}`,
    );
  }

  const body = await loginResponse.json();

  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ authBody, keys }) => {
      localStorage.setItem(keys.token, authBody.accessToken);
      if (authBody.refreshToken) {
        localStorage.setItem(keys.refresh, authBody.refreshToken);
      }
      if (authBody.accessTokenExpiresIn != null) {
        const expiresAt = Date.now() + authBody.accessTokenExpiresIn * 1000;
        localStorage.setItem(keys.expires, String(expiresAt));
      }
      if (authBody.user) {
        localStorage.setItem(keys.user, JSON.stringify(authBody.user));
      }
    },
    {
      authBody: body,
      keys: {
        token: TOKEN_KEY,
        refresh: REFRESH_TOKEN_KEY,
        expires: EXPIRES_AT_KEY,
        user: USER_KEY,
      },
    },
  );

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
