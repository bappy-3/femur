import { ImageResponse } from "next/og";

export const alt = "Femur Physiotherapy & Wellness Center";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social-sharing preview card (WhatsApp, Facebook, etc.). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, background: "linear-gradient(135deg,#0E3F2F,#1B7452)", color: "#F6FBF8" }}>
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#83B1A0", textTransform: "uppercase", display: "flex" }}>Physiotherapy &amp; Wellness</div>
        <div style={{ fontSize: 120, fontWeight: 700, marginTop: 18, display: "flex" }}>Femur</div>
        <div style={{ fontSize: 44, marginTop: 14, color: "#D6A77A", display: "flex" }}>Live Better.</div>
      </div>
    ),
    size,
  );
}
