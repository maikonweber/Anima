import { ImageResponse } from "next/og";

export const alt =
  "EmotiveCare · plataforma de cuidado emocional contínuo — SENTIO AI · MutterCorp";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

/** Preview social Premium (WA / LinkedIn / X / FB) — texto renderizado ao vivo para evitar dependência extra de arquivo bitmap. */
export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "linear-gradient(135deg, #1f1533 0%, #3c2f6f 52%, #5b48a8 100%)",
          fontFamily:
            '"Geist", system-ui, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, color: "#c8baf2" }}>
          MUTTERCORP · SENTIO AI
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.08,
              fontWeight: 800,
              color: "#ffffff",
              maxWidth: 900,
            }}
          >
            EmotiveCare
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 32,
              lineHeight: 1.35,
              color: "#e7e0fb",
              maxWidth: 900,
              fontWeight: 500,
            }}
          >
            O futuro do cuidado emocional · acompanhamento contínuo com IA
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 26, color: "#d6cdf5" }}>
            emotivecare.com.br
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#bfb3ee",
              textAlign: "right",
              maxWidth: "45%",
              lineHeight: 1.3,
            }}
          >
            Plataforma de saúde emocional pensada para autoconhecimento e apoio
            entre sessões — sem substituir profissionais.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
