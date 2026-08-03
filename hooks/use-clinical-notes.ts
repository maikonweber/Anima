"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addClinicalNoteAddendum,
  createClinicalNote,
  listClinicalNotes,
  signClinicalNote,
  updateClinicalNote,
} from "@/lib/api/clinical-notes";
import type {
  CreateClinicalNoteAddendumPayload,
  CreateClinicalNotePayload,
  ListClinicalNotesQuery,
  UpdateClinicalNotePayload,
} from "@anima/shared";
import { useAuth } from "@/providers/auth-provider";

function invalidateNotes(
  queryClient: ReturnType<typeof useQueryClient>,
  orgId: string,
  patientId: string,
) {
  void queryClient.invalidateQueries({
    queryKey: ["clinical-notes", orgId, patientId],
  });
}

export function useClinicalNotes(
  orgId: string,
  patientId: string,
  query?: ListClinicalNotesQuery,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["clinical-notes", orgId, patientId, query],
    queryFn: () => listClinicalNotes(orgId, patientId, query),
    enabled: !!user && !!orgId && !!patientId,
  });
}

export function useCreateClinicalNote(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClinicalNotePayload) =>
      createClinicalNote(orgId, patientId, payload),
    onSuccess: () => invalidateNotes(queryClient, orgId, patientId),
  });
}

export function useUpdateClinicalNote(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      noteId,
      payload,
    }: {
      noteId: string;
      payload: UpdateClinicalNotePayload;
    }) => updateClinicalNote(orgId, patientId, noteId, payload),
    onSuccess: () => invalidateNotes(queryClient, orgId, patientId),
  });
}

export function useSignClinicalNote(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) =>
      signClinicalNote(orgId, patientId, noteId),
    onSuccess: () => invalidateNotes(queryClient, orgId, patientId),
  });
}

export function useAddClinicalNoteAddendum(orgId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      noteId,
      payload,
    }: {
      noteId: string;
      payload: CreateClinicalNoteAddendumPayload;
    }) => addClinicalNoteAddendum(orgId, patientId, noteId, payload),
    onSuccess: () => invalidateNotes(queryClient, orgId, patientId),
  });
}
