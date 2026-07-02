import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "TVDex - Jio STB Channel Guide";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to right bottom, #0f172a, #020617)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "#3b82f6",
              borderRadius: "24px",
              width: "120px",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 80px rgba(59, 130, 246, 0.5)",
              marginRight: "40px",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              style={{ width: "70px", height: "70px", color: "white" }}
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8" />
              <path d="M12 17v4" />
              <path d="M7 8l3 3-3 3" />
              <line x1="13" y1="13" x2="17" y2="13" />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "120px",
              fontWeight: 800,
              letterSpacing: "-0.05em",
            }}
          >
            <span style={{ color: "#60a5fa" }}>TV</span>
            <span style={{ color: "white" }}>Dex</span>
          </div>
        </div>

        <div
          style={{
            fontSize: "56px",
            color: "#94a3b8",
            textAlign: "center",
            fontWeight: 600,
            maxWidth: "1000px",
            lineHeight: 1.4,
          }}
        >
          Jio STB Channel List & Guide
        </div>
        
        <div
          style={{
            marginTop: "30px",
            fontSize: "36px",
            color: "#475569",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          800+ Channels • 12+ Languages • Full PDF Guide
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
