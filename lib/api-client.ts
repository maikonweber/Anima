import "@/lib/auth/storage";
import {
  configureApiUrl,
  api,
  ApiError,
  FORBIDDEN_MESSAGE,
  configureApiClient,
  getApiUrl,
  type UnauthorizedReason,
} from "@anima/shared";

configureApiUrl(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
);

export {
  api,
  ApiError,
  FORBIDDEN_MESSAGE,
  configureApiClient,
  getApiUrl,
  type UnauthorizedReason,
};
