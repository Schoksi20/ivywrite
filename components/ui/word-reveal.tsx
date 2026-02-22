"use client";

import { useEffect, useRef } from "react";

export function WordReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll<HTMLElement>("[data-word-inner]").forEach((w, i) => {
            setTimeout(() => {
              w.style.transform = "translateY(0)";
            }, delay + i * 85);
          });
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  const words = text.split(" ");

  return (
    <span
      ref={containerRef}
      className={`inline-flex flex-wrap gap-x-[0.28em] ${className ?? ""}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden leading-[1.15]">
          <span
            data-word-inner
            className="inline-block"
            style={{
              transform: "translateY(115%)",
              transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
