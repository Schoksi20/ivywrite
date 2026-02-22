"use client";

import { useEffect, useRef, useState } from "react";
import { WordReveal } from "@/components/ui/word-reveal";

const steps = [
  {
    badge: "Step 01",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-[22px] h-[22px]">
        <rect x="3" y="3" width="16" height="16" rx="3" stroke="var(--accent)" strokeWidth="1.7" />
        <path d="M7 8h8M7 11h6M7 14h4" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    title: "Answer smart questions",
    desc: "Fill in our structured questionnaire about your academic background, research experience, career goals, and target program. Takes about 15 minutes to complete.",
  },
  {
    badge: "Step 02",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-[22px] h-[22px]">
        <path d="M15.5 3.5a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4L7 18H4v-3L15.5 3.5z" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.5 5.5l3 3" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    title: "An Ivy grad writes your story",
    desc: "A real writer admitted to Harvard, Yale, MIT, Stanford or another top program personally crafts your SOP. They know exactly what admissions committees want to read.",
  },
  {
    badge: "Step 03",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-[22px] h-[22px]">
        <path d="M3 5.5h16v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5.5z" stroke="var(--accent)" strokeWidth="1.7" />
        <path d="M3 5.5l8 7 8-7" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "SOP lands in your inbox",
    desc: "Within 72 hours your polished, personalized Statement of Purpose arrives by email. Ready to submit.",
  },
];

/* ── Desktop: scroll-pinned version ── */
function PinnedSteps() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalScrollable = el.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / totalScrollable);
      const raw = progress * steps.length;
      setActiveStep(Math.min(steps.length - 1, Math.floor(raw)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /* Outer div: drives scroll depth (3 × 80vh) */
    <div ref={wrapperRef} style={{ height: `${steps.length * 85}vh` }}>
      <div
        className="sticky top-0 bg-surface flex flex-col justify-center overflow-hidden"
        style={{ height: "100vh" }}
      >
        <div className="max-w-6xl mx-auto px-12 w-full">
          {/* Section label + heading */}
          <div className="mb-10">
            <div className="text-xs tracking-wider uppercase text-accent font-semibold mb-4">Process</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl text-heading">
              <WordReveal text="From blank page to" />{" "}
              <span className="text-accent"><WordReveal text="brilliant SOP" delay={320} /></span>{" "}
              <WordReveal text="in 72 hours" delay={570} />
            </h2>
          </div>

          {/* Step display */}
          <div className="relative" style={{ height: 220 }}>
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const isPrev = i < activeStep;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? "translateX(0)"
                      : isPrev
                      ? "translateX(-64px)"
                      : "translateX(64px)",
                    transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold text-accent tracking-widest uppercase mb-3">
                    {step.badge}
                  </div>
                  <h3 className="text-2xl font-bold text-heading mb-3">{step.title}</h3>
                  <p className="text-base text-body leading-relaxed max-w-lg">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-3 mt-8">
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === activeStep ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i <= activeStep ? "var(--accent)" : "var(--border-color)",
                  transition: "width 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s ease",
                }}
              />
            ))}
            <span className="text-xs text-muted font-medium ml-2">
              {activeStep + 1} / {steps.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile: original stacked version ── */
function StackedSteps() {
  return (
    <section className="py-20 px-6 bg-surface" id="how">
      <div className="max-w-6xl mx-auto">
        <div className="text-xs tracking-wider uppercase text-accent font-semibold mb-4">Process</div>
        <h2 className="text-4xl font-bold tracking-tight leading-tight max-w-2xl text-heading mb-12">
          <WordReveal text="From blank page to" />{" "}
          <span className="text-accent"><WordReveal text="brilliant SOP" delay={320} /></span>{" "}
          <WordReveal text="in 72 hours" delay={570} />
        </h2>
        <div className="flex flex-col gap-10">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-5">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                {step.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-accent tracking-widest uppercase mb-2">{step.badge}</div>
                <h3 className="text-lg font-bold text-heading mb-2">{step.title}</h3>
                <p className="text-sm text-body leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <>
      {/* Desktop only: scroll-pinned */}
      <div className="hidden md:block" id="how">
        <PinnedSteps />
      </div>

      {/* Mobile only: stacked */}
      <div className="md:hidden">
        <StackedSteps />
      </div>
    </>
  );
}
