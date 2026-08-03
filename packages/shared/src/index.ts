export {
  api,
  ApiError,
  FORBIDDEN_MESSAGE,
  configureApiClient,
  configureApiUrl,
  getApiUrl,
  type UnauthorizedReason,
} from "./api-client";

export * from "./types";
export * from "./api/auth";
export * from "./api/diary";
export * from "./api/assistant";
export * from "./api/care";
export * from "./api/insights";
export * from "./api/subscription";
export * from "./api/feature-flags";
export * from "./api/terms";
export * from "./api/feedback";
export * from "./api/organizations";
export * from "./api/patients";
export * from "./api/agenda";
export * from "./api/consents";
export * from "./api/clinical-notes";
export * from "./api/patient-diary";
export * from "./api/teleconsult";
export * from "./api/reminders";
export * from "./api/care-plans";

export {
  configureTokenStorage,
  configureSessionFlagStorage,
  createLocalStorageAdapter,
  createSessionStorageFlagAdapter,
  createMemoryStorage,
  createMemorySessionFlagStorage,
  createHydratedStorage,
  getTokenStorage,
  getSessionFlagStorage,
  type TokenStorage,
  type SessionFlagStorage,
} from "./auth/token-storage";

export {
  AUTH_STORAGE_KEYS,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  EXPIRES_AT_KEY,
  USER_KEY,
  SESSION_REUSE_WARNING_KEY,
  buildExpiresAt,
  getStoredToken,
  getStoredRefreshToken,
  getStoredExpiresAt,
  getStoredUser,
  getStoredSession,
  persistSession,
  persistAuth,
  persistAuthResponse,
  clearAuth,
  setSessionReuseWarning,
  consumeSessionReuseWarning,
  type AuthSession,
} from "./auth/storage";

export { refreshAccessToken } from "./auth/refresh-access-token";

export {
  normalizeSharedDashboard,
  hasPreConsultContent,
  hasIntelligentReportContent,
  hasLongTermPatternContent,
} from "./care/normalize-shared-dashboard";

export {
  ENERGY_CATEGORIES,
  getCategoryFromEnergy,
  getCategoryStyle,
} from "./energy";

export * from "./validations/auth";
export * from "./validations/diary";
export * from "./validations/care";
export * from "./validations/feedback";
