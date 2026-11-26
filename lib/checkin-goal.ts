export const CHECKIN_GOAL_OPTIONS = [3, 5, 7] as const;
export type CheckinGoalDays = (typeof CHECKIN_GOAL_OPTIONS)[number];

const STORAGE_PREFIX = "anima_checkin_goal_v1:";

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function isCheckinGoalDays(value: unknown): value is CheckinGoalDays {
  return value === 3 || value === 5 || value === 7;
}

export function readCheckinGoal(userId: string | undefined): CheckinGoalDays {
  if (!userId || typeof window === "undefined") return 3;
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    const parsed = raw ? Number(raw) : NaN;
    if (isCheckinGoalDays(parsed)) return parsed;
  } catch {
    // Private mode or blocked storage — keep the gentle default.
  }
  return 3;
}

export function writeCheckinGoal(userId: string, days: CheckinGoalDays) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(userId), String(days));
  } catch {
    // Ignore quota / privacy errors; the UI still works for this session.
  }
}
