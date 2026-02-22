"use client";

import { useEffect, useRef, useState } from "react";

export function RingCounter({
  value,
  suffix = "",
  prefix = "",
  fillPct,
  size = 88,
  strokeW = 3.5,
  icon,
  label,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  fillPct?: number;
  size?: number;
  strokeW?: number;
  icon?: React.ReactNode;
  label: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [displayed, setDisplayed] = useState(0);
  const [pct, setPct] = useState(0);
  const triggered = useRef(false);

  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const targetPct = fillPct ?? Math.min(value, 100);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || triggered.current) return;
        triggered.current = true;
        io.unobserve(el);

        const start = performance.now();
        const dur = 1600;

        function tick(now: number) {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setDisplayed(Math.round(ease * value));
          setPct(ease * targetPct);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, targetPct]);

  const dashOffset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
      <div className="relative" style={{ width: size, height: size }}>
        <svg ref={svgRef} width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="var(--accent)" strokeWidth={strokeW} opacity={0.12}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="var(--accent)" strokeWidth={strokeW}
            strokeDasharray={circ} strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
      <div>
        <div className="text-5xl font-bold tracking-tight leading-none text-accent">
          {prefix}{displayed.toLocaleString("en-IN")}{suffix}
        </div>
        <div className="text-sm text-body mt-2 leading-relaxed">{label}</div>
      </div>
    </div>
  );
}
