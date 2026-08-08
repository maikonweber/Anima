/**
 * Logs de diagnóstico da teleconsulta / WebRTC.
 * Ativo por padrão; desligar: localStorage.setItem('teleconsultDebug','0')
 * Ligar: localStorage.setItem('teleconsultDebug','1') ou ?debug=webrtc
 */

const PREFIX = "[teleconsult:webrtc]";

export function isTeleconsultDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") === "webrtc") return true;
    const flag = window.localStorage.getItem("teleconsultDebug");
    if (flag === "0" || flag === "false") return false;
    // padrão: ligado (fase de estabilização da sala)
    return true;
  } catch {
    return true;
  }
}

export function rtcLog(
  level: "info" | "warn" | "error" | "debug",
  event: string,
  data?: Record<string, unknown>,
) {
  if (!isTeleconsultDebugEnabled()) return;
  const payload = data ? { ...data, t: new Date().toISOString() } : { t: new Date().toISOString() };
  const line = `${PREFIX} ${event}`;
  if (level === "error") console.error(line, payload);
  else if (level === "warn") console.warn(line, payload);
  else if (level === "debug") console.debug(line, payload);
  else console.info(line, payload);
}

export function summarizePc(pc: RTCPeerConnection | null) {
  if (!pc) return { pc: null };
  return {
    connectionState: pc.connectionState,
    iceConnectionState: pc.iceConnectionState,
    iceGatheringState: pc.iceGatheringState,
    signalingState: pc.signalingState,
    hasLocalDescription: !!pc.localDescription,
    hasRemoteDescription: !!pc.remoteDescription,
    senders: pc.getSenders().map((s) => ({
      kind: s.track?.kind ?? null,
      enabled: s.track?.enabled ?? null,
      readyState: s.track?.readyState ?? null,
    })),
    receivers: pc.getReceivers().map((r) => ({
      kind: r.track?.kind ?? null,
      readyState: r.track?.readyState ?? null,
    })),
  };
}
