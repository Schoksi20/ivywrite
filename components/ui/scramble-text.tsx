"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function ScrambleText({
  text,
  className,
  delay = 0,
  charDelay = 38,
}: {
  text: string;
  className?: string;
  delay?: number;
  charDelay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(text);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || triggered.current) return;
        triggered.current = true;
        io.unobserve(el);

        setTimeout(() => {
          const chars = text.split("");
          const locked = new Array(chars.length).fill(false);
          let frame = 0;
          // how many scramble frames before each char locks
          const lockAt = chars.map((_, i) => i * 2 + 4);

          const interval = setInterval(() => {
            frame++;
            const next = chars.map((c, i) => {
              if (locked[i]) return c;
              if (c === " ") return " ";
              if (frame >= lockAt[i]) {
                locked[i] = true;
                return c;
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            });
            setDisplayed(next.join(""));
            if (locked.every(Boolean)) clearInterval(interval);
          }, charDelay);
        }, delay);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, delay, charDelay]);

  return (
    <span ref={ref} className={className}>
      {displayed}
    </span>
  );
}
