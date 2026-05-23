"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useFeatureFlags } from "@/hooks/use-feature-flags";

interface FeatureFlagsContextValue {
  previewMode: boolean;
  isLoading: boolean;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(
  null,
);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useFeatureFlags();

  const value = useMemo<FeatureFlagsContextValue>(
    () => ({
      previewMode: data?.previewMode ?? false,
      isLoading,
    }),
    [data?.previewMode, isLoading],
  );

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlagsContext() {
  const ctx = useContext(FeatureFlagsContext);
  if (!ctx) {
    throw new Error(
      "useFeatureFlagsContext must be used within FeatureFlagsProvider",
    );
  }
  return ctx;
}
