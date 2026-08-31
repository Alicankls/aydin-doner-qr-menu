import { ImageResponse } from "next/og";

export const alt = "Aydın Döner | Çorlu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F2E8",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 160,
            height: 160,
            borderRadius: 32,
            background: "#B82F3D",
            color: "#FFFFFF",
            fontSize: 96,
            fontWeight: 800,
            marginBottom: 32,
          }}
        >
          A
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            color: "#252525",
          }}
        >
          Aydın Döner
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            fontWeight: 500,
            color: "#6F6F6F",
          }}
        >
          Çorlu / Tekirdağ
        </div>
      </div>
    ),
    { ...size }
  );
}
