import type { CSSProperties } from "react";

export function BorderBeam({
  size = 120,
  duration = 6,
  colorFrom = "#6366f1",
  colorTo = "transparent",
  borderRadius = "1rem",
}: {
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  borderRadius?: string;
}) {
  return (
    <div
      aria-hidden
      style={
        {
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          border: "1.5px solid transparent",
          WebkitMaskClip: "padding-box, border-box",
          WebkitMaskComposite: "destination-out",
          maskClip: "padding-box, border-box",
          maskComposite: "exclude",
          mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          pointerEvents: "none",
          overflow: "hidden",
        } as CSSProperties
      }
    >
      <div
        style={{
          position: "absolute",
          width: size,
          height: size,
          background: `radial-gradient(circle, ${colorFrom} 0%, ${colorTo} 65%)`,
          offsetPath: `inset(0 round ${borderRadius})`,
          offsetDistance: "0%",
          animation: `border-beam ${duration}s linear infinite`,
        }}
      />
    </div>
  );
}
