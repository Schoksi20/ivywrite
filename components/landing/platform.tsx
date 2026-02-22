"use client";

import { useState } from "react";
import { AnimatedSection } from "./stats";

const tabs = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="4" stroke="var(--accent)" strokeWidth="1.8" />
        <path d="M9 11h14M9 16h10M9 21h7" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Smart questionnaire",
    desc: "Answer targeted prompts about your background, goals, and target school.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="10" r="5" stroke="var(--accent)" strokeWidth="1.8" />
        <path d="M6 26c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M22 8l2 2-6 6" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Writer matching",
    desc: "We match you with an Ivy-admitted writer in your exact field and program type.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M22 4H10a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" stroke="var(--accent)" strokeWidth="1.8" />
        <path d="M19 4v4H13V4M12 16l3 3 5-5" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Human-crafted SOP",
    desc: "Your writer builds a fully original, narrative-driven statement using your answers.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M4 8h24v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" stroke="var(--accent)" strokeWidth="1.8" />
        <path d="M4 8l12 10L28 8" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Delivered by email",
    desc: "Your polished SOP lands in your inbox within 72 hours. Ready to submit.",
  },
];

export function Platform() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 border-b border-border" id="platform">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-xs tracking-wider uppercase text-accent font-semibold mb-4">
            The ivywrite platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl text-heading">
            General Admissions <span className="text-accent">Intelligence</span>
          </h2>
          <p className="text-base text-body leading-relaxed max-w-2xl mt-4">
            ivywrite pairs deep knowledge of what top programs want with real
            voices from the schools you are targeting, to build an SOP that
            actually gets you in.
          </p>
        </AnimatedSection>

        <AnimatedSection className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {tabs.map((tab, i) => {
              const isActive = active === i;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`card-shine-wrap group relative p-6 text-left border rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? "bg-accent/5 border-accent shadow-lg shadow-accent/10"
                      : "bg-card border-border hover:border-accent/40 hover:shadow-md"
                  }`}
                >
                  {/* Active glow bar at top */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl transition-all duration-500"
                    style={{
                      background: "var(--accent)",
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left",
                    }}
                  />

                  {/* Icon with scale + rotate on active */}
                  <div
                    className="w-10 h-10 mb-4 transition-all duration-300"
                    style={{
                      transform: isActive ? "scale(1.15) rotate(-4deg)" : "scale(1) rotate(0deg)",
                    }}
                  >
                    {tab.icon}
                  </div>

                  <div
                    className="text-sm font-bold mb-2 transition-colors duration-300"
                    style={{ color: isActive ? "var(--accent)" : "var(--heading)" }}
                  >
                    {tab.title}
                  </div>

                  <div
                    className="text-xs text-body leading-relaxed transition-opacity duration-300"
                    style={{ opacity: isActive ? 1 : 0.7 }}
                  >
                    {tab.desc}
                  </div>

                  {/* Step number badge */}
                  <div
                    className="absolute bottom-3 right-4 text-xs font-bold transition-all duration-300"
                    style={{
                      color: isActive ? "var(--accent)" : "var(--muted)",
                      opacity: isActive ? 1 : 0.5,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </button>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
