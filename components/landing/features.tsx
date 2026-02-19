import { AnimatedSection } from "./stats";

const features = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <circle cx="10" cy="7" r="4" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M3 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M15 5l1.5 1.5L19 4" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Writer matched to your program",
    desc: "We pair you with an Ivy grad from the same discipline. A CS SOP written by an MIT grad. An MBA SOP by a Wharton admit. Domain knowledge is everything.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <circle cx="10" cy="10" r="8" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M10 6v4l2.5 2.5" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "72-hour guaranteed delivery",
    desc: "Your SOP arrives within 72 hours of completing the questionnaire. No waiting weeks. No scheduling calls. Just fast, reliable delivery every single time.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <path d="M4 10l5 5 7-8" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="10" r="8.5" stroke="var(--accent)" strokeWidth="1.4" />
      </svg>
    ),
    title: "One free revision included",
    desc: "Reply with your feedback and the same writer revises your SOP within 24 hours at no extra charge. Zero back and forth needed.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.3L10 14.4l-4.8 2.4.9-5.3L2.2 7.7l5.4-.8L10 2z" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
    title: "100% human-written",
    desc: "No AI generation. No templates. A real human being who got into the school you want reads your answers and writes your statement from scratch.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M3 8h14M8 8v9" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: "Works for all program types",
    desc: "MS, MBA, PhD, LLM, MFA, MPH. Undergraduate or graduate. STEM, business, humanities, medicine, law. We have writers across every major domain.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <rect x="3" y="6" width="14" height="11" rx="2" stroke="var(--accent)" strokeWidth="1.6" />
        <path d="M7 6V5a3 3 0 0 1 6 0v1" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="10" cy="12" r="1.5" fill="var(--accent)" />
      </svg>
    ),
    title: "Plagiarism-free guarantee",
    desc: "Every SOP is written uniquely for you. We run plagiarism checks before delivery and stand fully behind the originality of every statement we produce.",
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-bg" id="features">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-xs tracking-wider uppercase text-accent font-semibold mb-4">Capabilities</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl text-heading">
            Designed for <span className="text-accent">serious applicants</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-card p-8 rounded-xl border border-border hover:border-accent/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <div className="text-base font-bold text-heading mb-3">{f.title}</div>
                <div className="text-sm text-body leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
