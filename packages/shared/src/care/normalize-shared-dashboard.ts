import type {
  DashboardAlert,
  IntelligentReport,
  LongTermPattern,
  PreConsultSummary,
  SharedDashboard,
  TherapyTimelineEvent,
} from "../types";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as UnknownRecord;
  }
  return null;
}

function pickString(obj: UnknownRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function pickStringArray(obj: UnknownRecord, keys: string[]): string[] {
  for (const key of keys) {
    const value = obj[key];
    if (!Array.isArray(value)) continue;
    const items = value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        const rec = asRecord(item);
        if (!rec) return "";
        return (
          pickString(rec, ["text", "texto", "point", "ponto", "description", "descricao"]) ??
          ""
        );
      })
      .filter(Boolean);
    if (items.length > 0) return items;
  }
  return [];
}

function pickArray(obj: UnknownRecord, keys: string[]): unknown[] {
  for (const key of keys) {
    const value = obj[key];
    if (Array.isArray(value) && value.length > 0) return value;
  }
  return [];
}

function insightsRoot(raw: UnknownRecord): UnknownRecord {
  const nested = asRecord(
    raw.insights ??
      raw.insightsClinicos ??
      raw.insights_clinicos ??
      raw.clinicalInsights,
  );
  return nested ? { ...raw, ...nested } : raw;
}

function normalizeAlert(item: unknown, index: number): DashboardAlert | null {
  const rec = asRecord(item);
  if (!rec) return null;

  const title = pickString(rec, ["title", "titulo", "nome"]);
  const description = pickString(rec, [
    "description",
    "descricao",
    "texto",
    "message",
    "mensagem",
  ]);
  if (!title && !description) return null;

  const id = pickString(rec, ["id"]) ?? `alert-${index}`;
  const severity = pickString(rec, ["severity", "severidade"]) as
    | DashboardAlert["severity"]
    | undefined;

  return { id, title: title ?? "Alerta", description: description ?? "", severity };
}

function normalizeTimelineEvent(
  item: unknown,
  index: number,
): TherapyTimelineEvent | null {
  const rec = asRecord(item);
  if (!rec) return null;

  const title = pickString(rec, ["title", "titulo", "nome"]);
  const description = pickString(rec, [
    "description",
    "descricao",
    "texto",
    "resumo",
  ]);
  const date = pickString(rec, ["date", "data", "criadoEm", "occurredAt"]);
  if (!title && !description) return null;

  return {
    id: pickString(rec, ["id"]) ?? `timeline-${index}`,
    date: date ?? new Date().toISOString(),
    title: title ?? "Evento",
    description: description ?? "",
  };
}

function normalizeLongTermPattern(
  item: unknown,
  index: number,
): LongTermPattern | null {
  const rec = asRecord(item);
  if (!rec) {
    if (typeof item === "string" && item.trim()) {
      return {
        id: `pattern-${index}`,
        title: item.trim(),
        description: "",
      };
    }
    return null;
  }

  const title = pickString(rec, ["title", "titulo", "nome", "label"]);
  const description = pickString(rec, [
    "description",
    "descricao",
    "texto",
    "resumo",
    "summary",
  ]);
  const theme = pickString(rec, [
    "theme",
    "tema",
    "temaEmocional",
    "emotionalTheme",
    "categoria",
  ]);

  if (!title && !description && !theme) return null;

  return {
    id: pickString(rec, ["id"]) ?? `pattern-${index}`,
    title: title ?? theme ?? "Padrão identificado",
    description: description ?? "",
    theme,
  };
}

function normalizePreConsultSummary(raw: unknown): PreConsultSummary | null {
  const rec = asRecord(raw);
  if (!rec) return null;

  const subtitle = pickString(rec, ["subtitle", "subtitulo", "titulo"]);
  const points = pickStringArray(rec, [
    "points",
    "pontos",
    "itens",
    "items",
    "topics",
    "topicos",
  ]);
  const note = pickString(rec, ["note", "nota", "observacao", "observacoes"]);

  if (!subtitle && points.length === 0 && !note) return null;
  return { subtitle, points, note };
}

function normalizeIntelligentReport(raw: unknown): IntelligentReport | null {
  const rec = asRecord(raw);
  if (!rec) return null;

  const risks = pickStringArray(rec, ["risks", "riscos", "alertas", "sinais"]);
  const progressHighlights = pickStringArray(rec, [
    "progressHighlights",
    "destaquesProgresso",
    "progresso",
    "destaques",
    "evolucao",
  ]);
  const recommendations = pickStringArray(rec, [
    "recommendations",
    "recomendacoes",
    "sugestoes",
  ]);
  const patternsDetected = pickStringArray(rec, [
    "patternsDetected",
    "padroesDetectados",
    "padroes",
    "patterns",
  ]);

  if (
    risks.length === 0 &&
    progressHighlights.length === 0 &&
    recommendations.length === 0 &&
    patternsDetected.length === 0
  ) {
    const summary = pickString(rec, ["summary", "resumo", "texto", "content"]);
    if (summary) {
      return { recommendations: [summary] };
    }
    return null;
  }

  return {
    risks: risks.length ? risks : undefined,
    progressHighlights: progressHighlights.length
      ? progressHighlights
      : undefined,
    recommendations: recommendations.length ? recommendations : undefined,
    patternsDetected: patternsDetected.length ? patternsDetected : undefined,
  };
}

export function hasPreConsultContent(
  summary: PreConsultSummary | null | undefined,
): boolean {
  if (!summary) return false;
  return (
    !!summary.subtitle ||
    (summary.points?.length ?? 0) > 0 ||
    !!summary.note
  );
}

export function hasIntelligentReportContent(
  report: IntelligentReport | null | undefined,
): boolean {
  if (!report) return false;
  return (
    (report.risks?.length ?? 0) > 0 ||
    (report.progressHighlights?.length ?? 0) > 0 ||
    (report.recommendations?.length ?? 0) > 0 ||
    (report.patternsDetected?.length ?? 0) > 0
  );
}

export function hasLongTermPatternContent(
  patterns: LongTermPattern[] | undefined,
): boolean {
  return (patterns?.length ?? 0) > 0;
}

/** Maps API payload (EN/PT keys) to the SharedDashboard shape used by the UI. */
export function normalizeSharedDashboard(raw: SharedDashboard): SharedDashboard {
  const source = insightsRoot(raw as unknown as UnknownRecord);

  const alertsRaw = pickArray(source, ["alerts", "alertas"]);
  const timelineRaw = pickArray(source, [
    "therapyTimeline",
    "timelineTerapeutica",
    "linhaDoTempoTerapeutica",
    "timeline_terapeutica",
  ]);
  const patternsRaw = pickArray(source, [
    "longTermPatterns",
    "padroesLongoPrazo",
    "padroes_longo_prazo",
  ]);

  const preConsultRaw =
    source.preConsultSummary ??
    source.resumoPreConsulta ??
    source.resumo_pre_consulta;

  const intelligentRaw =
    source.intelligentReport ??
    source.relatorioInteligente ??
    source.relatorio_inteligente;

  const alerts = alertsRaw
    .map(normalizeAlert)
    .filter((a): a is DashboardAlert => a != null);

  const therapyTimeline = timelineRaw
    .map(normalizeTimelineEvent)
    .filter((e): e is TherapyTimelineEvent => e != null);

  const longTermPatterns = patternsRaw
    .map(normalizeLongTermPattern)
    .filter((p): p is LongTermPattern => p != null);

  const preConsultSummary = normalizePreConsultSummary(preConsultRaw);
  const intelligentReport = normalizeIntelligentReport(intelligentRaw);

  return {
    ...raw,
    alerts: alerts.length ? alerts : undefined,
    therapyTimeline: therapyTimeline.length ? therapyTimeline : undefined,
    longTermPatterns: longTermPatterns.length ? longTermPatterns : undefined,
    preConsultSummary: preConsultSummary ?? undefined,
    intelligentReport: intelligentReport ?? undefined,
  };
}
