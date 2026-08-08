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

  isInitiatorRef.current = isInitiator;
  localStreamRef.current = localStream;
  peerPresentRef.current = peerPresent;

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
      try {
        await postTeleconsultSignal(orgId, sessionId, {
          type: "presence",
          payload: {
            status,
            role: viewerRole,
          } satisfies TeleconsultPresencePayload,
        });
      } catch {
        // best-effort
      }
    },
    [orgId, sessionId, userId, viewerRole],
  );

  const wirePeerHandlers = useCallback(
    (pc: RTCPeerConnection) => {
      pc.ontrack = (event) => {
        const stream =
          event.streams[0] ?? new MediaStream([event.track]);
        remoteStreamRef.current = stream;
        attachStreamToVideo(remoteVideoRef.current, stream);
        setRemoteReady(true);
        setPeerPresent(true);
        peerPresentRef.current = true;
        setError(null);
        // Tenta tocar; se o browser bloquear áudio, UI pede gesto.
        const el = remoteVideoRef.current;
        if (el) {
          void el.play().catch(() => setNeedsGesture(true));
        }
      };

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
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
          } catch {
            // browsers antigos
          }
        } else if (state === "disconnected") {
          // pode ser transitório — não derruba UI imediatamente
        } else if (state === "closed") {
          setRemoteReady(false);
        }
      };

      pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        void postTeleconsultSignal(orgId, sessionId, {
          type: "ice",
          payload: event.candidate.toJSON(),
        }).catch((err: unknown) => {
          setError(
            err instanceof Error
              ? err.message
              : "Falha ao enviar sinal de conexão",
          );
        });
      };
    },
    [orgId, sessionId],
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
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;
    wirePeerHandlers(pc);
    return pc;
  }, [wirePeerHandlers]);

  const recreatePeer = useCallback(
    (stream: MediaStream) => {
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
      if (makingOffer.current) return;
      makingOffer.current = true;
      offerEpochRef.current += 1;
      const epoch = offerEpochRef.current;
      try {
        const offer = await pc.createOffer();
        if (epoch !== offerEpochRef.current) return;
        await pc.setLocalDescription(offer);
        if (epoch !== offerEpochRef.current) return;
        await postTeleconsultSignal(orgId, sessionId, {
          type: "offer",
          payload: pc.localDescription ?? offer,
        });
        setError(null);
      } finally {
        if (epoch === offerEpochRef.current) {
          makingOffer.current = false;
        }
      }
    },
    [orgId, sessionId],
  );

  const applyRemoteOffer = useCallback(
    async (pc: RTCPeerConnection, msg: TeleconsultSignalMessage) => {
      const stream = localStreamRef.current;
      if (stream) attachLocalTracks(pc, stream);

      if (
        pc.signalingState !== "stable" &&
        pc.signalingState !== "have-remote-offer"
      ) {
        // Glare: se temos offer local e recebemos offer remota, recria como answerer.
        if (pc.signalingState === "have-local-offer" && stream) {
          const fresh = recreatePeer(stream);
          await fresh.setRemoteDescription(
            msg.payload as RTCSessionDescriptionInit,
          );
          const answer = await fresh.createAnswer();
          await fresh.setLocalDescription(answer);
          await postTeleconsultSignal(orgId, sessionId, {
            type: "answer",
            payload: fresh.localDescription ?? answer,
          });
          await flushPendingIce(fresh);
          setError(null);
          return true;
        }
        return false;
      }

      await pc.setRemoteDescription(msg.payload as RTCSessionDescriptionInit);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await postTeleconsultSignal(orgId, sessionId, {
        type: "answer",
        payload: pc.localDescription ?? answer,
      });
      await flushPendingIce(pc);
      setError(null);
      return true;
    },
    [attachLocalTracks, flushPendingIce, orgId, recreatePeer, sessionId],
  );

  const applyRemoteAnswer = useCallback(
    async (pc: RTCPeerConnection, msg: TeleconsultSignalMessage) => {
      if (pc.signalingState !== "have-local-offer") return false;
      try {
        await pc.setRemoteDescription(
          msg.payload as RTCSessionDescriptionInit,
        );
        await flushPendingIce(pc);
        setError(null);
        return true;
      } catch {
        return false;
      }
    },
    [flushPendingIce],
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

  // Oferta inicial — prefere esperar presença do peer; fallback após 12s
  useEffect(() => {
    if (!enabled || !mediaReady || !isInitiator || !localStream) return;
    if (remoteReady) return;
    let cancelled = false;
    let fallbackTimer: number | undefined;

    async function createOffer() {
      try {
        const pc = ensurePeer();
        attachLocalTracks(pc, localStream!);
        if (cancelled) return;
        if (pc.signalingState !== "stable") return;
        if (pc.remoteDescription) return;
        await publishOffer(pc);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Falha ao criar oferta WebRTC",
          );
        }
      }
    }

    if (peerPresent) {
      void createOffer();
    } else {
      fallbackTimer = window.setTimeout(() => {
        if (!cancelled && !remoteReady) void createOffer();
      }, 12_000);
    }

    return () => {
      cancelled = true;
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, [
    attachLocalTracks,
    enabled,
    ensurePeer,
    isInitiator,
    localStream,
    mediaReady,
    peerPresent,
    publishOffer,
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
      // Sem presença ainda: deixa o fallback de 12s / próximo ciclo cuidar
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
              await postTeleconsultSignal(orgId, sessionId, {
                type: "offer",
                payload: pc.localDescription,
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
    orgId,
    publishOffer,
    recreatePeer,
    remoteReady,
    sessionId,
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
      while (pollGenRef.current === gen) {
        try {
          const messages = await pullTeleconsultSignals(
            orgId,
            sessionId,
            lastSignalId.current,
          );
          if (pollGenRef.current !== gen) return;

          const initiator = isInitiatorRef.current;
          const remoteMessages = messages.filter(
            (m) => m.fromUserId !== userId,
          );

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
            setError(
              err instanceof Error
                ? err.message
                : "Falha na conexão com o servidor de sinais",
            );
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
    sessionId,
    userId,
  ]);

  const teardown = useCallback(async () => {
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
    error,
    setError,
    teardown,
  };
}
