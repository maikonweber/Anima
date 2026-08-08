export function requireE2ECredentials(): { email: string; password: string } {
  const email = process.env.E2E_EMAIL?.trim();
  const password = process.env.E2E_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "Defina E2E_EMAIL e E2E_PASSWORD em .env.e2e (veja .env.e2e.example).",
    );
  }
  return { email, password };
}

export function apiBaseUrl(): string {
  return process.env.E2E_API_URL ?? "http://localhost:3000";
}
