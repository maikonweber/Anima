export function sanitizeEmailInput(raw: string): string {
  return raw.toLowerCase().replace(/\s/g, "").replace(/[^a-z0-9._%+\-@]/g, "");
}

export function maskEmailForDisplay(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.length <= 2 ? (local[0] ?? "*") : local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(1, local.length - visible.length))}@${domain}`;
}
