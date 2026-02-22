"use client";

import { useEffect, useRef } from "react";

export function DrawCheck({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (path) {
              path.style.transition = `stroke-dashoffset 0.55s cubic-bezier(0.16,1,0.3,1)`;
              path.style.strokeDashoffset = "0";
            }
          }, delay);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(svg);
    return () => io.disconnect();
  }, [delay]);

  return (
    <svg ref={svgRef} viewBox="0 0 14 14" fill="none" className={className}>
      <path
        ref={pathRef}
        d="M2 7l3.5 3.5L12 3"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
