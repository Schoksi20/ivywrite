"use client";

import { useEffect, useState } from "react";

export function RotatingWords({
  words,
  interval = 2600,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase("out");
      setTimeout(() => {
        setIdx(i => (i + 1) % words.length);
        setPhase("in");
      }, 380);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        clipPath: phase === "in" ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
        transform: phase === "in" ? "translateY(0)" : "translateY(-15%)",
        transition:
          "clip-path 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {words[idx]}
    </span>
  );
}
