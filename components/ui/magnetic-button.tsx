"use client";

import { useRef } from "react";

export function MagneticButton({
  children,
  className,
  strength = 0.28,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0,0)";
  }

  return (
    <div
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
    </div>
  );
}
