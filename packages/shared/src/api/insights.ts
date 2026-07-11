import { api } from "../api-client";
import type {
  Achievements,
  Correlations,
  MonthlyReport,
  Streak,
  Trends,
} from "../types/insights";

export async function fetchStreak() {
  return api<Streak>("/insights/streak", { auth: true });
}

export async function fetchAchievements() {
  return api<Achievements>("/insights/achievements", { auth: true });
}

export async function fetchTrends(days = 30) {
  return api<Trends>(`/insights/trends?days=${days}`, { auth: true });
}

export async function fetchMonthlyReport(month?: string) {
  const qs = month ? `?month=${month}` : "";
  return api<MonthlyReport>(`/insights/monthly-report${qs}`, { auth: true });
}

export async function fetchCorrelations(days = 90) {
  return api<Correlations>(`/insights/correlations?days=${days}`, {
    auth: true,
  });
}
