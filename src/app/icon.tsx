import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "#6366f1",
          color: "white",
          fontSize: 16,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        TV
      </div>
    ),
    { ...size }
  );
}
