export function usagePercent(
  used: number,
  limit: number | null,
): number {
  if (limit === null || limit === 0) return 0;
  return Math.min(100, (used / limit) * 100);
}

export function isNearLimit(
  used: number,
  limit: number | null,
  threshold = 0.8,
): boolean {
  if (limit === null) return false;
  return used / limit >= threshold;
}

export function formatLimit(value: number | null, unit?: string): string {
  if (value === null) return "Ilimitado";
  return unit ? `${value} ${unit}` : String(value);
}

export function normalizedPlanLimitFields(e: {
  limit?: number | null;
  used?: number;
  resetsAt?: string;
  details?: { limit?: number | null; used?: number; resetsAt?: string };
}): {
  limit: number | null;
  used: number | undefined;
  resetsAt: string | undefined;
} {
  return {
    limit: e.details?.limit ?? e.limit ?? null,
    used: e.details?.used ?? e.used,
    resetsAt: e.details?.resetsAt ?? e.resetsAt,
  };
}

export function formatResetsAt(iso: string | undefined): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return null;
  }
}
