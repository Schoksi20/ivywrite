"use client";

import { useEffect, useRef } from "react";
import { AnimatedSection } from "./stats";

const writers = [
  { init: "A", name: "Aditya Sharma", school: "Harvard University", prog: "MS Computer Science, Class of 2023. Specializes in STEM and research SOPs.", ct: "200+ SOPs delivered" },
  { init: "P", name: "Priya Nair", school: "Yale University", prog: "MBA, Class of 2024. Focuses on business school and management programs.", ct: "180+ SOPs delivered" },
  { init: "R", name: "Rohan Mehta", school: "MIT", prog: "PhD Electrical Engineering, Class of 2022. STEM research specialist.", ct: "310+ SOPs delivered" },
  { init: "S", name: "Sneha Kapoor", school: "Princeton University", prog: "MA Public Policy, Class of 2024. Policy, law, and social sciences focus.", ct: "140+ SOPs delivered" },
  { init: "K", name: "Karthik Iyer", school: "Stanford University", prog: "MS Data Science, Class of 2023. Analytics, AI, and tech programs.", ct: "220+ SOPs delivered" },
  { init: "N", name: "Neha Bose", school: "Columbia University", prog: "MFA Creative Writing, Class of 2024. Humanities and arts programs.", ct: "95+ SOPs delivered" },
  { init: "V", name: "Vikram Singh", school: "Booth (U Chicago)", prog: "MBA, Class of 2023. Finance, consulting, and leadership programs.", ct: "160+ SOPs delivered" },
  { init: "D", name: "Divya Menon", school: "Johns Hopkins", prog: "MS Public Health, Class of 2024. Medical and health science programs.", ct: "130+ SOPs delivered" },
];

export function Writers() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll<HTMLElement>("[data-card]").forEach((c, i) => {
            setTimeout(() => {
              c.style.opacity = "1";
              c.style.transform = "translateY(0)";
            }, i * 70);
          });
          io.unobserve(el);
        }
      },
      { threshold: 0.04 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-bg" id="writers">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-xs tracking-wider uppercase text-accent font-semibold mb-4">Our writers</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl text-heading">
            Real admits. <span className="text-accent">Real stories.</span>
          </h2>
          <p className="text-base text-body leading-relaxed max-w-2xl mt-4">
            Every SOP is written by a student who personally navigated admissions at the world&apos;s most
            selective universities. We verify every credential during onboarding.
          </p>
        </AnimatedSection>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {writers.map((w, i) => (
            <div
              key={i}
              data-card
              className="bg-card border border-border rounded-xl p-6 hover:border-accent/30 hover:shadow-lg transition-all"
              style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-lg font-bold text-accent mb-4">
                {w.init}
              </div>
              <div className="text-base font-bold text-heading mb-1">{w.name}</div>
              <div className="text-sm text-accent font-semibold mb-2">{w.school}</div>
              <div className="text-sm text-body leading-relaxed">{w.prog}</div>
              <div className="mt-4 text-xs text-muted flex items-center gap-1.5 font-medium">
                <span className="text-accent font-bold">&#10003;</span>
                {w.ct}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
