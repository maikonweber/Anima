import * as SecureStore from "expo-secure-store";
import {
  AUTH_STORAGE_KEYS,
  configureApiUrl,
  configureSessionFlagStorage,
  configureTokenStorage,
  createHydratedStorage,
  createMemorySessionFlagStorage,
} from "@anima/shared";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://api.muttercorp.com.br";

export async function bootstrapShared(): Promise<void> {
  configureApiUrl(API_URL);

  const { storage, hydrate } = createHydratedStorage({
    keys: [...AUTH_STORAGE_KEYS],
    getItem: (key) => SecureStore.getItemAsync(key),
    setItem: (key, value) => SecureStore.setItemAsync(key, value),
    removeItem: (key) => SecureStore.deleteItemAsync(key),
  });

  configureTokenStorage(storage);
  configureSessionFlagStorage(createMemorySessionFlagStorage());
  await hydrate();
}
