/** Espelha `PLATFORM_ADMIN_EMAILS` do backend (+ env público opcional). */
const HARDCODED_PLATFORM_ADMIN_EMAILS = ["maikonweber@gmail.com"];

function resolvePlatformAdminEmails(): Set<string> {
  const set = new Set(
    HARDCODED_PLATFORM_ADMIN_EMAILS.map((e) => e.toLowerCase()),
  );
  const extra = process.env.NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS;
  if (extra?.trim()) {
    for (const part of extra.split(",")) {
      const email = part.trim().toLowerCase();
      if (email) set.add(email);
    }
  }
  return set;
}

export function isPlatformAdminEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) return false;
  return resolvePlatformAdminEmails().has(email.trim().toLowerCase());
}
