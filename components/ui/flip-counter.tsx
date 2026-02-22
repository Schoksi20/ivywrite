"use client";

import { useEffect, useRef, useState } from "react";

const LINE = 1.18; // em height per digit row

function DigitSlot({
  char,
  triggered,
  delay,
}: {
  char: string;
  triggered: boolean;
  delay: number;
}) {
  const isNum = /^\d$/.test(char);

  if (!isNum) {
    // comma, period, etc. — static
    return <span className="inline-block">{char}</span>;
  }

  const target = parseInt(char, 10);

  return (
    <span
      className="inline-block overflow-hidden align-bottom"
      style={{ height: `${LINE}em` }}
    >
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: `${LINE}em`,
          transform: triggered
            ? `translateY(calc(-${target} * ${LINE}em))`
            : "translateY(0)",
          transition: triggered
            ? `transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
            : "none",
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} style={{ display: "block", textAlign: "center" }}>
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

export function FlipCounter({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // e.g. 2400 → "2,400", count only numeric chars for delay calc
  const formatted = value.toLocaleString("en-IN");
  const chars = formatted.split("");
  const totalDigits = chars.filter((c) => /\d/.test(c)).length;

  let digitIdx = 0;
  const charInfos = chars.map((ch) => {
    const isNum = /\d/.test(ch);
    const idx = isNum ? digitIdx++ : -1;
    return { ch, idx };
  });

  return (
    <span ref={ref} className={`inline-flex items-end ${className ?? ""}`}>
      {prefix && <span>{prefix}</span>}
      {charInfos.map(({ ch, idx }, i) => (
        <DigitSlot
          key={i}
          char={ch}
          triggered={triggered}
          // Rightmost digit (least significant) settles first — odometer feel
          delay={idx >= 0 ? (totalDigits - 1 - idx) * 70 : 0}
        />
      ))}
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
