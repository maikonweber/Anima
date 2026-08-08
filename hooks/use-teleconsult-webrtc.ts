"use client";

/**
 * WebRTC 1:1 para teleconsulta — signaling via HTTP poll (sem WebSocket).
 * Presence (joined/left/heartbeat) usa o mesmo canal de sinais.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  postTeleconsultSignal,
  pullTeleconsultSignals,
} from "@/lib/api/teleconsult";
import type {
  TeleconsultPresencePayload,
  TeleconsultViewerRole,
} from "@anima/shared";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

const POLL_MS = 1200;
const REOFFER_MS = 8000;
const HEARTBEAT_MS = 5000;

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
  const pollStopped = useRef(false);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const offerEpochRef = useRef(0);

  const [remoteReady, setRemoteReady] = useState(false);
  const [peerPresent, setPeerPresent] = useState(false);
  const [peerRole, setPeerRole] = useState<TeleconsultViewerRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  const attachStreamToVideo = useCallback(
    (el: HTMLVideoElement | null, stream: MediaStream | null) => {
      if (!el || !stream) return;
      if (el.srcObject !== stream) {
        el.srcObject = stream;
      }
      void el.play().catch(() => {
        /* autoplay bloqueado */
      });
    },
    [],
  );

  const bindRemoteVideo = useCallback(
    (el: HTMLVideoElement | null) => {
      remoteVideoRef.current = el;
      attachStreamToVideo(el, remoteStreamRef.current);
    },
    [attachStreamToVideo],
  );

  const flushPendingIce = useCallback(async (pc: RTCPeerConnection) => {
    if (!pc.remoteDescription) return;
    const pending = [...pendingIceRef.current];
    pendingIceRef.current = [];
    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(candidate);
      } catch {
        // candidato expirado ou duplicado
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
        pendingIceRef.current.push(candidate);
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
          payload: { status, role: viewerRole } satisfies TeleconsultPresencePayload,
        });
      } catch {
        // presence é best-effort
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
        setError(null);
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setRemoteReady(true);
          setPeerPresent(true);
          setError(null);
        } else if (pc.connectionState === "failed") {
          setError(
            "Conexão de vídeo falhou. Verifique a rede ou peça ao outro participante para recarregar.",
          );
        } else if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "closed"
        ) {
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
    [attachStreamToVideo, orgId, sessionId],
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
      pcRef.current?.close();
      pcRef.current = null;
      pendingIceRef.current = [];
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
      makingOffer.current = true;
      offerEpochRef.current += 1;
      const epoch = offerEpochRef.current;
      try {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
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

  useEffect(() => {
    if (!enabled || !localStream) return;
    const pc = ensurePeer();
    attachLocalTracks(pc, localStream);
  }, [attachLocalTracks, enabled, ensurePeer, localStream]);

  // Oferta inicial
  useEffect(() => {
    if (!enabled || !mediaReady || !isInitiator || !localStream) return;
    let cancelled = false;

    async function createOffer() {
      try {
        const pc = ensurePeer();
        attachLocalTracks(pc, localStream!);
        if (cancelled) return;
        if (pc.signalingState !== "stable") return;
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
  ]);

  // Reoferece se o peer entrar depois
  useEffect(() => {
    if (!enabled || !isInitiator || !mediaReady || remoteReady || !localStream)
      return;
    const interval = window.setInterval(() => {
      if (makingOffer.current || remoteReady) return;
      const existing = pcRef.current;
      if (!existing) return;
      if (existing.connectionState === "connected") return;

      void (async () => {
        try {
          let pc = existing;
          if (pc.remoteDescription) {
            if (pc.connectionState === "failed") {
              pc = recreatePeer(localStream);
              await publishOffer(pc);
            }
            return;
          }
          if (pc.signalingState === "have-local-offer") {
            pc = recreatePeer(localStream);
          } else if (pc.signalingState !== "stable") {
            return;
          }
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
    recreatePeer,
    remoteReady,
  ]);

  // Presence announce + heartbeat
  useEffect(() => {
    if (!enabled || !mediaReady || !userId) return;
    void publishPresence("joined");
    const interval = window.setInterval(() => {
      void publishPresence("heartbeat");
    }, HEARTBEAT_MS);
    return () => {
      window.clearInterval(interval);
      void publishPresence("left");
    };
  }, [enabled, mediaReady, publishPresence, userId]);

  // Poll signaling
  useEffect(() => {
    if (!enabled || !mediaReady || !userId) return;
    pollStopped.current = false;
    let lastPeerSeenAt = 0;

    async function poll() {
      while (!pollStopped.current) {
        try {
          const messages = await pullTeleconsultSignals(
            orgId,
            sessionId,
            lastSignalId.current,
          );
          const latestOfferId = !isInitiator
            ? [...messages]
                .reverse()
                .find((m) => m.type === "offer" && m.fromUserId !== userId)
                ?.id
            : undefined;

          const remoteMessages = messages.filter(
            (m) => m.fromUserId !== userId,
          );
          for (const msg of messages) {
            lastSignalId.current = msg.id;
          }

          for (const msg of remoteMessages) {
            if (msg.type !== "presence") continue;
            const payload = msg.payload as TeleconsultPresencePayload;
            if (!payload?.status) continue;
            if (payload.status === "left") {
              setPeerPresent(false);
              setPeerRole(null);
            } else {
              lastPeerSeenAt = Date.now();
              setPeerPresent(true);
              if (payload.role) setPeerRole(payload.role);
            }
          }

          if (lastPeerSeenAt && Date.now() - lastPeerSeenAt > HEARTBEAT_MS * 3) {
            setPeerPresent(false);
          }

          const pc = ensurePeer();
          if (localStream) attachLocalTracks(pc, localStream);

          for (const msg of remoteMessages) {
            if (msg.type === "offer" && !isInitiator) {
              if (latestOfferId && msg.id !== latestOfferId) continue;
              if (
                pc.signalingState !== "stable" &&
                pc.signalingState !== "have-remote-offer"
              ) {
                continue;
              }
              await pc.setRemoteDescription(
                msg.payload as RTCSessionDescriptionInit,
              );
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              await postTeleconsultSignal(orgId, sessionId, {
                type: "answer",
                payload: pc.localDescription ?? answer,
              });
              await flushPendingIce(pc);
              setError(null);
            } else if (msg.type === "answer" && isInitiator) {
              if (pc.signalingState !== "have-local-offer") continue;
              try {
                await pc.setRemoteDescription(
                  msg.payload as RTCSessionDescriptionInit,
                );
                await flushPendingIce(pc);
                setError(null);
              } catch {
                // answer órfã
              }
            }
          }

          for (const msg of remoteMessages) {
            if (msg.type !== "ice") continue;
            await addIceCandidateSafe(pc, msg.payload as RTCIceCandidateInit);
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Falha na conexão com o servidor de sinais",
          );
        }
        await new Promise((r) => setTimeout(r, POLL_MS));
      }
    }

    void poll();
    return () => {
      pollStopped.current = true;
    };
  }, [
    addIceCandidateSafe,
    attachLocalTracks,
    enabled,
    ensurePeer,
    flushPendingIce,
    isInitiator,
    localStream,
    mediaReady,
    orgId,
    sessionId,
    userId,
  ]);

  const teardown = useCallback(async () => {
    pollStopped.current = true;
    void publishPresence("left");
    pcRef.current?.close();
    pcRef.current = null;
    remoteStreamRef.current = null;
    setRemoteReady(false);
    setPeerPresent(false);
  }, [publishPresence]);

  useEffect(() => {
    return () => {
      pollStopped.current = true;
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
    error,
    setError,
    teardown,
  };
}
