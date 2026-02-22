"use client";

import { useEffect, useRef, useState } from "react";
import { FlipCounter } from "@/components/ui/flip-counter";

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.unobserve(el); } },
      { threshold: 0.06 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: "opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        filter: visible ? "blur(0px)" : "blur(6px)",
      }}
    >
      {children}
    </div>
  );
}

const stats = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <path d="M14.7 2.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4L6.5 16.5 2 17.5l1-4.5L14.7 2.3z" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.5 4.5l3 3" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    value: 2400,
    prefix: "",
    suffix: "+",
    desc: "SOPs delivered to students worldwide",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <path d="M10 3L19 7.5 10 12 1 7.5 10 3z" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M5 10v5c0 1.7 2.2 3 5 3s5-1.3 5-3v-5" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M19 7.5v4" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    value: 94,
    prefix: "",
    suffix: "%",
    desc: "Admit rate among ivywrite users",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <circle cx="10" cy="10" r="8" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M10 6v4l2.5 2.5" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    value: 72,
    prefix: "<",
    suffix: "h",
    desc: "Guaranteed delivery to your inbox",
  },
];

export function Stats() {
  return (
    <section className="bg-bg py-16 md:py-20">
      <AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto px-6 md:px-12">
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center md:items-start gap-4 text-center md:text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                {s.icon}
              </div>
              <div>
                <div className="text-5xl font-bold tracking-tight leading-none text-accent">
                  <FlipCounter
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                  />
                </div>
                <div className="text-sm text-body mt-2 leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}

export { AnimatedSection };
