"use client";

import { useState } from "react";
import { AnimatedSection } from "./stats";

const tabs = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <rect x="3" y="3" width="26" height="26" rx="5" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M9 10h6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 15h14" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9 19.5h10" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9 24h6" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="24" cy="10" r="3.5" fill="var(--accent)" opacity="0.15" stroke="var(--accent)" strokeWidth="1.4" />
        <path d="M22.5 10l1.2 1.2 2.3-2.4" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Smart questionnaire",
    desc: "Answer targeted prompts about your background, goals, and target school.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="12" cy="11" r="5" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M4 27c0-4.4 3.6-8 8-8" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="22" cy="13" r="4" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M28 27c0-3.9-2.7-7-6-7" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M14 27h6" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="17" cy="6" r="2" fill="var(--accent)" opacity="0.2" />
        <path d="M19 22l2-2 3 3" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Writer matching",
    desc: "We match you with an Ivy-admitted writer in your exact field and program type.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M8 4h12l6 6v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M20 4v6h6" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 16h12M10 20h8M10 24h5" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="9" y="12" width="14" height="15" rx="1" fill="var(--accent)" opacity="0.06" />
      </svg>
    ),
    title: "Human-crafted SOP",
    desc: "Your writer builds a fully original, narrative-driven statement using your answers.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <rect x="3" y="7" width="26" height="19" rx="3" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M3 10l13 9 13-9" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="4" fill="var(--accent)" opacity="0.12" />
        <path d="M14.5 16l1.2 1.2 2.3-2.4" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
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
                  className={`group relative p-6 text-left border rounded-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${
                    isActive
                      ? "bg-accent/5 border-accent shadow-lg shadow-accent/10"
                      : "bg-card border-border hover:border-accent/40 hover:shadow-md"
                  }`}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl transition-all duration-500"
                    style={{
                      background: "var(--accent)",
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left",
                    }}
                  />

                  <div
                    className="w-10 h-10 mb-4 transition-all duration-300 shrink-0"
                    style={{
                      transform: isActive ? "scale(1.15) rotate(-4deg)" : "scale(1) rotate(0deg)",
                    }}
                  >
                    {tab.icon}
                  </div>

                  <div
                    className="text-sm font-bold mb-2 transition-colors duration-300 shrink-0"
                    style={{ color: isActive ? "var(--accent)" : "var(--heading)" }}
                  >
                    {tab.title}
                  </div>

                  <div
                    className="text-xs text-body leading-relaxed transition-opacity duration-300 flex-1"
                    style={{ opacity: isActive ? 1 : 0.7 }}
                  >
                    {tab.desc}
                  </div>

                  <div
                    className="mt-4 text-xs font-bold transition-all duration-300 shrink-0"
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
