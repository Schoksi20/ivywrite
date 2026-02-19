"use client";

import { useState } from "react";
import { AnimatedSection } from "./stats";

const faqs = [
  {
    q: "Are these written by actual Ivy League students?",
    a: "Yes. Every writer on our platform is a current student or recent graduate of a top-10 global university, including Harvard, Yale, MIT, Stanford, Princeton, and Columbia. We verify credentials during onboarding and only accept writers from qualifying programs.",
  },
  {
    q: "How is this different from using ChatGPT or another AI tool?",
    a: "A real human being who has been through the admissions process at the school you are targeting writes your SOP. They understand what admissions committees look for because they have experienced it themselves. AI does not know what Harvard SEAS values in 2025. Our writers do.",
  },
  {
    q: "What if I need changes after I receive my SOP?",
    a: "Every SOP includes one free revision. Simply reply to your delivery email with your feedback and the same writer will update your statement within 24 hours at no extra cost.",
  },
  {
    q: "Can you write SOPs for multiple programs or schools?",
    a: "Absolutely. Each program gets its own tailored SOP. Order separately for each school or contact us for a bundle discount if you are applying to three or more programs.",
  },
  {
    q: "Is using a writing service for my SOP ethical?",
    a: "Using a professional to help craft your statement of purpose is a widely accepted and long-standing practice. It is no different from hiring a college counselor, which thousands of students do every year. Your ideas, your experiences, your life. We help you tell it powerfully.",
  },
  {
    q: "What information will I need to provide?",
    a: "After payment, you will receive a structured questionnaire covering your academic background, research or work experience, reasons for applying, career goals, and notable achievements. It takes about 15 minutes and forms the foundation your writer uses to craft your statement.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-surface border-t border-border" id="faq">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="text-xs tracking-wider uppercase text-accent font-semibold mb-4">FAQ</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-heading">
            Common questions
          </h2>
        </AnimatedSection>

        <AnimatedSection className="mt-12">
          <div>
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} className="border-b border-border">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full bg-transparent border-none text-heading text-left py-6 text-base font-semibold cursor-pointer flex justify-between items-center gap-6 hover:text-accent transition-colors"
                  >
                    {faq.q}
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xl transition-all ${
                        isOpen
                          ? "bg-accent/10 text-accent rotate-45"
                          : "bg-surface text-muted"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all text-sm text-body leading-relaxed ${
                      isOpen ? "max-h-[300px] pb-6" : "max-h-0"
                    }`}
                  >
                    {faq.a}
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
