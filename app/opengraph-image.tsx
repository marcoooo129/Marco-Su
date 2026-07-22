import { ImageResponse } from "next/og";

export const alt = "Marco Su — Independent Product Maker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0D0C0F",
        color: "#F1F0ED",
        padding: "64px 72px",
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
        <span>MARCO SU / FLORENCE</span>
        <span style={{ color: "#21A35C" }}>2026</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 82, lineHeight: 1.04, maxWidth: 980 }}>
          Not trained as a programmer. Serious about building products.
        </div>
        <div style={{ fontSize: 25, color: "#8C898F" }}>
          LOGISTICS → COMMUNICATION → AI-NATIVE PRODUCTS
        </div>
      </div>
    </div>,
    size,
  );
}
