"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useFeatureFlags } from "@/hooks/use-feature-flags";

const DEFAULT_ICE_SERVERS: import("@anima/shared").IceServerConfig[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

interface FeatureFlagsContextValue {
  previewMode: boolean;
  teleconsult: boolean;
  teleconsultTranscription: boolean;
  teleconsultMultimodal: boolean;
  teleconsultRecording: boolean;
  iceServers: import("@anima/shared").IceServerConfig[];
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
      teleconsult: data?.teleconsult ?? false,
      teleconsultTranscription: data?.teleconsultTranscription ?? false,
      teleconsultMultimodal: data?.teleconsultMultimodal ?? false,
      teleconsultRecording: data?.teleconsultRecording ?? false,
      iceServers: data?.iceServers ?? DEFAULT_ICE_SERVERS,
      isLoading,
    }),
    [
      data?.previewMode,
      data?.teleconsult,
      data?.teleconsultTranscription,
      data?.teleconsultMultimodal,
      data?.teleconsultRecording,
      data?.iceServers,
      isLoading,
    ],
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
