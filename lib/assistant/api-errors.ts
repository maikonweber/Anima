/** Campos estruturais nos corpos JSON de erro da API (assistant e demais rotas). */
export type ApiJsonErrorShape = {
  message?: unknown;
  code?: unknown;
  retryAfterSeconds?: unknown;
};

export function extractApiErrorExtras(details: unknown): {
  code?: string;
  retryAfterSeconds?: number;
} {
  if (!details || typeof details !== "object") return {};
  const d = details as ApiJsonErrorShape;
  const code = typeof d.code === "string" ? d.code : undefined;
  const raw = d.retryAfterSeconds;
  const retryAfterSeconds =
    typeof raw === "number" && Number.isFinite(raw) && raw > 0
      ? raw
      : typeof raw === "string"
        ? (() => {
            const n = Number.parseInt(raw, 10);
            return Number.isFinite(n) && n > 0 ? n : undefined;
          })()
        : undefined;
  return { code, retryAfterSeconds };
}
