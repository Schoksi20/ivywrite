"use client";

import { useRef } from "react";

export function TiltCard({
  children,
  className,
  maxTilt = 6,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * maxTilt;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * maxTilt;
    el.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
    el.style.boxShadow = `${-x * 2}px ${y * 2}px 28px rgba(99,102,241,0.10)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    el.style.boxShadow = "";
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transition: "transform 0.35s cubic-bezier(0.03,0.98,0.52,0.99), box-shadow 0.35s ease",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
