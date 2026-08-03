"use client";

import { useQuery } from "@tanstack/react-query";
import { listPatientDiary } from "@/lib/api/patient-diary";
import type { DiaryEntriesQuery } from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

export function usePatientDiary(
  orgId: string,
  patientId: string,
  query?: DiaryEntriesQuery,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["patient-diary", orgId, patientId, query],
    queryFn: () => listPatientDiary(orgId, patientId, query),
    enabled: !!user && !!orgId && !!patientId,
    retry: false,
  });
}
