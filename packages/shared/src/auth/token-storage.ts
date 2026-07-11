/** Sync key-value storage used by auth session helpers. */
export interface TokenStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Optional session-scoped storage (web sessionStorage / in-memory on mobile). */
export interface SessionFlagStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const memory = new Map<string, string>();

export function createMemoryStorage(): TokenStorage {
  return {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => {
      memory.set(key, value);
    },
    removeItem: (key) => {
      memory.delete(key);
    },
  };
}

export function createMemorySessionFlagStorage(): SessionFlagStorage {
  const flags = new Map<string, string>();
  return {
    getItem: (key) => flags.get(key) ?? null,
    setItem: (key, value) => {
      flags.set(key, value);
    },
    removeItem: (key) => {
      flags.delete(key);
    },
  };
}

export function createLocalStorageAdapter(): TokenStorage {
  const store = globalThis as typeof globalThis & {
    localStorage?: TokenStorage;
  };
  return {
    getItem: (key) => {
      if (!store.localStorage) return null;
      return store.localStorage.getItem(key);
    },
    setItem: (key, value) => {
      store.localStorage?.setItem(key, value);
    },
    removeItem: (key) => {
      store.localStorage?.removeItem(key);
    },
  };
}

export function createSessionStorageFlagAdapter(): SessionFlagStorage {
  const store = globalThis as typeof globalThis & {
    sessionStorage?: SessionFlagStorage;
  };
  return {
    getItem: (key) => {
      if (!store.sessionStorage) return null;
      return store.sessionStorage.getItem(key);
    },
    setItem: (key, value) => {
      store.sessionStorage?.setItem(key, value);
    },
    removeItem: (key) => {
      store.sessionStorage?.removeItem(key);
    },
  };
}

let tokenStorage: TokenStorage = createMemoryStorage();
let sessionFlagStorage: SessionFlagStorage = createMemorySessionFlagStorage();

export function configureTokenStorage(storage: TokenStorage): void {
  tokenStorage = storage;
}

export function configureSessionFlagStorage(storage: SessionFlagStorage): void {
  sessionFlagStorage = storage;
}

export function getTokenStorage(): TokenStorage {
  return tokenStorage;
}

export function getSessionFlagStorage(): SessionFlagStorage {
  return sessionFlagStorage;
}

/**
 * Hydrate a sync memory store from async source (e.g. SecureStore),
 * then persist writes back asynchronously.
 */
export function createHydratedStorage(options: {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  keys: string[];
}): {
  storage: TokenStorage;
  hydrate: () => Promise<void>;
} {
  const cache = new Map<string, string>();

  const storage: TokenStorage = {
    getItem: (key) => cache.get(key) ?? null,
    setItem: (key, value) => {
      cache.set(key, value);
      void options.setItem(key, value);
    },
    removeItem: (key) => {
      cache.delete(key);
      void options.removeItem(key);
    },
  };

  async function hydrate() {
    await Promise.all(
      options.keys.map(async (key) => {
        const value = await options.getItem(key);
        if (value != null) cache.set(key, value);
      }),
    );
  }

  return { storage, hydrate };
}
