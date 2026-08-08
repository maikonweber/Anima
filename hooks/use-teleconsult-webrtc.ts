"use client";

/**
 * WebRTC 1:1 para teleconsulta — signaling via HTTP poll (sem WebSocket).
 * Presence vem do mapa no servidor (não compete com SDP/ICE no ring buffer).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  postTeleconsultSignal,
  pullTeleconsultSignals,
} from "@/lib/api/teleconsult";
import { rtcLog, summarizePc } from "@/lib/teleconsult-debug";
import { ApiError } from "@anima/shared";
import type {
  TeleconsultPresencePayload,
  TeleconsultSignalMessage,
  TeleconsultViewerRole,
} from "@anima/shared";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

const POLL_MS = 1000;
const REOFFER_MS = 10_000;
const HEARTBEAT_MS = 8_000;

export type UseTeleconsultWebRtcOptions = {
  orgId: string;
  sessionId: string;
  userId: string | undefined;
  isInitiator: boolean;
  viewerRole: TeleconsultViewerRole;
  localStream: MediaStream | null | undefined;
  mediaReady: boolean;
  enabled?: boolean;
};

function attachStreamToVideo(
  el: HTMLVideoElement | null,
  stream: MediaStream | null,
  { muted = false }: { muted?: boolean } = {},
) {
  if (!el || !stream) return;
  if (el.srcObject !== stream) {
    el.srcObject = stream;
  }
  if (muted) el.muted = true;
  void el.play().catch(() => {
    /* autoplay bloqueado — UI pode pedir gesto */
  });
}

export function useTeleconsultWebRtc({
  orgId,
  sessionId,
  userId,
  isInitiator,
  viewerRole,
  localStream,
  mediaReady,
  enabled = true,
}: UseTeleconsultWebRtcOptions) {
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const lastSignalId = useRef<string | undefined>(undefined);
  const makingOffer = useRef(false);
  const pollGenRef = useRef(0);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const offerEpochRef = useRef(0);
  const isInitiatorRef = useRef(isInitiator);
  const localStreamRef = useRef(localStream);
  const peerPresentRef = useRef(false);
  /** SDP adiado (offer/answer) quando o PC não estava pronto — não perde o sinal. */
  const deferredSdpRef = useRef<TeleconsultSignalMessage[]>([]);

  const [remoteReady, setRemoteReady] = useState(false);
  const [peerPresent, setPeerPresent] = useState(false);
  const [peerRole, setPeerRole] = useState<TeleconsultViewerRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({
    phase: "idle",
  });
  const pollCountRef = useRef(0);
  const lastSignalSummaryRef = useRef<string>("—");
  const signalCapsRef = useRef({ presence: true });
  const lastSignalErrorRef = useRef<{
    type: string;
    status: number;
    message: string;
    at: string;
  } | null>(null);

  const publishSignal = useCallback(
    async (
      type: TeleconsultSignalMessage["type"],
      payload: unknown,
      { optional = false }: { optional?: boolean } = {},
    ) => {
      if (type === "presence" && !signalCapsRef.current.presence) {
        return null;
      }
      try {
        return await postTeleconsultSignal(orgId, sessionId, {
          type,
          payload,
        });
      } catch (err) {
        const status = err instanceof ApiError ? err.status : 0;
        const message =
          err instanceof Error ? err.message : "Falha ao publicar sinal";
        lastSignalErrorRef.current = {
          type,
          status,
          message,
          at: new Date().toISOString(),
        };
        if (
          type === "presence" &&
          status === 400 &&
          /presence|enum|invalid/i.test(message)
        ) {
          signalCapsRef.current.presence = false;
          rtcLog("warn", "presence_unsupported_api", { message });
          return null;
        }
        rtcLog("error", "signal_post_failed", { type, status, message });
        if (!optional) throw err;
        return null;
      }
    },
    [orgId, sessionId],
  );

  isInitiatorRef.current = isInitiator;
  localStreamRef.current = localStream;
  peerPresentRef.current = peerPresent;

  const refreshDebug = useCallback(
    (extra?: Record<string, unknown>) => {
      const pc = pcRef.current;
      setDebugInfo({
        phase: extra?.phase ?? "running",
        orgId,
        sessionId,
        userId: userId ?? null,
        isInitiator,
        viewerRole,
        mediaReady,
        peerPresent: peerPresentRef.current,
        remoteReady,
        pollCount: pollCountRef.current,
        lastSignals: lastSignalSummaryRef.current,
        lastSignalId: lastSignalId.current ?? null,
        deferredSdp: deferredSdpRef.current.length,
        pendingIce: pendingIceRef.current.length,
        presenceSupported: signalCapsRef.current.presence,
        lastSignalError: lastSignalErrorRef.current,
        localTracks:
          localStreamRef.current?.getTracks().map((t) => ({
            kind: t.kind,
            enabled: t.enabled,
            readyState: t.readyState,
          })) ?? [],
        ...summarizePc(pc),
        ...extra,
      });
    },
    [isInitiator, mediaReady, orgId, remoteReady, sessionId, userId, viewerRole],
  );

  const bindRemoteVideo = useCallback((el: HTMLVideoElement | null) => {
    remoteVideoRef.current = el;
    attachStreamToVideo(el, remoteStreamRef.current);
  }, []);

  const tryPlayRemote = useCallback(() => {
    const el = remoteVideoRef.current;
    const stream = remoteStreamRef.current;
    if (!el || !stream) return;
    el.muted = false;
    void el
      .play()
      .then(() => setNeedsGesture(false))
      .catch(() => setNeedsGesture(true));
  }, []);

  const flushPendingIce = useCallback(async (pc: RTCPeerConnection) => {
    if (!pc.remoteDescription) return;
    const pending = [...pendingIceRef.current];
    pendingIceRef.current = [];
    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(candidate);
      } catch {
        // ignorar
      }
    }
  }, []);

  const addIceCandidateSafe = useCallback(
    async (pc: RTCPeerConnection, candidate: RTCIceCandidateInit) => {
      if (!candidate) return;
      if (!pc.remoteDescription) {
        pendingIceRef.current.push(candidate);
        return;
      }
      try {
        await pc.addIceCandidate(candidate);
      } catch {
        // candidato de época antiga
      }
    },
    [],
  );

  const publishPresence = useCallback(
    async (status: TeleconsultPresencePayload["status"]) => {
      if (!userId) return;
      await publishSignal(
        "presence",
        {
          status,
          role: viewerRole,
        } satisfies TeleconsultPresencePayload,
        { optional: true },
      );
    },
    [publishSignal, userId, viewerRole],
  );

  const wirePeerHandlers = useCallback(
    (pc: RTCPeerConnection) => {
      pc.ontrack = (event) => {
        rtcLog("info", "ontrack", {
          kind: event.track.kind,
          streams: event.streams.length,
          trackId: event.track.id,
        });
        const stream =
          event.streams[0] ?? new MediaStream([event.track]);
        remoteStreamRef.current = stream;
        attachStreamToVideo(remoteVideoRef.current, stream);
        setRemoteReady(true);
        setPeerPresent(true);
        peerPresentRef.current = true;
        setError(null);
        refreshDebug({ phase: "ontrack" });
        const el = remoteVideoRef.current;
        if (el) {
          void el.play().catch(() => setNeedsGesture(true));
        }
      };

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        rtcLog(
          state === "failed" ? "error" : "info",
          "connectionstate",
          summarizePc(pc),
        );
        refreshDebug({ phase: `connection:${state}` });
        if (state === "connected") {
          setRemoteReady(true);
          setPeerPresent(true);
          peerPresentRef.current = true;
          setError(null);
        } else if (state === "failed") {
          setError(
            "Conexão de vídeo falhou. Tentando reconectar… Se persistir, verifique a rede (NAT/firewall).",
          );
          try {
            pc.restartIce();
            rtcLog("warn", "restartIce_after_failed", summarizePc(pc));
          } catch {
            // browsers antigos
          }
        } else if (state === "closed") {
          setRemoteReady(false);
        }
      };

      pc.oniceconnectionstatechange = () => {
        rtcLog(
          pc.iceConnectionState === "failed" ? "error" : "info",
          "iceconnectionstate",
          {
            iceConnectionState: pc.iceConnectionState,
            iceGatheringState: pc.iceGatheringState,
          },
        );
        refreshDebug({ phase: `ice:${pc.iceConnectionState}` });
      };

      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          rtcLog("debug", "ice_gathering_complete");
          return;
        }
        rtcLog("debug", "ice_local_candidate", {
          type: event.candidate.type,
          protocol: event.candidate.protocol,
        });
        void publishSignal("ice", event.candidate.toJSON(), {
          optional: true,
        }).catch((err: unknown) => {
          setError(
            err instanceof Error
              ? err.message
              : "Falha ao enviar sinal de conexão",
          );
        });
      };
    },
    [publishSignal, refreshDebug],
  );

  const attachLocalTracks = useCallback(
    (pc: RTCPeerConnection, stream: MediaStream) => {
      for (const track of stream.getTracks()) {
        const sender = pc
          .getSenders()
          .find((s) => s.track?.kind === track.kind);
        if (sender) {
          void sender.replaceTrack(track);
        } else {
          pc.addTrack(track, stream);
        }
      }
    },
    [],
  );

  const ensurePeer = useCallback(() => {
    if (pcRef.current) return pcRef.current;
    rtcLog("info", "pc_create", { iceServers: ICE_SERVERS.length });
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;
    wirePeerHandlers(pc);
    refreshDebug({ phase: "pc_created" });
    return pc;
  }, [refreshDebug, wirePeerHandlers]);

  const recreatePeer = useCallback(
    (stream: MediaStream) => {
      rtcLog("warn", "pc_recreate", summarizePc(pcRef.current));
      offerEpochRef.current += 1;
      pcRef.current?.close();
      pcRef.current = null;
      pendingIceRef.current = [];
      deferredSdpRef.current = [];
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;
      wirePeerHandlers(pc);
      attachLocalTracks(pc, stream);
      return pc;
    },
    [attachLocalTracks, wirePeerHandlers],
  );

  const publishOffer = useCallback(
    async (pc: RTCPeerConnection) => {
      if (makingOffer.current) {
        rtcLog("debug", "offer_skipped_busy");
        return;
      }
      makingOffer.current = true;
      offerEpochRef.current += 1;
      const epoch = offerEpochRef.current;
      try {
        rtcLog("info", "offer_create_start", summarizePc(pc));
        const offer = await pc.createOffer();
        if (epoch !== offerEpochRef.current) return;
        await pc.setLocalDescription(offer);
        if (epoch !== offerEpochRef.current) return;
        await publishSignal("offer", pc.localDescription ?? offer);
        rtcLog("info", "offer_posted", {
          sdpBytes: pc.localDescription?.sdp?.length ?? 0,
          epoch,
        });
        refreshDebug({ phase: "offer_posted" });
        setError(null);
      } catch (err) {
        rtcLog("error", "offer_failed", {
          message: err instanceof Error ? err.message : String(err),
        });
        throw err;
      } finally {
        if (epoch === offerEpochRef.current) {
          makingOffer.current = false;
        }
      }
    },
    [publishSignal, refreshDebug],
  );

  const applyRemoteOffer = useCallback(
    async (pc: RTCPeerConnection, msg: TeleconsultSignalMessage) => {
      const stream = localStreamRef.current;
      if (stream) attachLocalTracks(pc, stream);
      rtcLog("info", "offer_remote_apply", {
        from: msg.fromUserId,
        signalingState: pc.signalingState,
        msgId: msg.id,
      });

      if (
        pc.signalingState !== "stable" &&
        pc.signalingState !== "have-remote-offer"
      ) {
        if (pc.signalingState === "have-local-offer" && stream) {
          rtcLog("warn", "glare_rollback_to_answerer", {
            from: msg.fromUserId,
          });
          const fresh = recreatePeer(stream);
          await fresh.setRemoteDescription(
            msg.payload as RTCSessionDescriptionInit,
          );
          const answer = await fresh.createAnswer();
          await fresh.setLocalDescription(answer);
          await publishSignal("answer", fresh.localDescription ?? answer);
          await flushPendingIce(fresh);
          rtcLog("info", "answer_posted_after_glare");
          setError(null);
          refreshDebug({ phase: "answered_glare" });
          return true;
        }
        rtcLog("warn", "offer_deferred_bad_state", {
          signalingState: pc.signalingState,
        });
        return false;
      }

      await pc.setRemoteDescription(msg.payload as RTCSessionDescriptionInit);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await publishSignal("answer", pc.localDescription ?? answer);
      await flushPendingIce(pc);
      rtcLog("info", "answer_posted", {
        sdpBytes: pc.localDescription?.sdp?.length ?? 0,
      });
      setError(null);
      refreshDebug({ phase: "answered" });
      return true;
    },
    [
      attachLocalTracks,
      flushPendingIce,
      publishSignal,
      recreatePeer,
      refreshDebug,
    ],
  );

  const applyRemoteAnswer = useCallback(
    async (pc: RTCPeerConnection, msg: TeleconsultSignalMessage) => {
      if (pc.signalingState !== "have-local-offer") {
        rtcLog("warn", "answer_ignored_wrong_state", {
          signalingState: pc.signalingState,
          from: msg.fromUserId,
        });
        return false;
      }
      try {
        await pc.setRemoteDescription(
          msg.payload as RTCSessionDescriptionInit,
        );
        await flushPendingIce(pc);
        rtcLog("info", "answer_applied", summarizePc(pc));
        setError(null);
        refreshDebug({ phase: "answer_applied" });
        return true;
      } catch (err) {
        rtcLog("error", "answer_apply_failed", {
          message: err instanceof Error ? err.message : String(err),
        });
        return false;
      }
    },
    [flushPendingIce, refreshDebug],
  );

  // Tracks locais no PC
  useEffect(() => {
    if (!enabled || !localStream) return;
    const pc = ensurePeer();
    attachLocalTracks(pc, localStream);
  }, [attachLocalTracks, enabled, ensurePeer, localStream]);

  // Reset cursor ao trocar sessão
  useEffect(() => {
    lastSignalId.current = undefined;
    deferredSdpRef.current = [];
    pendingIceRef.current = [];
    setRemoteReady(false);
    setPeerPresent(false);
    peerPresentRef.current = false;
    setPeerRole(null);
    setNeedsGesture(false);
  }, [sessionId]);

  // Oferta inicial assim que a mídia estiver pronta (não espera presença).
  // Presence ainda acelera reoffer quando o peer entra.
  useEffect(() => {
    if (!enabled || !mediaReady || !isInitiator || !localStream) return;
    if (remoteReady) return;
    let cancelled = false;

    async function createOffer() {
      try {
        const pc = ensurePeer();
        attachLocalTracks(pc, localStream!);
        if (cancelled) return;
        if (pc.signalingState !== "stable") return;
        if (pc.remoteDescription) return;
        rtcLog("info", "offer_initial", {
          peerPresent: peerPresentRef.current,
        });
        await publishOffer(pc);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Falha ao criar oferta WebRTC",
          );
        }
      }
    }

    void createOffer();
    return () => {
      cancelled = true;
    };
  }, [
    attachLocalTracks,
    enabled,
    ensurePeer,
    isInitiator,
    localStream,
    mediaReady,
    publishOffer,
    remoteReady,
  ]);

  // Quando o peer anuncia presença e ainda não há remoteDescription, reoferece.
  useEffect(() => {
    if (!enabled || !isInitiator || !mediaReady || !peerPresent || !localStream)
      return;
    if (remoteReady) return;
    const pc = pcRef.current;
    if (!pc) return;
    if (pc.remoteDescription) return;
    if (pc.signalingState === "have-local-offer" && pc.localDescription) {
      rtcLog("info", "offer_repost_on_peer_present");
      void publishSignal("offer", pc.localDescription, {
        optional: true,
      });
      return;
    }
    if (pc.signalingState === "stable") {
      void publishOffer(pc);
    }
  }, [
    enabled,
    isInitiator,
    localStream,
    mediaReady,
    peerPresent,
    publishOffer,
    publishSignal,
    remoteReady,
  ]);

  // Reoffer suave: reenvia offer sem recriar PC a cada ciclo;
  // só recria em failed ou offer órfã > 2 ciclos.
  useEffect(() => {
    if (!enabled || !isInitiator || !mediaReady || remoteReady || !localStream)
      return;
    let orphanCycles = 0;
    const interval = window.setInterval(() => {
      if (makingOffer.current || remoteReady) return;
      const existing = pcRef.current;
      if (!existing) return;
      if (existing.connectionState === "connected") return;
      // Sem peer e ainda stable: oferta inicial já cuidou; evita spam.
      if (!peerPresentRef.current && existing.signalingState === "stable") {
        return;
      }

      void (async () => {
        try {
          let pc = existing;
          if (pc.connectionState === "failed") {
            pc = recreatePeer(localStream);
            orphanCycles = 0;
            await publishOffer(pc);
            return;
          }
          if (pc.remoteDescription) {
            try {
              pc.restartIce();
            } catch {
              // ignore
            }
            return;
          }
          if (pc.signalingState === "have-local-offer") {
            orphanCycles += 1;
            // Reenvia a mesma localDescription se ainda válida; recrea só após 2 ciclos (~20s)
            if (orphanCycles >= 2) {
              pc = recreatePeer(localStream);
              orphanCycles = 0;
              await publishOffer(pc);
            } else if (pc.localDescription) {
              await publishSignal("offer", pc.localDescription, {
                optional: true,
              });
            }
            return;
          }
          if (pc.signalingState !== "stable") return;
          orphanCycles = 0;
          await publishOffer(pc);
        } catch {
          // próximo ciclo
        }
      })();
    }, REOFFER_MS);
    return () => window.clearInterval(interval);
  }, [
    enabled,
    isInitiator,
    localStream,
    mediaReady,
    publishOffer,
    publishSignal,
    recreatePeer,
    remoteReady,
  ]);

  // Presence announce + heartbeat (mapa no servidor; não enche ring SDP)
  useEffect(() => {
    if (!enabled || !mediaReady || !userId) return;
    let cancelled = false;
    void publishPresence("joined");
    const interval = window.setInterval(() => {
      if (!cancelled) void publishPresence("heartbeat");
    }, HEARTBEAT_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      void publishPresence("left");
    };
  }, [enabled, mediaReady, publishPresence, userId]);

  // Poll signaling com generation token (mata loops duplicados)
  useEffect(() => {
    if (!enabled || !mediaReady || !userId) return;
    const gen = ++pollGenRef.current;

    async function poll() {
      rtcLog("info", "signal_poll_start", {
        orgId,
        sessionId,
        isInitiator: isInitiatorRef.current,
        gen,
      });
      while (pollGenRef.current === gen) {
        try {
          const messages = await pullTeleconsultSignals(
            orgId,
            sessionId,
            lastSignalId.current,
          );
          if (pollGenRef.current !== gen) return;
          pollCountRef.current += 1;

          const initiator = isInitiatorRef.current;
          const remoteMessages = messages.filter(
            (m) => m.fromUserId !== userId,
          );

          if (remoteMessages.length > 0) {
            const summary = remoteMessages
              .map((m) => m.type)
              .join(",");
            lastSignalSummaryRef.current = summary;
            rtcLog("info", "signal_batch", {
              count: remoteMessages.length,
              types: summary,
              afterId: lastSignalId.current ?? null,
              poll: pollCountRef.current,
            });
            refreshDebug({ phase: "signal_batch" });
          } else if (pollCountRef.current % 10 === 0) {
            rtcLog("debug", "signal_poll_idle", {
              poll: pollCountRef.current,
              ...summarizePc(pcRef.current),
            });
            refreshDebug({ phase: "poll_idle" });
          }

          // Presence (ids sintéticos — não avançam cursor SDP)
          for (const msg of remoteMessages) {
            if (msg.type !== "presence") continue;
            const payload = msg.payload as TeleconsultPresencePayload & {
              gap?: boolean;
            };
            if (!payload?.status) continue;
            if (payload.status === "left") {
              setPeerPresent(false);
              peerPresentRef.current = false;
              setPeerRole(null);
            } else {
              setPeerPresent(true);
              peerPresentRef.current = true;
              if (payload.role) {
                setPeerRole(payload.role as TeleconsultViewerRole);
              }
            }
            if (payload.gap) {
              // Cursor perdido — força reoffer no próximo ciclo do initiator
              deferredSdpRef.current = [];
            }
          }

          const pc = ensurePeer();
          const stream = localStreamRef.current;
          if (stream) attachLocalTracks(pc, stream);

          // Retry SDP adiado
          if (deferredSdpRef.current.length > 0) {
            const pending = [...deferredSdpRef.current];
            deferredSdpRef.current = [];
            for (const msg of pending) {
              if (msg.type === "offer" && !initiator) {
                const ok = await applyRemoteOffer(pc, msg);
                if (!ok) deferredSdpRef.current.push(msg);
              } else if (msg.type === "answer" && initiator) {
                const ok = await applyRemoteAnswer(pc, msg);
                if (!ok) deferredSdpRef.current.push(msg);
              }
            }
          }

          const latestOffer = !initiator
            ? [...remoteMessages]
                .reverse()
                .find((m) => m.type === "offer")
            : undefined;

          // Aplica SDP; só avança cursor em mensagens processadas com sucesso
          // (presence não está no ring — ids começam com "presence-")
          for (const msg of remoteMessages) {
            if (msg.type === "presence") continue;

            if (msg.type === "offer") {
              if (initiator) {
                // Perfect negotiation (polite): cede se nosso userId > do peer
                const polite =
                  !!userId && !!msg.fromUserId && userId > msg.fromUserId;
                if (!polite) {
                  lastSignalId.current = msg.id;
                  continue;
                }
              } else if (latestOffer && msg.id !== latestOffer.id) {
                lastSignalId.current = msg.id;
                continue;
              }
              const ok = await applyRemoteOffer(pc, msg);
              if (ok) {
                lastSignalId.current = msg.id;
              } else {
                deferredSdpRef.current.push(msg);
              }
              continue;
            }

            if (msg.type === "answer" && initiator) {
              const ok = await applyRemoteAnswer(pc, msg);
              if (ok) {
                lastSignalId.current = msg.id;
              } else {
                deferredSdpRef.current.push(msg);
              }
              continue;
            }

            if (msg.type === "ice") {
              await addIceCandidateSafe(
                pcRef.current ?? pc,
                msg.payload as RTCIceCandidateInit,
              );
              lastSignalId.current = msg.id;
              continue;
            }

            // answer para answerer / etc. — descarta
            lastSignalId.current = msg.id;
          }
        } catch (err) {
          if (pollGenRef.current === gen) {
            rtcLog("error", "signal_poll_error", {
              message: err instanceof Error ? err.message : String(err),
            });
            setError(
              err instanceof Error
                ? err.message
                : "Falha na conexão com o servidor de sinais",
            );
            refreshDebug({
              phase: "poll_error",
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
        await new Promise((r) => setTimeout(r, POLL_MS));
      }
    }

    void poll();
    return () => {
      // Invalida este loop; o próximo effect (se houver) sobe gen.
      if (pollGenRef.current === gen) {
        pollGenRef.current += 1;
      }
    };
  }, [
    addIceCandidateSafe,
    applyRemoteAnswer,
    applyRemoteOffer,
    attachLocalTracks,
    enabled,
    ensurePeer,
    mediaReady,
    orgId,
    refreshDebug,
    sessionId,
    userId,
  ]);

  // Snapshot periódico do PC enquanto a sala está ativa
  useEffect(() => {
    if (!enabled || !mediaReady) return;
    rtcLog("info", "session_boot", {
      orgId,
      sessionId,
      userId,
      isInitiator,
      viewerRole,
    });
    const id = window.setInterval(() => {
      refreshDebug({ phase: "tick" });
    }, 3000);
    return () => window.clearInterval(id);
  }, [
    enabled,
    isInitiator,
    mediaReady,
    orgId,
    refreshDebug,
    sessionId,
    userId,
    viewerRole,
  ]);

  const teardown = useCallback(async () => {
    rtcLog("info", "teardown");
    pollGenRef.current += 1;
    void publishPresence("left");
    pcRef.current?.close();
    pcRef.current = null;
    remoteStreamRef.current = null;
    deferredSdpRef.current = [];
    pendingIceRef.current = [];
    setRemoteReady(false);
    setPeerPresent(false);
    peerPresentRef.current = false;
    setNeedsGesture(false);
    setDebugInfo({ phase: "torn_down" });
  }, [publishPresence]);

  useEffect(() => {
    return () => {
      pollGenRef.current += 1;
      pcRef.current?.close();
      pcRef.current = null;
      remoteStreamRef.current = null;
    };
  }, []);

  return {
    bindRemoteVideo,
    remoteVideoRef,
    remoteReady,
    peerPresent,
    peerRole,
    needsGesture,
    tryPlayRemote,
    debugInfo,
    error,
    setError,
    teardown,
  };
}
