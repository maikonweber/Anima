"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  getTeleconsultRecordingDownload,
  listTeleconsultRecordings,
} from "@/lib/api/teleconsult";
import type { TeleconsultRecording } from "@anima/shared";

export function TeleconsultRecordingsPanel({
  orgId,
  sessionId,
}: {
  orgId: string;
  sessionId: string;
}) {
  const [rows, setRows] = useState<TeleconsultRecording[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void listTeleconsultRecordings(orgId, sessionId)
      .then((result) => {
        if (active) setRows(result);
      })
      .catch((caught) => {
        if (active) {
          setError(caught instanceof Error ? caught.message : "Falha ao listar");
        }
      });
    return () => {
      active = false;
    };
  }, [orgId, sessionId]);

  const ready = rows.filter((row) => row.status === "READY");
  if (ready.length === 0 && !error) return null;

  return (
    <div className="glass-panel p-4 space-y-3">
      <h3 className="text-sm font-semibold">Gravações da consulta</h3>
      {ready.map((row) => (
        <div key={row.id} className="flex items-center justify-between gap-3">
          <span className="text-xs text-foreground/60">
            {row.mediaType === "video" ? "Áudio e vídeo" : "Áudio"}
            {row.durationMs
              ? ` · ${Math.ceil(row.durationMs / 60000)} min`
              : ""}
          </span>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              void getTeleconsultRecordingDownload(orgId, sessionId, row.id)
                .then(({ url }) =>
                  window.open(url, "_blank", "noopener,noreferrer"),
                )
                .catch((caught) =>
                  setError(
                    caught instanceof Error
                      ? caught.message
                      : "Falha ao abrir gravação",
                  ),
                )
            }
          >
            Reproduzir
          </Button>
        </div>
      ))}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
