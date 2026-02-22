import Link from "next/link";
import { BorderBeam } from "@/components/ui/border-beam";
import { WordReveal } from "@/components/ui/word-reveal";
import { DrawCheck } from "@/components/ui/draw-check";

const checks = [
  "Ivy-trained writer matched to your field",
  "Delivered within 72 hours",
  "Plagiarism-free guarantee",
  "Refund if not delivered on time",
  "Works for all program types",
];

export function CTA() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 flex flex-col items-center text-center bg-surface border-t border-border" id="cta">
      <div className="text-2xl font-bold tracking-tight text-heading mb-8">
        ivy<span className="text-accent">write</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl text-heading mb-5">
        <WordReveal text="Get your Ivy-level SOP" />{" "}
        <WordReveal text="in 72 hours or less" delay={400} />
      </h2>

      <p className="text-lg text-body max-w-xl leading-relaxed mb-10">
        One price. One brilliant SOP. Written by someone who got into the school you are dreaming about.
      </p>

      <div className="relative inline-flex flex-col sm:flex-row items-center gap-8 bg-card border-2 border-accent/20 rounded-2xl p-8 sm:px-12 mb-8 shadow-lg overflow-hidden">
        <BorderBeam size={160} duration={5} />
        <div className="text-6xl font-bold tracking-tight leading-none text-accent">
          <sup className="text-3xl align-super">&#8377;</sup>1499
        </div>
        <div className="hidden sm:block w-px h-16 bg-border" />
        <div className="sm:w-px sm:h-0 w-24 h-px bg-border sm:hidden" />
        <div className="text-left">
          <strong className="block text-base font-bold text-heading mb-2">Per Statement of Purpose</strong>
          <span className="text-sm text-muted">Delivered in 72 hours.</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center mb-10">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-body font-medium">
            <DrawCheck className="w-4 h-4 shrink-0" delay={i * 120} />
            {c}
          </div>
        ))}
      </div>

      <Link
        href="/questionnaire"
        className="cursor-pointer bg-accent text-white text-lg font-semibold px-10 py-4 rounded-lg hover:bg-accent/90 transition-colors inline-flex items-center gap-3 shadow-lg"
      >
        Get my SOP now
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <div className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-xs font-semibold text-muted uppercase mt-6 bg-card">
        <svg viewBox="0 0 13 13" fill="none" className="w-4 h-4">
          <rect x="2" y="5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M4.5 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="6.5" cy="8.5" r="1" fill="currentColor" />
        </svg>
        100% Satisfaction Guarantee
      </div>
    </section>
  );
}
